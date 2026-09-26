# 🛠️ IBM Bob IDE Session Guide & Evidence Proof

The IBM Bob 2.0 Hackathon guidelines mandate proving **IBM Bob IDE usage** directly in the developer workspace.

Rubix preserves task session proof inside the **`bob_sessions/`** directory of our repository.

---

## 📸 Preserved Task Session Proof Screenshots (`bob_sessions/`)

| Screenshot File | Task Session Executed in IBM Bob IDE | Outcome |
|---|---|---|
| [`bob_sessions/team_task01_events.png`](../bob_sessions/team_task01_events.png) | **Task 1: Domain Event Storming** | Extracted domain events, API endpoint routes, and table triggers into an interactive visual event map. |
| [`bob_sessions/team_task02_contexts.png`](../bob_sessions/team_task02_contexts.png) | **Task 2: Bounded Context Mapping** | Clustered codebase modules into cohesive Domain-Driven Design (DDD) bounded contexts. |
| [`bob_sessions/team_task03_coupling.png`](../bob_sessions/team_task03_coupling.png) | **Task 3: In-Memory Coupling Audit** | Identified cross-boundary calls, shared database writes, and data ownership dependencies. |
| [`bob_sessions/team_task04_ranking.png`](../bob_sessions/team_task04_ranking.png) | **Task 4: Extraction Candidate Ranking** | Evaluated extraction isolation safety and assigned recommended extraction priority numbers (`#1 Extract First`). |

---

## 💬 Prompts to Run in IBM Bob IDE Chat

To reproduce these tasks inside IBM Bob IDE:

### Task 1: Domain Event Storming
```text
Analyze the routine-backend repository folder to perform Domain Event Storming across all modules. Extract and list all domain events, API endpoint commands/queries, and database table interactions. Group events by their primary business action (e.g. Task Created, Checkin Submitted, Leaderboard Updated).
```

### Task 2: Bounded Context Boundary Mapping
```text
Based on the routine-backend repository code and domain events, map all source modules into distinct Bounded Context candidates following Domain-Driven Design (DDD) principles. List each proposed bounded context name, its owned files/modules, and its primary domain responsibility.
```

### Task 3: In-Memory Coupling Audit
```text
Perform a coupling and data ownership audit across the proposed bounded contexts in routine-backend. Identify cross-context function calls, shared database tables, and explicit resource ownership—distinguishing which context CREATES a resource versus which context only READS it.
```

### Task 4: Extraction Candidate Ranking
```text
Rank the candidate bounded contexts in routine-backend by microservice extraction order (from lowest coupling risk to highest). Assign a recommended extraction sequence (highlighting #1 Extract First) for the candidate service with the lowest domain entanglement and lowest dependency fan-out.
```
