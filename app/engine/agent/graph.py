"""
graph.py — LangGraph State Graph Assembly & Compilation.

Assembles the 4 nodes into a sequential StateGraph pipeline:
  parse_and_extract -> identify_bounded_contexts -> audit_coupling -> rank_candidates -> END
"""

from langgraph.graph import StateGraph, END

from app.engine.agent.state import DecompositionState
from app.engine.agent.nodes import (
    node_parse_and_extract,
    node_identify_bounded_contexts,
    node_audit_coupling,
    node_rank_candidates,
)


def build_decomposition_graph():
    """Build and compile the Repo Decomposition LangGraph State Graph."""
    workflow = StateGraph(DecompositionState)

    # Add 4 core nodes
    workflow.add_node("parse_and_extract", node_parse_and_extract)
    workflow.add_node("identify_bounded_contexts", node_identify_bounded_contexts)
    workflow.add_node("audit_coupling", node_audit_coupling)
    workflow.add_node("rank_candidates", node_rank_candidates)

    # Set flow edges
    workflow.set_entry_point("parse_and_extract")
    workflow.add_edge("parse_and_extract", "identify_bounded_contexts")
    workflow.add_edge("identify_bounded_contexts", "audit_coupling")
    workflow.add_edge("audit_coupling", "rank_candidates")
    workflow.add_edge("rank_candidates", END)

    return workflow.compile()


decomposition_graph = build_decomposition_graph()
