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
    service's subgraph. Cyclic SCCs are detected using Tarjan's algorithm
    (O(N+E)) and add a penalty — replacing the prior exponential simple_cycles().

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

PERFORMANCE
-----------
  All signals run in O(N + E) where N = modules, E = dependency edges.
  Safe for repos with 5,000+ modules and 50,000+ edges.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Set, Tuple

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
        # Build adjacency sets for O(1) neighbour lookup
        self._adj: Dict[str, Set[str]] = {}
        self._radj: Dict[str, Set[str]] = {}
        for src, dst in repo_context.dependency_edges:
            self._adj.setdefault(src, set()).add(dst)
            self._radj.setdefault(dst, set()).add(src)

    def score_all(self, groupings: List[ServiceGrouping]) -> Tuple[List[ScoredService], List[str]]:
        """
        Score all proposed service groupings and calculate extraction order.

        Returns:
          - List[ScoredService]: scored results with recommended_extraction_order assigned
          - List[str]: unassigned module paths
        """
        # Pre-build module → service index for O(1) lookups in all signals
        module_to_service: Dict[str, str] = {}
        for g in groupings:
            for m in g.modules:
                module_to_service[m] = g.name

        assigned: Set[str] = set(module_to_service.keys())
        all_module_paths = {m.path for m in self.ctx.modules}
        unassigned = sorted(all_module_paths - assigned)

        scored = [
            self._score_service(g, groupings, module_to_service)
            for g in groupings
        ]

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
        self,
        grouping: ServiceGrouping,
        all_groupings: List[ServiceGrouping],
        module_to_service: Dict[str, str],
    ) -> ScoredService:
        module_set = set(grouping.modules)

        s_data, data_reasons = self._signal_shared_data(module_set)
        s_calls, call_reasons = self._signal_call_frequency(module_set, module_to_service, grouping.name)
        s_density, density_reasons = self._signal_graph_density(module_set)

        risk_score = round(
            min(1.0, max(0.0, W_DATA * s_data + W_CALLS * s_calls + W_DENSITY * s_density)),
            3,
        )

        raw_owned_tables = self._owned_tables(module_set)
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
    # Signal 1 — Shared Data Writes  O(tables + modules)
    # -----------------------------------------------------------------------

    def _signal_shared_data(
        self, module_set: Set[str]
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
    # Signal 2 — Cross-Module Call Frequency  O(E)
    # -----------------------------------------------------------------------

    def _signal_call_frequency(
        self,
        module_set: Set[str],
        module_to_service: Dict[str, str],
        service_name: str,
    ) -> Tuple[float, List[str]]:
        """
        Score: cross-boundary edges / total edges involving this service's modules.
        Uses pre-built module→service index for O(1) per-edge classification.
        """
        reasons: List[str] = []
        total_edges = 0
        cross_edges = 0
        cross_targets: Dict[str, int] = {}

        for src, dst in self.ctx.dependency_edges:
            src_here = src in module_set
            dst_here = dst in module_set
            if not (src_here or dst_here):
                continue
            total_edges += 1
            # Edge is cross-boundary if one end is inside and the other is in a DIFFERENT service
            src_svc = module_to_service.get(src)
            dst_svc = module_to_service.get(dst)
            if src_here and dst_svc and dst_svc != service_name:
                cross_edges += 1
                cross_targets[dst] = cross_targets.get(dst, 0) + 1
            elif dst_here and src_svc and src_svc != service_name:
                cross_edges += 1
                cross_targets[src] = cross_targets.get(src, 0) + 1

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
    # Signal 3 — Dependency Graph Density  O(N + E) via Tarjan SCCs
    # -----------------------------------------------------------------------

    def _signal_graph_density(self, module_set: Set[str]) -> Tuple[float, List[str]]:
        """
        Score: subgraph internal density + SCC-based cycle penalty.

        Uses Tarjan's Strongly Connected Components algorithm (O(N+E)) instead
        of nx.simple_cycles() which is exponential on large graphs.
        An SCC of size > 1 means there is a circular import cycle.
        """
        reasons: List[str] = []

        # Build adjacency only for modules in this service (avoid building full nx graph)
        nodes = list(module_set)
        if len(nodes) <= 1:
            return 0.0, []

        node_idx = {n: i for i, n in enumerate(nodes)}
        adj: List[List[int]] = [[] for _ in nodes]
        internal_edge_count = 0

        for src, dst in self.ctx.dependency_edges:
            if src in node_idx and dst in node_idx:
                adj[node_idx[src]].append(node_idx[dst])
                internal_edge_count += 1

        # Tarjan's SCC — O(N+E)
        n = len(nodes)
        index_counter = [0]
        stack: List[int] = []
        lowlink = [0] * n
        index = [-1] * n
        on_stack = [False] * n
        sccs: List[List[int]] = []

        def strongconnect(v: int) -> None:
            index[v] = index_counter[0]
            lowlink[v] = index_counter[0]
            index_counter[0] += 1
            stack.append(v)
            on_stack[v] = True

            for w in adj[v]:
                if index[w] == -1:
                    strongconnect(w)
                    lowlink[v] = min(lowlink[v], lowlink[w])
                elif on_stack[w]:
                    lowlink[v] = min(lowlink[v], index[w])

            if lowlink[v] == index[v]:
                scc: List[int] = []
                while True:
                    w = stack.pop()
                    on_stack[w] = False
                    scc.append(w)
                    if w == v:
                        break
                sccs.append(scc)

        import sys
        old_limit = sys.getrecursionlimit()
        sys.setrecursionlimit(max(old_limit, n + 1000))
        try:
            for v in range(n):
                if index[v] == -1:
                    strongconnect(v)
        finally:
            sys.setrecursionlimit(old_limit)

        cyclic_sccs = [scc for scc in sccs if len(scc) > 1]
        cycle_count = len(cyclic_sccs)

        if cycle_count > 0:
            reasons.append(
                f"{cycle_count} circular import cycle(s) detected within proposed boundary"
            )

        # Subgraph density: actual_edges / max_possible_edges
        max_edges = n * (n - 1)  # directed graph
        density = internal_edge_count / max_edges if max_edges > 0 else 0.0

        # Combine: base density + cycle penalty (capped at 1.0)
        cycle_penalty = min(0.4, cycle_count * 0.15)
        score = min(1.0, density + cycle_penalty)

        return score, reasons

    # -----------------------------------------------------------------------
    # Data ownership helpers  O(modules + tables)
    # -----------------------------------------------------------------------

    def _owned_tables(self, module_set: Set[str]) -> List[str]:
        """Tables written ONLY by this service (not by other modules)."""
        owned = []
        for table, writers in self.ctx.shared_table_writers.items():
            if writers.issubset(module_set):
                owned.append(table)
        for module in self.ctx.modules:
            if module.path in module_set:
                for table in module.table_writes:
                    if table not in owned:
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
