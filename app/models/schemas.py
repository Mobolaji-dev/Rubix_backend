"""
Pydantic v1 schemas — exact PRD API contract shapes plus source field.
"""

from __future__ import annotations
from typing import List, Optional
from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Request models
# ---------------------------------------------------------------------------

class AnalyzeRequest(BaseModel):
    repo_url: str
    repo_ref: Optional[str] = "main"


# ---------------------------------------------------------------------------
# Job status
# ---------------------------------------------------------------------------

class JobStatus(BaseModel):
    job_id: str
    status: str  # queued | running | done | failed
    progress_pct: int = 0
    current_step: str = ""
    logs: List[str] = []


class JobCreated(BaseModel):
    job_id: str
    status: str = "queued"


# ---------------------------------------------------------------------------
# Result models
# ---------------------------------------------------------------------------

class DataResource(BaseModel):
    resource: str
    relationship: str  # "creates" | "reads" | "updates"


class ExternalDependency(BaseModel):
    resource: str
    relationship: str  # "reads" | "updates"
    produced_by: Optional[str] = None  # owning service, if known


class ProposedService(BaseModel):
    proposed_name: str
    owned_modules: List[str] = []
    owned_data: List[DataResource] = []
    external_dependencies: List[ExternalDependency] = []
    risk_score: float
    risk_reasons: List[str] = []
    fan_out_count: int = 0
    recommended_extraction_order: int = 1



class ResultSummary(BaseModel):
    total_modules: int
    unassigned_modules: List[str] = []


class AnalysisResult(BaseModel):
    job_id: str
    repo_url: str
    services: List[ProposedService]
    summary: ResultSummary

