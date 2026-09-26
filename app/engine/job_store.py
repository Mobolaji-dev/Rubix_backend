"""
job_store.py — Multi-worker file-backed job management for async analysis tasks.

Uses disk persistence under /tmp/rubix_jobs so jobs created by one worker process
can be polled cleanly by any other worker process or survive worker restarts.
"""

from __future__ import annotations

import json
import os
import time
import uuid
from pathlib import Path
from typing import Dict, Optional

from app.models.schemas import AnalysisResult, JobStatus


JOB_DIR = Path("/tmp/rubix_jobs")
JOB_DIR.mkdir(parents=True, exist_ok=True)


class JobStore:
    def __init__(self):
        self._statuses: Dict[str, JobStatus] = {}
        self._results: Dict[str, AnalysisResult] = {}

    def _status_path(self, job_id: str) -> Path:
        return JOB_DIR / f"{job_id}_status.json"

    def _result_path(self, job_id: str) -> Path:
        return JOB_DIR / f"{job_id}_result.json"

    def _write_status_to_disk(self, status: JobStatus) -> None:
        try:
            path = self._status_path(status.job_id)
            json_str = status.model_dump_json() if hasattr(status, "model_dump_json") else status.json()
            with open(path, "w", encoding="utf-8") as f:
                f.write(json_str)
        except Exception:
            pass

    def _write_result_to_disk(self, job_id: str, result: AnalysisResult) -> None:
        try:
            path = self._result_path(job_id)
            json_str = result.model_dump_json() if hasattr(result, "model_dump_json") else result.json()
            with open(path, "w", encoding="utf-8") as f:
                f.write(json_str)
        except Exception:
            pass

    def create_job(self) -> str:
        job_id = f"job_{uuid.uuid4().hex[:8]}"
        status = JobStatus(
            job_id=job_id,
            status="queued",
            progress_pct=0,
            current_step="Queued — waiting to start",
            logs=[],
        )
        self._statuses[job_id] = status
        self._write_status_to_disk(status)
        return job_id

    def get_status(self, job_id: str) -> Optional[JobStatus]:
        if job_id in self._statuses:
            return self._statuses[job_id]
        
        path = self._status_path(job_id)
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    status = JobStatus(**data)
                    self._statuses[job_id] = status
                    return status
            except Exception:
                return None
        return None

    def get_result(self, job_id: str) -> Optional[AnalysisResult]:
        if job_id in self._results:
            return self._results[job_id]

        path = self._result_path(job_id)
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    result = AnalysisResult(**data)
                    self._results[job_id] = result
                    return result
            except Exception:
                return None
        return None

    def update_step(self, job_id: str, step: str, progress_pct: int) -> None:
        status = self.get_status(job_id)
        if status:
            elapsed = int(time.time()) % 1000
            log_line = f"[{elapsed:05d}ms] {step}"
            status.current_step = step
            status.progress_pct = progress_pct
            status.logs.append(log_line)
            if status.status == "queued":
                status.status = "running"
            self._statuses[job_id] = status
            self._write_status_to_disk(status)

    def mark_done(self, job_id: str, result: AnalysisResult) -> None:
        status = self.get_status(job_id)
        if status:
            status.status = "done"
            status.progress_pct = 100
            status.current_step = "Analysis complete"
            self._statuses[job_id] = status
            self._write_status_to_disk(status)
        self._results[job_id] = result
        self._write_result_to_disk(job_id, result)

    def mark_failed(self, job_id: str, reason: str) -> None:
        status = self.get_status(job_id)
        if status:
            status.status = "failed"
            status.current_step = f"Failed: {reason}"
            self._statuses[job_id] = status
            self._write_status_to_disk(status)


# Global singleton for this process
job_store = JobStore()
