"""
Job store — in-memory job management for async analysis tasks.

Simple dict-based store. If you want persistence across server restarts,
swap this out for a Redis or PostgreSQL-backed store on Day 2.
"""

from __future__ import annotations

import uuid
from typing import Dict, Optional

from app.models.schemas import AnalysisResult, JobStatus


class JobStore:
    def __init__(self):
        self._statuses: Dict[str, JobStatus] = {}
        self._results: Dict[str, AnalysisResult] = {}

    def create_job(self) -> str:
        job_id = f"job_{uuid.uuid4().hex[:8]}"
        self._statuses[job_id] = JobStatus(
            job_id=job_id,
            status="queued",
            progress_pct=0,
            current_step="Queued — waiting to start",
            logs=[],
        )
        return job_id

    def get_status(self, job_id: str) -> Optional[JobStatus]:
        return self._statuses.get(job_id)

    def get_result(self, job_id: str) -> Optional[AnalysisResult]:
        return self._results.get(job_id)

    def update_step(self, job_id: str, step: str, progress_pct: int) -> None:
        status = self._statuses.get(job_id)
        if status:
            import time
            elapsed = int(time.time()) % 1000  # rough elapsed seconds
            log_line = f"[{elapsed:05d}ms] {step}"
            status.current_step = step
            status.progress_pct = progress_pct
            status.logs.append(log_line)
            if status.status == "queued":
                status.status = "running"

    def mark_done(self, job_id: str, result: AnalysisResult) -> None:
        if job_id in self._statuses:
            self._statuses[job_id].status = "done"
            self._statuses[job_id].progress_pct = 100
            self._statuses[job_id].current_step = "Analysis complete"
        self._results[job_id] = result

    def mark_failed(self, job_id: str, reason: str) -> None:
        if job_id in self._statuses:
            self._statuses[job_id].status = "failed"
            self._statuses[job_id].current_step = f"Failed: {reason}"


# Global singleton for this process
job_store = JobStore()
