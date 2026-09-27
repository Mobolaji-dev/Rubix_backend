# 🧠 Architecture & IBM Bob 2.0 Integration

Rubix is built around a **4-step LangGraph StateGraph agent pipeline** powered by **IBM Bob 2.0's whole-repository reasoning engine**.

---

## 🔄 The 4-Step LangGraph StateGraph Execution Pipeline

```text
 ┌───────────────────────────┐      ┌───────────────────────────┐
 │   Step 1: AST Extraction  │ ───► │  Step 2: IBM Bob 2.0      │
 │  (Parse modules & events) │      │  (Bounded context discovery)│
 └───────────────────────────┘      └───────────────────────────┘
                                                  │
                                                  ▼
 ┌───────────────────────────┐      ┌───────────────────────────┐
 │  Step 4: Candidate Ranker │ ◄─── │   Step 3: Coupling Audit  │
 │  (#1 Extract First order) │      │  (3-signal risk heuristic)│
 └───────────────────────────┘      └───────────────────────────┘
```

### Step 1: Code Structure & AST Extraction (`node_parse_and_extract`)
* Walks repository source trees, ignoring build noise (`.venv`, `node_modules`, `__pycache__`).
* Parses Python Abstract Syntax Trees (AST) using Python's native `ast` module to construct precise function call graphs and import dependency paths.
* Uses regex pattern matching to detect raw SQL queries (`INSERT INTO`, `UPDATE`, `DELETE`), SQLAlchemy ORM models, and Supabase client calls (`.from('table').insert()`).

### Step 2: Bounded Context Discovery via IBM Bob 2.0 (`node_identify_bounded_contexts`)
* Invokes **IBM Bob 2.0 API** (`app/engine/bob_client.py`).
* Passes extracted AST metadata, endpoint routers, and database table interactions to IBM Bob 2.0.
* IBM Bob 2.0 performs full-repository semantic reasoning to cluster files into cohesive Domain-Driven Design (DDD) Bounded Context candidates (e.g. *User Auth Context*, *Task Management Context*, *Analytics Context*).

### Step 3: Quantitative 3-Signal Coupling Audit (`node_audit_coupling`)
Calculates a 3-signal risk score evaluating domain entanglement:

$$\text{Risk Score} = 0.45 \cdot S_{\text{data}} + 0.35 \cdot S_{\text{calls}} + 0.20 \cdot S_{\text{density}}$$

Where:
* $S_{\text{data}}$: **Shared Write Signal** — Ratio of database tables written to by multiple bounded contexts.
* $S_{\text{calls}}$: **Call Frequency Signal** — Volume of cross-boundary function invocations between modules.
* $S_{\text{density}}$: **Graph Density Signal** — Ratio of active inter-module dependency edges to total possible edges.

### Step 4: Extraction Candidate Ranking (`node_rank_candidates`)
* Sorts proposed microservices by lowest risk score and lowest dependency fan-out.
* Assigns recommended extraction priority numbers (`recommended_extraction_order: 1`), tagging `#1 Extract First` for the candidate service with the cleanest isolation boundary.

---

## ⚡ IBM Bob 2.0 Client Implementation

Rubix invokes the official **IBM Bob 2.0 Shell CLI** (`bob run`) as a subprocess, injecting `BOB_API_KEY` into the process environment and authorizing execution with `--accept-license` and `--trust`:

```python
# app/engine/bob_client.py
import asyncio
import os
import json
from app.config import settings
from app.engine.parser import RepoContext
from app.engine.heuristic import ServiceGrouping

class BobClient:
    def __init__(self, api_key: str = None, on_step=None):
        self.api_key = api_key or settings.bob_api_key
        self.on_step = on_step or (lambda msg: None)

    async def analyse(self, repo_context: RepoContext) -> list[ServiceGrouping]:
        bob_bin = settings.bob_bin  # Locates 'bob' CLI executable
        prompt = self._build_bob_prompt(repo_context)
        
        env = os.environ.copy()
        env["BOB_API_KEY"] = self.api_key

        proc = await asyncio.create_subprocess_exec(
            bob_bin, "run",
            "--accept-license",
            "--trust",
            prompt,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
        )
        stdout, stderr = await asyncio.wait_for(proc.communicate(), timeout=120.0)
        output = stdout.decode("utf-8", errors="replace").strip()
        
        return self._parse_bob_output(output)
```
