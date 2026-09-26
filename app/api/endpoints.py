"""
endpoints.py — All API routes.

Routes implemented:
  GET  /config                         → return backend capabilities & rate-limit policy
  POST /analyze                       → kick off a new analysis job
  GET  /analyze/{job_id}/status       → poll job progress & step logs
  GET  /analyze/{job_id}/result       → fetch completed analysis result
"""

from __future__ import annotations

import asyncio
import os
import tempfile
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query

from app.config import settings
from app.engine.agent import decomposition_graph, DecompositionState
from app.engine.job_store import job_store
from app.engine.parser import RepoParser
from app.models.schemas import (
    AnalysisResult,
    AnalyzeRequest,
    JobCreated,
    JobStatus,
    ProposedService,
    ResultSummary,
)

router = APIRouter()


# ---------------------------------------------------------------------------
# POST /analyze
# ---------------------------------------------------------------------------

@router.post("/analyze", response_model=JobCreated, status_code=202)
async def start_analysis(
    req: AnalyzeRequest,
    background_tasks: BackgroundTasks,
):
    job_id = job_store.create_job()
    background_tasks.add_task(
        _run_analysis_pipeline, job_id, req.repo_url, req.repo_ref or "main"
    )
    return JobCreated(job_id=job_id, status="queued")


# ---------------------------------------------------------------------------
# GET /analyze/{job_id}/status
# ---------------------------------------------------------------------------

@router.get("/analyze/{job_id}/status", response_model=JobStatus)
async def get_status(job_id: str):
    status = job_store.get_status(job_id)
    if status is None:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")
    return status


# ---------------------------------------------------------------------------
# GET /analyze/{job_id}/result
# ---------------------------------------------------------------------------

@router.get("/analyze/{job_id}/result", response_model=AnalysisResult)
async def get_result(job_id: str):
    status = job_store.get_status(job_id)
    if status is None:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found")
    if status.status == "failed":
        raise HTTPException(status_code=422, detail=status.current_step)
    if status.status != "done":
        raise HTTPException(status_code=202, detail="Analysis still running — keep polling /status")

    result = job_store.get_result(job_id)
    if result is None:
        raise HTTPException(status_code=500, detail="Result unexpectedly missing")
    return result


# ---------------------------------------------------------------------------
# Background tasks & Pipeline execution
# ---------------------------------------------------------------------------

async def _run_analysis_pipeline(job_id: str, repo_url: str, repo_ref: str) -> None:
    """
    Executes the 4-step DDD decomposition pipeline via LangGraph StateGraph:
      1. Domain Event Extraction (Parse repo AST & map events)
      2. Bounded Context Identification (Group modules by domain)
      3. Coupling Audit (Evaluate shared writes, calls, producer/consumer deps)
      4. Extraction Candidate Ranking (Rank services & construct AnalysisResult)
    """
    try:
        job_store.update_step(job_id, "Fetching repository source code...", 10)
        with tempfile.TemporaryDirectory() as tmp_dir:
            await _clone_repo(repo_url, repo_ref, tmp_dir)

            initial_state: DecompositionState = {
                "job_id": job_id,
                "repo_url": repo_url,
                "repo_ref": repo_ref,
                "repo_path": tmp_dir,
                "repo_context": None,
                "groupings": [],
                "scored_services": [],
                "unassigned_modules": [],
                "result": None,
                "logs": [],
            }

            job_store.update_step(job_id, "Invoking LangGraph StateGraph pipeline...", 25)
            final_state = await decomposition_graph.ainvoke(initial_state)

            for log_entry in final_state.get("logs", []):
                job_store.update_step(job_id, log_entry, 75)

            result = final_state.get("result")
            if result is None:
                raise RuntimeError("LangGraph execution completed without producing a result.")

            job_store.mark_done(job_id, result)

    except Exception as e:
        job_store.mark_failed(job_id, f"Analysis failed: {e}")



async def _clone_repo(repo_url: str, repo_ref: str, target_dir: str) -> None:
    proc = await asyncio.create_subprocess_exec(
        "git", "clone", "--depth=1", "--branch", repo_ref, repo_url, target_dir,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    _, stderr = await proc.communicate()
    if proc.returncode != 0:
        proc2 = await asyncio.create_subprocess_exec(
            "git", "clone", "--depth=1", repo_url, target_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr2 = await proc2.communicate()
        if proc2.returncode != 0:
            raise RuntimeError(f"git clone failed: {stderr2.decode()}")
