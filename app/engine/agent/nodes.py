"""
nodes.py — LangGraph Agent Node Definitions.

Each node represents one discrete phase in the 4-step DDD decomposition sequence:
  - Step 1: node_parse_and_extract (AST parsing & domain event storming)
  - Step 2: node_identify_bounded_contexts (IBM Bob 2.0 whole-repo context reasoning)
  - Step 3: node_audit_coupling (Coupling audit & data ownership analysis)
  - Step 4: node_rank_candidates (Extraction candidate ranking & payload formatting)
"""

from __future__ import annotations

from app.engine.agent.state import DecompositionState
from app.engine.agent.tools import (
    parse_repository_context,
    invoke_bob_reasoning,
    calculate_coupling_heuristics,
)
from app.models.schemas import AnalysisResult, ProposedService, ResultSummary


def node_parse_and_extract(state: DecompositionState) -> DecompositionState:
    """
    Step 1: Domain Event Extraction & AST Parsing.
    Walks repository source files, builds AST import/call dependency graph,
    and maps database table reads/writes.
    """
    ctx = parse_repository_context(repo_path=state["repo_path"], repo_url=state["repo_url"])
    state["repo_context"] = ctx
    state["logs"].append(
        f"[Step 1/4] Parsed repository — {ctx.total_module_count} modules indexed, "
        f"{len(ctx.dependency_edges)} dependency paths, {len(ctx.shared_table_writers)} tables mapped."
    )
    return state


async def node_identify_bounded_contexts(state: DecompositionState) -> DecompositionState:
    """
    Step 2: Bounded Context Identification (IBM Bob 2.0 Integration Slot).
    Invokes IBM Bob 2.0 reasoning over the full repository context to group source modules
    into cohesive domain microservices based on business capability.
    """
    ctx = state["repo_context"]
    groupings = await invoke_bob_reasoning(ctx, on_step=lambda msg: state["logs"].append(msg))
    state["groupings"] = groupings
    state["logs"].append(f"[Step 2/4] Identified {len(groupings)} bounded context candidate services via IBM Bob 2.0.")
    return state


def node_audit_coupling(state: DecompositionState) -> DecompositionState:
    """
    Step 3: Coupling & Data Ownership Audit.
    Evaluates 3-signal heuristic (shared data writes, cross-module calls, graph density)
    and maps explicit producer/consumer resource dependencies.
    """
    ctx = state["repo_context"]
    groupings = state["groupings"]
    scored, unassigned = calculate_coupling_heuristics(ctx, groupings)
    state["scored_services"] = scored
    state["unassigned_modules"] = unassigned
    state["logs"].append("[Step 3/4] Evaluated shared writes, call frequency, and producer/consumer data relationships.")
    return state


def node_rank_candidates(state: DecompositionState) -> DecompositionState:
    """
    Step 4: Extraction Candidate Ranking & Final Result Formatting.
    Sorts services by lowest risk score, lowest fan-out, and fewest external dependencies
    to assign recommended extraction order, then builds final AnalysisResult.
    """
    scored = state["scored_services"]
    ctx = state["repo_context"]
    unassigned = state["unassigned_modules"]

    result = AnalysisResult(
        job_id=state["job_id"],
        repo_url=state["repo_url"],
        services=[
            ProposedService(
                proposed_name=s.proposed_name,
                owned_modules=s.owned_modules,
                owned_data=s.owned_data,
                external_dependencies=s.external_dependencies,
                risk_score=s.risk_score,
                risk_reasons=s.risk_reasons,
                fan_out_count=s.fan_out_count,
                recommended_extraction_order=s.recommended_extraction_order,
            )
            for s in scored
        ],
        summary=ResultSummary(
            total_modules=ctx.total_module_count if ctx else 0,
            unassigned_modules=unassigned,
        ),
    )
    state["result"] = result
    state["logs"].append("[Step 4/4] Ranked extraction candidates and generated final analysis output.")
    return state
