# Data Ownership Model

A major source of failure in microservice refactoring is shared database entanglement. Multiple services often read and write the same tables without a clear understanding of which service truly owns the data lifecycle.

Rubix addresses this by creating an explicit producer/consumer resource ownership map.

## Relationship classifications

For each data resource, Rubix classifies interactions into two clear modes:

| Relationship | Classification | Meaning |
| --- | --- | --- |
| `creates` | Producer / owner | The service owns the write lifecycle for the resource and is the authoritative creator. |
| `reads` | Consumer | The service reads or queries data created elsewhere and is marked with the originating owner. |

This distinction helps teams understand whether a service is an owner or simply a dependent consumer.

## Visual ownership model in Rubix

When Rubix displays service boundary cards, it highlights each resource by ownership type:

- `creates`: owned resources, shown in emerald green
- `reads`: external dependencies, shown in cyan blue
- `produced_by`: identifies the service that owns the data source

Example payload:

```json
{
  "proposed_name": "TaskService",
  "owned_data": [
    { "resource": "tasks", "relationship": "creates" },
    { "resource": "checkins", "relationship": "creates" }
  ],
  "external_dependencies": [
    {
      "resource": "users",
      "relationship": "reads",
      "produced_by": "UserService"
    }
  ]
}
```

## Business value

By identifying the service that produces a resource versus the service that only consumes it, Rubix helps prevent:

1. data ownership ambiguity
2. dual-write conflicts
3. database monolith traps
4. mixed lifecycle coupling across service boundaries

This is especially valuable before any extraction or migration begins, because ownership is one of the fastest ways to spot risky boundaries.

## Why it matters for decomposition

Service extraction is much safer when teams know which domain owns the data. Without that understanding, refactors lead to:

- duplicated writes
- inconsistent models
- hidden dependencies
- downstream failures after the split

Rubix reduces this risk by making ownership visible before the architecture is split apart.
