"""
heuristic.py — 3-signal coupling & cohesion risk scorer.

ROLE IN PIPELINE
----------------
Runs AFTER bob_client.py has proposed service groupings.
Takes: (a) Bob's proposed service boundaries, (b) the RepoContext from parser.py.
Produces: a risk score (0.0–1.0) and a list of plain-English risk reasons
for each proposed service.

THE THREE SIGNALS
-----------------
  Signal 1 — Shared Data Writes (weight 0.45)
    How many of the tables this service writes to are *also* written by modules
    in other proposed services? A high ratio means a data ownership conflict —
    post-migration, two services would need to coordinate writes to the same table.

  Signal 2 — Cross-Module Call Frequency (weight 0.35)
    How many import/call edges cross the proposed service boundary?
    Counted as a fraction of total edges involving this service's modules.
    High = the service is tightly coupled to code outside its boundary.

  Signal 3 — Import/Dependency Graph Density (weight 0.20)
    Measured as the ratio of cross-boundary edges to total edges for this
    service's subgraph. Circular imports are detected and add a penalty.

FORMULA
-------
  risk_score = 0.45 * S_data + 0.35 * S_calls + 0.20 * S_density
  All three signals are normalised to [0.0, 1.0] before weighting.
  Final score is clamped to [0.0, 1.0].

RISK LABELS
-----------
  0.0 – 0.39  →  Low    (clean boundary, good seam)
  0.40 – 0.69  →  Medium (manageable coupling, worth noting)
  0.70 – 1.0   →  High   (deep entanglement, hard cut)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Set, Tuple

import networkx as nx

from app.engine.parser import RepoContext


# ---------------------------------------------------------------------------
# Input / output types
# ---------------------------------------------------------------------------

@dataclass
class ServiceGrouping:
    """
    A proposed service boundary — comes from Bob's reasoning output.
    Heuristic takes this as input and adds risk scores.
    """
    name: str
    modules: List[str]      # relative file paths belonging to this service


from app.models.schemas import DataResource, ExternalDependency


@dataclass
class ScoredService:
    """Final output per service — fed directly into the API response."""
    proposed_name: str
    owned_modules: List[str]
    owned_data: List[DataResource]
    external_dependencies: List[ExternalDependency]
    risk_score: float
    risk_reasons: List[str]
    fan_out_count: int = 0
    recommended_extraction_order: int = 1

    # Intermediate signals (useful for debugging/logging)
    s_data: float = 0.0
    s_calls: float = 0.0
    s_density: float = 0.0


# ---------------------------------------------------------------------------
# Weights (PRD Section 8)
# ---------------------------------------------------------------------------

W_DATA = 0.45
W_CALLS = 0.35
W_DENSITY = 0.20


# ---------------------------------------------------------------------------
# Heuristic engine
# ---------------------------------------------------------------------------

class HeuristicEngine:
    def __init__(self, repo_context: RepoContext):
        self.ctx = repo_context
        self._graph = self._build_graph()

    def score_all(self, groupings: List[ServiceGrouping]) -> Tuple[List[ScoredService], List[str]]:
        """
        Score all proposed service groupings and calculate extraction order.

        Returns:
          - List[ScoredService]: scored results with recommended_extraction_order assigned
          - List[str]: unassigned module paths
        """
        assigned: Set[str] = set()
        for g in groupings:
            assigned.update(g.modules)

        all_module_paths = {m.path for m in self.ctx.modules}
        unassigned = sorted(all_module_paths - assigned)

        scored = [self._score_service(g, groupings) for g in groupings]

        # Map owned table -> producing service name for dependency linking & fan-out counting
        table_producers: Dict[str, str] = {}
        for s in scored:
            for d in s.owned_data:
                if d.relationship in {"creates", "updates"}:
                    table_producers[d.resource] = s.proposed_name

        # Update produced_by on external_dependencies and calculate fan_out_count
        producer_fan_out: Dict[str, Set[str]] = {s.proposed_name: set() for s in scored}
        for s in scored:
            for dep in s.external_dependencies:
                if dep.resource in table_producers:
                    owner = table_producers[dep.resource]
                    if owner != s.proposed_name:
                        dep.produced_by = owner
                        producer_fan_out[owner].add(s.proposed_name)

        for s in scored:
            s.fan_out_count = len(producer_fan_out.get(s.proposed_name, set()))

        # Calculate extraction candidate ranking (Section 7, Step 4 of PRD)
        # Sort by lowest risk_score, then lowest fan_out_count, then fewest external_dependencies
        ranked = sorted(
            scored,
            key=lambda s: (s.risk_score, s.fan_out_count, len(s.external_dependencies), len(s.owned_modules))
        )
        for order, service in enumerate(ranked, start=1):
            service.recommended_extraction_order = order

        return scored, unassigned

    # -----------------------------------------------------------------------
    # Per-service scoring
    # -----------------------------------------------------------------------

    def _score_service(
        self, grouping: ServiceGrouping, all_groupings: List[ServiceGrouping]
    ) -> ScoredService:
        module_set = set(grouping.modules)
        other_modules = self._modules_outside(module_set, all_groupings)

        s_data, data_reasons = self._signal_shared_data(module_set, other_modules)
        s_calls, call_reasons = self._signal_call_frequency(module_set, other_modules)
        s_density, density_reasons = self._signal_graph_density(module_set)

        risk_score = round(
            min(1.0, max(0.0, W_DATA * s_data + W_CALLS * s_calls + W_DENSITY * s_density)),
            3,
        )

        raw_owned_tables = self._owned_tables(module_set, other_modules)
        raw_external_deps = self._external_table_deps(module_set, raw_owned_tables)

        owned_data = [
            DataResource(resource=t, relationship="creates") for t in sorted(raw_owned_tables)
        ]
        external_dependencies = [
            ExternalDependency(resource=t, relationship="reads") for t in sorted(raw_external_deps)
        ]

        risk_reasons = data_reasons + call_reasons + density_reasons
        if not risk_reasons:
            risk_reasons = ["No significant entanglement signals detected — clean boundary."]

        return ScoredService(
            proposed_name=grouping.name,
            owned_modules=sorted(grouping.modules),
            owned_data=owned_data,
            external_dependencies=external_dependencies,
            risk_score=risk_score,
            risk_reasons=risk_reasons,
            s_data=round(s_data, 3),
            s_calls=round(s_calls, 3),
            s_density=round(s_density, 3),
        )

    # -----------------------------------------------------------------------
    # Signal 1 — Shared Data Writes
    # -----------------------------------------------------------------------

    def _signal_shared_data(
        self, module_set: Set[str], other_modules: Set[str]
    ) -> Tuple[float, List[str]]:
        """
        Score: ratio of tables written by THIS service that are also written by
        modules OUTSIDE this service. 0 = no shared writes. 1 = all written tables shared.
        """
        reasons: List[str] = []
        this_written_tables: Set[str] = set()
        conflicting_tables: Set[str] = set()

        for module in self.ctx.modules:
            if module.path in module_set:
                this_written_tables.update(module.table_writes)

        for table, writers in self.ctx.shared_table_writers.items():
            if table in this_written_tables:
                external_writers = writers - module_set
                if external_writers:
                    conflicting_tables.add(table)
                    ext_list = ", ".join(sorted(external_writers)[:3])
                    reasons.append(
                        f"Shared write conflict on '{table}' table — "
                        f"also written by: {ext_list}"
                    )

        if not this_written_tables:
            return 0.0, []

        score = len(conflicting_tables) / len(this_written_tables)
        return score, reasons

    # -----------------------------------------------------------------------
    # Signal 2 — Cross-Module Call Frequency
    # -----------------------------------------------------------------------

    def _signal_call_frequency(
        self, module_set: Set[str], other_modules: Set[str]
    ) -> Tuple[float, List[str]]:
        """
        Score: cross-boundary edges / total edges involving this service's modules.
        """
        reasons: List[str] = []
        total_edges = 0
        cross_edges = 0
        cross_targets: Dict[str, int] = {}

        for src, dst in self.ctx.dependency_edges:
            if src in module_set or dst in module_set:
                total_edges += 1
                # Edge crosses the boundary
                if (src in module_set and dst in other_modules) or \
                   (dst in module_set and src in other_modules):
                    cross_edges += 1
                    target = dst if src in module_set else src
                    cross_targets[target] = cross_targets.get(target, 0) + 1

        if total_edges == 0:
            return 0.0, []

        score = cross_edges / total_edges

        if cross_edges > 0:
            top = sorted(cross_targets.items(), key=lambda x: -x[1])[:3]
            for target, count in top:
                reasons.append(
                    f"{count} cross-boundary call(s) to '{target}'"
                )

        return score, reasons

    # -----------------------------------------------------------------------
    # Signal 3 — Dependency Graph Density
    # -----------------------------------------------------------------------

    def _signal_graph_density(self, module_set: Set[str]) -> Tuple[float, List[str]]:
        """
        Score: fraction of edges within this service's subgraph that form cycles,
        plus a penalty for any cross-boundary cycles.
        Uses NetworkX cycle detection.
        """
        reasons: List[str] = []
        subgraph = self._graph.subgraph(module_set).copy()

        # Internal cycles penalty
        cycles = list(nx.simple_cycles(subgraph))
        if cycles:
            count = len(cycles)
            reasons.append(
                f"{count} circular import cycle(s) detected within proposed boundary"
            )

        # Density of the subgraph (0 = no internal edges, 1 = fully connected)
        density = nx.density(subgraph) if len(subgraph.nodes) > 1 else 0.0

        # Combine: base density + cycle penalty (capped at 1.0)
        cycle_penalty = min(0.4, len(cycles) * 0.15)
        score = min(1.0, density + cycle_penalty)

        return score, reasons

    # -----------------------------------------------------------------------
    # Data ownership helpers
    # -----------------------------------------------------------------------

    def _owned_tables(self, module_set: Set[str], other_modules: Set[str]) -> List[str]:
        """Tables written ONLY by this service (not by other modules)."""
        owned = []
        for table, writers in self.ctx.shared_table_writers.items():
            if writers.issubset(module_set):
                owned.append(table)
        # Also include tables read but not written by others — likely candidates
        for module in self.ctx.modules:
            if module.path in module_set:
                for table in module.table_writes:
                    if table not in owned:
                        # Check no external writers
                        external = self.ctx.shared_table_writers.get(table, set()) - module_set
                        if not external:
                            owned.append(table)
        return list(set(owned))

    def _external_table_deps(self, module_set: Set[str], owned_data: List[str]) -> List[str]:
        """Tables read by this service that it doesn't own (will become API calls post-migration)."""
        read_tables: Set[str] = set()
        for module in self.ctx.modules:
            if module.path in module_set:
                read_tables.update(module.table_reads)
        return sorted(read_tables - set(owned_data))

    # -----------------------------------------------------------------------
    # Graph / helpers
    # -----------------------------------------------------------------------

    def _build_graph(self) -> nx.DiGraph:
        g = nx.DiGraph()
        for module in self.ctx.modules:
            g.add_node(module.path)
        for src, dst in self.ctx.dependency_edges:
            g.add_edge(src, dst)
        return g

    def _modules_outside(
        self, module_set: Set[str], all_groupings: List[ServiceGrouping]
    ) -> Set[str]:
        """All module paths from other groupings."""
        outside: Set[str] = set()
        for g in all_groupings:
            if set(g.modules) != module_set:
                outside.update(g.modules)
        return outside
