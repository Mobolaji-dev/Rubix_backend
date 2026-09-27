"""
parser.py — Static repository analyser.

ROLE IN PIPELINE
----------------
Runs BEFORE bob_client.py. Its job is to build a structured map of the
repository that gets sent to IBM Bob as context. Bob then reasons over this
context to identify service boundaries.

The parser does three things:
  1. Walks the file tree and classifies modules.
  2. Builds an import dependency graph (who imports who) using Python's ast module.
  3. Detects cross-module function calls and database/ORM table write operations.

OUTPUT
------
A RepoContext object: structured data ready to be serialised and sent to Bob,
and also consumed directly by heuristic.py for quantitative scoring.
"""

from __future__ import annotations

import ast
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Set, Tuple


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class ModuleInfo:
    """Represents a single Python (or JS) source file in the repo."""
    path: str                              # relative path from repo root
    imports: List[str] = field(default_factory=list)    # modules this file imports
    calls_to: List[str] = field(default_factory=list)   # external module calls detected
    table_writes: List[str] = field(default_factory=list)  # DB tables written (insert/update/delete)
    table_reads: List[str] = field(default_factory=list)   # DB tables read (select)


@dataclass
class RepoContext:
    """Full repository context passed to Bob and the heuristic engine."""
    repo_url: str
    modules: List[ModuleInfo] = field(default_factory=list)
    # Edges: (from_module, to_module) — represents an import or call relationship
    dependency_edges: List[Tuple[str, str]] = field(default_factory=list)
    # Table name → set of module paths that write to it
    shared_table_writers: Dict[str, Set[str]] = field(default_factory=dict)
    total_module_count: int = 0


# ---------------------------------------------------------------------------
# SQL / ORM write pattern detection
# ---------------------------------------------------------------------------

# Patterns that indicate a write operation to a database table.
# Covers raw SQL, SQLAlchemy, and Supabase-style client calls.
_WRITE_PATTERNS = [
    # Raw SQL
    re.compile(r"INSERT\s+INTO\s+['\"]?(\w+)['\"]?", re.IGNORECASE),
    re.compile(r"UPDATE\s+['\"]?(\w+)['\"]?\s+SET", re.IGNORECASE),
    re.compile(r"DELETE\s+FROM\s+['\"]?(\w+)['\"]?", re.IGNORECASE),
    # SQLAlchemy ORM: db.add(Model()), session.delete(), session.execute()
    re.compile(r"db\.add\((\w+)\("),
    re.compile(r"session\.delete\((\w+)"),
    # Supabase Python client: supabase.table("tablename").insert()/update()/delete()
    re.compile(r'\.table\(["\'](\w+)["\']\)\.(insert|update|delete|upsert)'),
]

_READ_PATTERNS = [
    re.compile(r"SELECT\s+.+FROM\s+['\"]?(\w+)['\"]?", re.IGNORECASE),
    re.compile(r'\.table\(["\'](\w+)["\']\)\.(select)'),
]

# Files/directories to skip
_SKIP_DIRS = {
    ".git", "__pycache__", "node_modules", ".venv", "venv",
    "dist", "build", ".next", "migrations", "alembic",
}
_ALLOWED_EXTENSIONS = {".py", ".js", ".jsx", ".ts", ".tsx", ".go", ".java"}


# ---------------------------------------------------------------------------
# Core parser
# ---------------------------------------------------------------------------

class RepoParser:
    def __init__(self, repo_path: str, repo_url: str):
        self.repo_path = Path(repo_path).resolve()
        self.repo_url = repo_url

    def parse(self) -> RepoContext:
        """Walk the repo and produce a RepoContext."""
        ctx = RepoContext(repo_url=self.repo_url)
        module_map: Dict[str, ModuleInfo] = {}

        for file_path in self._walk_files():
            rel_path = str(file_path.relative_to(self.repo_path))
            module = ModuleInfo(path=rel_path)

            source = self._read_file(file_path)
            if source is None:
                continue

            if file_path.suffix == ".py":
                self._analyse_python(source, module)
            elif file_path.suffix in {".js", ".jsx", ".ts", ".tsx"}:
                self._analyse_js(source, module)

            module_map[rel_path] = module

        ctx.modules = list(module_map.values())
        ctx.total_module_count = len(ctx.modules)
        ctx.dependency_edges = self._build_edges(module_map)
        ctx.shared_table_writers = self._find_shared_writers(module_map)

        return ctx

    # -----------------------------------------------------------------------
    # Python analysis
    # -----------------------------------------------------------------------

    def _analyse_python(self, source: str, module: ModuleInfo) -> None:
        """Extract imports and detect table write/read operations from Python source."""
        # Parse imports via AST for accuracy
        try:
            tree = ast.parse(source)
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        module.imports.append(alias.name)
                elif isinstance(node, ast.ImportFrom):
                    if node.module:
                        module.imports.append(node.module)
        except SyntaxError:
            # Fall back to regex for files that can't be parsed
            for match in re.finditer(r"^(?:import|from)\s+([\w.]+)", source, re.MULTILINE):
                module.imports.append(match.group(1))

        # Detect table writes/reads via pattern matching on source text
        for pattern in _WRITE_PATTERNS:
            for match in pattern.finditer(source):
                table_name = match.group(1).lower()
                if table_name not in module.table_writes:
                    module.table_writes.append(table_name)

        for pattern in _READ_PATTERNS:
            for match in pattern.finditer(source):
                table_name = match.group(1).lower()
                if table_name not in module.table_reads:
                    module.table_reads.append(table_name)

    # -----------------------------------------------------------------------
    # JS/TS analysis (lighter — import regex rather than full AST)
    # -----------------------------------------------------------------------

    def _analyse_js(self, source: str, module: ModuleInfo) -> None:
        """Extract ES6 imports and Supabase table operations from JS/TS source."""
        # ES6 imports: import X from 'path' / import { X } from 'path'
        for match in re.finditer(r"from\s+['\"]([^'\"]+)['\"]", source):
            module.imports.append(match.group(1))

        # Supabase JS client: supabase.from('tablename').insert()/update()/delete()
        for match in re.finditer(r"\.from\(['\"](\w+)['\"]\)\.(select|insert|update|delete|upsert)", source):
            table = match.group(1).lower()
            op = match.group(2).lower()
            if op in {"insert", "update", "delete", "upsert"}:
                if table not in module.table_writes:
                    module.table_writes.append(table)
            else:
                if table not in module.table_reads:
                    module.table_reads.append(table)

    # -----------------------------------------------------------------------
    # Graph construction
    # -----------------------------------------------------------------------

    def _build_edges(self, module_map: Dict[str, ModuleInfo]) -> List[Tuple[str, str]]:
        """Convert import lists into directed dependency edges between known modules."""
        edges: List[Tuple[str, str]] = []
        known_paths = set(module_map.keys())

        # Pre-build O(1) suffix index map for instant import resolution
        suffix_map: Dict[str, str] = {}
        for path in known_paths:
            suffix_map[path] = path
            parts = path.split("/")
            for i in range(1, len(parts)):
                suffix = "/".join(parts[i:])
                if suffix not in suffix_map:
                    suffix_map[suffix] = path

        for src_path, module in module_map.items():
            for imported in module.imports:
                candidate = self._resolve_import(imported, suffix_map)
                if candidate and candidate != src_path:
                    edges.append((src_path, candidate))

        return edges

    def _resolve_import(self, import_name: str, suffix_map: Dict[str, str]) -> str | None:
        """O(1) dictionary lookup to map an import string to a known file path."""
        as_path = import_name.replace(".", "/") + ".py"
        if as_path in suffix_map:
            return suffix_map[as_path]

        parts = import_name.split(".")
        for depth in range(len(parts)):
            candidate = "/".join(parts[depth:]) + ".py"
            if candidate in suffix_map:
                return suffix_map[candidate]

        return None

    def _find_shared_writers(self, module_map: Dict[str, ModuleInfo]) -> Dict[str, Set[str]]:
        """Return a map of table_name → {modules that write to it}."""
        writers: Dict[str, Set[str]] = {}
        for path, module in module_map.items():
            for table in module.table_writes:
                writers.setdefault(table, set()).add(path)
        return writers

    # -----------------------------------------------------------------------
    # File helpers
    # -----------------------------------------------------------------------

    def _walk_files(self):
        """Yield all source code files in the repo, skipping non-code noise."""
        for root, dirs, files in os.walk(self.repo_path):
            dirs[:] = [d for d in dirs if d not in _SKIP_DIRS and not d.startswith(".")]
            for fname in files:
                fpath = Path(root) / fname
                if fpath.suffix.lower() in _ALLOWED_EXTENSIONS:
                    yield fpath

    def _read_file(self, path: Path) -> str | None:
        try:
            return path.read_text(encoding="utf-8", errors="ignore")
        except Exception:
            return None
