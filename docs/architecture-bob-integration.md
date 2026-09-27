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

```python
# app/engine/bob_client.py
import os
import httpx

BOB_API_KEY = os.environ.get("BOB_API_KEY")
BOB_API_URL = os.environ.get("BOB_API_URL", "https://bob.ibm.com/v1")

async def invoke_bob_reasoning(prompt: str) -> str:
    headers = {"Authorization": f"Bearer {BOB_API_KEY}"}
    payload = {
        "model": "bob-2.0-reasoning",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.2,
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{BOB_API_URL}/chat/completions", json=payload, headers=headers)
        return resp.json()["choices"][0]["message"]["content"]
```
