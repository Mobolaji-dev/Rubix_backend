"""
state.py — LangGraph Agent State Definition.

Defines the state schema passed between nodes in the Repo Decomposition LangGraph workflow.
"""

from __future__ import annotations
from typing import List, Optional, TypedDict

from app.engine.parser import RepoContext
from app.engine.heuristic import ServiceGrouping, ScoredService
from app.models.schemas import AnalysisResult


class DecompositionState(TypedDict):
    """
    Central state object passed between nodes in the LangGraph execution flow.
    """
    job_id: str
    repo_url: str
    repo_ref: str
    repo_path: str
    repo_context: Optional[RepoContext]          # AST-parsed codebase graph
    groupings: List[ServiceGrouping]              # Bounded context candidate services
    scored_services: List[ScoredService]          # Risk-scored services with relationships
    unassigned_modules: List[str]                 # Modules not assigned to any service
    result: Optional[AnalysisResult]             # Final output response payload
    logs: List[str]                               # Execution progress log entries
