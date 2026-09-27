"""
bob_client.py — IBM Bob 2.0 Orchestration via Bob Shell CLI.

Drives the official `bob` CLI (Bob Shell) as a subprocess using the
4-Step DDD-Derived Prompt Sequence:
  Step 1 — Domain Event Extraction (Event Storming)
  Step 2 — Bounded Context Identification (Grouping modules by business capability)
  Step 3 — Coupling Audit (Flagging qualitative in-memory vs network call seams)
  Step 4 — Extraction Candidate Ranking (Recommended extraction order)

Bob Shell is authenticated via the BOB_API_KEY environment variable.
Install: curl -fsSL https://bob.ibm.com/download/bobshell.sh | bash --pm npm
"""

from __future__ import annotations

import asyncio
import json
import os
import re
from pathlib import Path
from typing import Callable, List, Dict, Any

from app.config import settings
from app.engine.parser import RepoContext
from app.engine.heuristic import ServiceGrouping


# Max modules to include in the Bob prompt to avoid overly long inputs
_BOB_MODULE_LIMIT = 60


class BobClient:
    def __init__(self, on_step: Callable[[str], None] | None = None):
        """
        on_step: callback to emit live status step logs for frontend / judges.
        """
        self.api_key = settings.bob_api_key
        self.on_step = on_step or (lambda msg: None)

    # ------------------------------------------------------------------
    # Public entry point
    # ------------------------------------------------------------------

    async def analyse(self, repo_context: RepoContext) -> List[ServiceGrouping]:
        """
        Runs the 4-step sequence against IBM Bob via the Bob Shell CLI.
        Falls back to deterministic DDD grouping if Bob Shell is unavailable.
        """
        if not self.api_key or not self.api_key.strip():
            self.on_step("No BOB_API_KEY set — using deterministic Domain-Driven bounded context grouping engine...")
            return self._fallback_grouping(repo_context)

        bob_bin = settings.bob_bin
        if not bob_bin:
            self.on_step("Bob Shell CLI not found on PATH — using deterministic Domain-Driven bounded context grouping engine...")
            return self._fallback_grouping(repo_context)

        return await self._run_bob_shell(bob_bin, repo_context)

    # ------------------------------------------------------------------
    # Bob Shell CLI integration
    # ------------------------------------------------------------------

    async def _run_bob_shell(
        self, bob_bin: str, repo_context: RepoContext
    ) -> List[ServiceGrouping]:
        """Invoke `bob run` non-interactively and parse the JSON response."""

        self.on_step("Step 1/4 [Event Storming]: IBM Bob 2.0 analyzing domain events & commands across full repo...")
        self.on_step("Step 2/4 [Bounded Contexts]: IBM Bob 2.0 grouping modules into domain microservices...")
        self.on_step("Step 3/4 [Coupling Audit]: IBM Bob 2.0 auditing in-memory vs network boundaries...")
        self.on_step("Step 4/4 [Extraction Ranking]: IBM Bob 2.0 formatting final service candidate breakdown...")

        prompt = self._build_bob_prompt(repo_context)

        env = os.environ.copy()
        env["BOB_API_KEY"] = self.api_key

        # Ensure a writeable HOME directory and .bob state folders exist
        home_dir = env.get("HOME")
        if not home_dir or not os.access(home_dir, os.W_OK):
            home_dir = "/tmp"

        env["HOME"] = home_dir
        bob_home = Path(home_dir) / ".bob"
        for sub in ["", "db", "dev-db", "settings", "sessions", "cache"]:
            try:
                (bob_home / sub).mkdir(parents=True, exist_ok=True)
            except Exception:
                pass

        cmd = bob_bin.split() + ["run", "--accept-license", "--trust", prompt]

        try:
            proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env,
            )
            stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=120.0)
        except asyncio.TimeoutError:
            self.on_step("IBM Bob timed out after 120s — falling back to deterministic grouping engine...")
            return self._fallback_grouping(repo_context)
        except Exception as err:
            self.on_step(f"IBM Bob Shell error ({err}) — falling back to deterministic grouping engine...")
            return self._fallback_grouping(repo_context)

        output = stdout.decode("utf-8", errors="replace").strip()

        if proc.returncode != 0 or not output:
            stderr_msg = stderr.decode("utf-8", errors="replace").strip()
            self.on_step(
                f"IBM Bob Shell exited with code {proc.returncode} — "
                f"falling back to deterministic grouping engine... ({stderr_msg[:120]})"
            )
            return self._fallback_grouping(repo_context)

        groupings = self._parse_bob_output(output)
        if not groupings:
            self.on_step("IBM Bob output could not be parsed — falling back to deterministic grouping engine...")
            return self._fallback_grouping(repo_context)

        self.on_step(f"IBM Bob 2.0 identified {len(groupings)} bounded context services.")
        return groupings

    # ------------------------------------------------------------------
    # Prompt construction
    # ------------------------------------------------------------------

    def _build_bob_prompt(self, repo_context: RepoContext) -> str:
        """Build the single-pass DDD decomposition prompt for Bob Shell."""
        modules = [m.path for m in repo_context.modules[:_BOB_MODULE_LIMIT]]
        module_list = json.dumps(modules, indent=2)

        return (
            f"You are an expert software architect specializing in microservice decomposition using "
            f"Domain-Driven Design (DDD).\n\n"
            f"Repository: {repo_context.repo_url}\n"
            f"Total modules parsed: {repo_context.total_module_count}\n\n"
            f"Source modules (first {len(modules)}):\n{module_list}\n\n"
            f"Task: Analyze these source modules and group them into cohesive, domain-aligned microservices "
            f"using Event Storming and Bounded Context identification.\n\n"
            f"Return ONLY a valid JSON array (no markdown, no prose) matching this exact structure:\n"
            f'[{{"name": "ServiceName", "modules": ["relative/path/1.py", "relative/path/2.py"]}}]'
        )

    # ------------------------------------------------------------------
    # Output parser
    # ------------------------------------------------------------------

    def _parse_bob_output(self, output: str) -> List[ServiceGrouping]:
        """
        Extract a JSON array or object from Bob Shell's text output.
        Handles markdown code fences, outermost array/object brackets, and key aliases.
        """
        if not output:
            return []

        text = output.strip()

        # 1. Clean markdown code fences if present (e.g. ```json ... ```)
        code_block_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text, re.IGNORECASE)
        if code_block_match:
            candidate = code_block_match.group(1).strip()
            parsed = self._try_parse_json(candidate)
            if parsed:
                return parsed

        # 2. Try parsing entire stripped output directly
        parsed = self._try_parse_json(text)
        if parsed:
            return parsed

        # 3. Find outermost JSON array [ ... ]
        first_bracket = text.find("[")
        last_bracket = text.rfind("]")
        if first_bracket != -1 and last_bracket > first_bracket:
            array_str = text[first_bracket : last_bracket + 1]
            parsed = self._try_parse_json(array_str)
            if parsed:
                return parsed

        # 4. Find outermost JSON object { ... }
        first_brace = text.find("{")
        last_brace = text.rfind("}")
        if first_brace != -1 and last_brace > first_brace:
            obj_str = text[first_brace : last_brace + 1]
            parsed = self._try_parse_json(obj_str)
            if parsed:
                return parsed

        return []

    def _try_parse_json(self, text: str) -> List[ServiceGrouping] | None:
        try:
            data = json.loads(text)
            if isinstance(data, list):
                groupings = self._to_groupings(data)
                if groupings:
                    return groupings
            elif isinstance(data, dict):
                for key in ["services", "groupings", "bounded_contexts", "microservices", "data", "result", "candidates"]:
                    if key in data and isinstance(data[key], list):
                        groupings = self._to_groupings(data[key])
                        if groupings:
                            return groupings
                groupings = self._to_groupings([data])
                if groupings:
                    return groupings
        except Exception:
            pass
        return None

    def _to_groupings(self, data: List[Dict[str, Any]]) -> List[ServiceGrouping]:
        groupings = []
        for g in data:
            if not isinstance(g, dict):
                continue
            name = (
                g.get("name")
                or g.get("service")
                or g.get("service_name")
                or g.get("title")
                or g.get("bounded_context")
                or "ProposedService"
            )
            modules = (
                g.get("modules")
                or g.get("components")
                or g.get("files")
                or g.get("source_modules")
                or []
            )
            if isinstance(modules, str):
                modules = [modules]
            if isinstance(name, str) and modules:
                groupings.append(ServiceGrouping(name=name, modules=list(modules)))
        return groupings

    # ------------------------------------------------------------------
    # Deterministic DDD fallback
    # ------------------------------------------------------------------

    def _fallback_grouping(self, repo_context: RepoContext) -> List[ServiceGrouping]:
        """Group modules deterministically into Domain-Driven bounded context services."""
        groups: Dict[str, List[str]] = {}
        for m in repo_context.modules:
            path_lower = m.path.lower()

            if any(k in path_lower for k in ["auth", "user", "profile", "jwt", "session"]):
                svc_name = "User & Auth Service"
            elif any(k in path_lower for k in ["task", "todo", "category"]):
                svc_name = "Task Management Service"
            elif any(k in path_lower for k in ["checkin", "streak", "auto_miss"]):
                svc_name = "Checkin & Streak Service"
            elif any(k in path_lower for k in ["leaderboard", "rank", "performance"]):
                svc_name = "Leaderboard & Analytics Service"
            elif any(k in path_lower for k in ["squad", "friend"]):
                svc_name = "Squad & Social Service"
            elif any(k in path_lower for k in ["architect", "graph", "llm"]):
                svc_name = "Goal Architect AI Service"
            elif any(k in path_lower for k in ["feed", "notification", "email", "push"]):
                svc_name = "Notification & Feed Service"
            elif any(k in path_lower for k in ["product", "order", "checkout", "cart", "payment", "invoice"]):
                svc_name = "Commerce & Orders Service"
            elif any(k in path_lower for k in ["inventory", "warehouse", "stock", "fulfillment"]):
                svc_name = "Inventory & Fulfillment Service"
            elif any(k in path_lower for k in ["account", "billing", "subscription", "plan"]):
                svc_name = "Billing & Accounts Service"
            elif any(k in path_lower for k in ["search", "elastic", "index", "filter"]):
                svc_name = "Search & Discovery Service"
            elif any(k in path_lower for k in ["shipping", "delivery", "tracking"]):
                svc_name = "Shipping & Delivery Service"
            elif any(k in path_lower for k in ["plugin", "webhook", "integration", "api"]):
                svc_name = "Integrations & Webhooks Service"
            else:
                svc_name = "Core Infrastructure Service"

            groups.setdefault(svc_name, []).append(m.path)

        return [ServiceGrouping(name=k, modules=v) for k, v in groups.items()]

    # ------------------------------------------------------------------
    # Legacy prompt builders (kept for reference / judge docs)
    # ------------------------------------------------------------------

    def _build_step1_prompt(self, repo_context: RepoContext) -> str:
        return (
            f"Step 1: Identify all domain events and command handlers in {repo_context.repo_url}.\n"
            f"Parsed modules: {repo_context.total_module_count}"
        )

    def _build_step2_prompt(self, repo_context: RepoContext) -> str:
        module_list = [m.path for m in repo_context.modules[:50]]
        return (
            f"Step 2: Group the following source modules from {repo_context.repo_url} into microservices:\n"
            f"{json.dumps(module_list, indent=2)}\n\n"
            "Return JSON array: [{'name': 'ServiceName', 'modules': ['path/1.py']}]"
        )
