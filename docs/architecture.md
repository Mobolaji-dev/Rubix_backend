# Architecture and IBM Bob 2.0 Integration

Rubix is built around a four-step LangGraph StateGraph agent pipeline powered by IBM Bob 2.0 whole-repository reasoning.

## Four-step execution pipeline

```text
┌────────────────────────────┐      ┌────────────────────────────┐
│ Step 1: AST extraction     │ ───► │ Step 2: IBM Bob 2.0       │
│ Parse modules and events   │      │ Bounded context discovery  │
└────────────────────────────┘      └────────────────────────────┘
                                              │
                                              ▼
┌────────────────────────────┐      ┌────────────────────────────┐
│ Step 4: Candidate ranker  │ ◄─── │ Step 3: Coupling audit    │
│ Recommended extraction     │      │ 3-signal risk heuristic   │
└────────────────────────────┘      └────────────────────────────┘
```

### Step 1: code structure and AST extraction

The pipeline begins by scanning repository files and ignoring noisy folders such as:

- `.venv`
- `node_modules`
- `__pycache__`
- generated folders

It parses Python AST and builds a function and import dependency model. This creates a structured view of:

- files and modules
- function calls
- import relationships
- database interactions
- raw SQL patterns

The analysis also looks for SQL queries and ORM patterns that may indicate shared resource ownership or cross-domain coupling.

### Step 2: bounded context discovery via IBM Bob 2.0

Rubix invokes the IBM Bob 2.0 reasoning layer using repository metadata, extracted AST facts, and endpoint and database interaction information.

This step clusters modules into cohesive Domain-Driven Design bounded contexts such as:

- user auth context
- task management context
- analytics context
- billing or reporting context

The goal is to find domain groupings that resemble natural service boundaries rather than code folders alone.

### Step 3: quantitative 3-signal coupling audit

The coupling audit measures the degree of architectural entanglement across the proposed bounded contexts using a weighted risk model:

$$
\text{Risk Score} = 0.45 \cdot S_{\text{data}} + 0.35 \cdot S_{\text{calls}} + 0.20 \cdot S_{\text{density}}
$$

Where:

- $S_{\text{data}}$: shared write signal
- $S_{\text{calls}}$: call frequency signal
- $S_{\text{density}}$: dependency graph density signal

This means Rubix estimates risk based on:

- how many tables are written by multiple contexts
- how frequently contexts call each other
- how dense the inter-module dependency graph is

### Step 4: extraction candidate ranking

Finally, Rubix ranks the suggested services by:

- lowest risk score
- lowest dependency fan-out
- strongest domain isolation

Recommended extraction order is then assigned, such as `recommended_extraction_order: 1`, which identifies the best first candidate to split out.

## IBM Bob 2.0 client implementation

Rubix drives the official **IBM Bob 2.0 Shell CLI** (`bob run`) as an asynchronous subprocess, passing whole-repository AST analysis prompts and recording token usage automatically:

```python
# app/engine/bob_client.py
import asyncio
import os
from app.config import settings
from app.engine.parser import RepoContext
from app.engine.heuristic import ServiceGrouping

class BobClient:
    async def analyse(self, repo_context: RepoContext) -> list[ServiceGrouping]:
        bob_bin = settings.bob_bin  # Auto-discovers 'bob' binary path
        prompt = self._build_bob_prompt(repo_context)
        
        env = os.environ.copy()
        env["BOB_API_KEY"] = self.api_key

        proc = await asyncio.create_subprocess_exec(
            bob_bin, "run", "--accept-license", "--trust", prompt,
            stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE, env=env,
        )
        stdout, _ = await asyncio.wait_for(proc.communicate(), timeout=120.0)
        return self._parse_bob_output(stdout.decode("utf-8", errors="replace"))
```

## Why this architecture matters

The value of Rubix comes from combining static analysis with repository-wide semantic reasoning. This allows the system to surface not just module relationships, but also the business-level boundaries that matter for service decomposition.
