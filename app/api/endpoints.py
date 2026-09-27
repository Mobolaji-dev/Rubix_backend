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
def _clean_directory(dir_path: str) -> None:
    """Safely empties a directory without deleting the root folder itself."""
    if os.path.exists(dir_path):
        for item in os.listdir(dir_path):
            item_path = os.path.join(dir_path, item)
            if os.path.isdir(item_path):
                shutil.rmtree(item_path, ignore_errors=True)
            else:
                try:
                    os.remove(item_path)
                except Exception:
                    pass


def _get_temp_parent_dir() -> str:
    """
    Finds the first available writable directory for temporary repository clones.
    Prioritizes local disk space (.tmp) over system RAM-backed /tmp (tmpfs).
    """
    candidates = [
        os.path.join(os.getcwd(), ".tmp"),
        "/var/tmp",
        tempfile.gettempdir(),
        "/tmp",
    ]
    for path in candidates:
        try:
            test_dir = os.path.join(path, ".rubix_write_test")
            os.makedirs(test_dir, exist_ok=True)
            test_file = os.path.join(test_dir, "test.txt")
            with open(test_file, "w") as f:
                f.write("ok")
            os.remove(test_file)
            os.rmdir(test_dir)
            return path
        except Exception:
            continue
    return tempfile.gettempdir()


import shutil

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
        temp_parent = _get_temp_parent_dir()
        with tempfile.TemporaryDirectory(dir=temp_parent) as tmp_dir:
            await _clone_repo(repo_url, repo_ref, tmp_dir)

            # Strip heavy .git history immediately to minimize disk & RAM footprint
            git_dir = os.path.join(tmp_dir, ".git")
            if os.path.exists(git_dir):
                shutil.rmtree(git_dir, ignore_errors=True)

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



import io
import re
import urllib.request
import zipfile

async def _clone_repo(repo_url: str, repo_ref: str, target_dir: str) -> None:
    """
    Attempts git clone first. If git is missing or fails,
    falls back to downloading and extracting GitHub repository zipball via pure Python.
    Cleans target_dir before each attempt so git never complains about non-empty destination.
    """
    try:
        _clean_directory(target_dir)
        proc = await asyncio.create_subprocess_exec(
            "git", "clone", "--depth=1", "--branch", repo_ref, repo_url, target_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr = await proc.communicate()
        if proc.returncode == 0:
            return

        _clean_directory(target_dir)
        proc2 = await asyncio.create_subprocess_exec(
            "git", "clone", "--depth=1", repo_url, target_dir,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        _, stderr2 = await proc2.communicate()
        if proc2.returncode == 0:
            return
    except (FileNotFoundError, Exception):
        pass

    # Fallback: Pure Python GitHub Zip download
    _clean_directory(target_dir)
    await _download_github_zip(repo_url, repo_ref, target_dir)


_SKIP_EXTENSIONS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico",
    ".mp4", ".mov", ".avi", ".mp3", ".pdf", ".zip", ".gz", ".tar",
    ".woff", ".woff2", ".ttf", ".eot", ".wasm", ".so", ".dylib",
    ".dll", ".exe", ".bin", ".pyc", ".pyo", ".db", ".sqlite"
}

def _download_github_zip_sync(repo_url: str, repo_ref: str, target_dir: str) -> None:
    clean_url = repo_url.rstrip("/").removesuffix(".git")
    match = re.search(r"github\.com/([^/]+)/([^/]+)", clean_url)
    if not match:
        raise RuntimeError(f"Could not parse GitHub repository URL: '{repo_url}'")

    owner, repo = match.group(1), match.group(2)
    branch = repo_ref or "main"
    github_token = os.environ.get("GITHUB_TOKEN") or getattr(settings, "GITHUB_TOKEN", None)

    urls_to_try = [
        f"https://api.github.com/repos/{owner}/{repo}/zipball/{branch}",
        f"https://codeload.github.com/{owner}/{repo}/zip/refs/heads/{branch}",
        f"https://codeload.github.com/{owner}/{repo}/zip/refs/heads/main",
        f"https://codeload.github.com/{owner}/{repo}/zip/refs/heads/master",
        f"https://github.com/{owner}/{repo}/archive/HEAD.zip",
    ]

    downloaded_bytes = None
    headers = {"User-Agent": "Rubix-Decomposition-Advisor/1.0"}
    if github_token:
        headers["Authorization"] = f"token {github_token}"

    for zip_url in urls_to_try:
        try:
            req = urllib.request.Request(zip_url, headers=headers)
            with urllib.request.urlopen(req, timeout=25) as resp:
                if resp.status == 200:
                    downloaded_bytes = resp.read()
                    break
        except Exception:
            continue

    if not downloaded_bytes:
        raise RuntimeError(
            f"Failed to fetch repository zip archive for '{owner}/{repo}'. "
            f"If '{owner}/{repo}' is a private repository, please change its visibility to Public on GitHub."
        )

    with zipfile.ZipFile(io.BytesIO(downloaded_bytes)) as zf:
        namelist = zf.namelist()
        if not namelist:
            raise RuntimeError("Repository zip archive is empty.")

        root_folder = namelist[0].split("/")[0]
        for member in zf.infolist():
            rel_path = member.filename[len(root_folder) + 1 :]
            if not rel_path:
                continue
            ext = os.path.splitext(rel_path)[1].lower()
            if ext in _SKIP_EXTENSIONS:
                continue
            dest_path = os.path.join(target_dir, rel_path)
            if member.is_dir():
                os.makedirs(dest_path, exist_ok=True)
            else:
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with zf.open(member) as source, open(dest_path, "wb") as target:
                    target.write(source.read())


async def _download_github_zip(repo_url: str, repo_ref: str, target_dir: str) -> None:
    await asyncio.to_thread(_download_github_zip_sync, repo_url, repo_ref, target_dir)

