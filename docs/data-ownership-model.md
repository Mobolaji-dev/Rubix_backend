# 📊 Producer/Consumer Data Ownership Model

A major failure in microservice refactoring is **shared database entanglement**: multiple services reading and writing to the same database tables without clear domain ownership.

Rubix solves this by establishing explicit **Producer / Consumer Resource Ownership Mapping**.

---

## 🔑 Data Relationship Classifications

For every data resource (database table, cache key, domain event stream), Rubix categorizes service interactions into two explicit modes:

| Relationship | Classification | Meaning |
|---|---|---|
| `creates` | **Producer / Owner** | The service that owns the write lifecycle of the entity (executes `INSERT` / `UPSERT` / model creation). |
| `reads` | **Consumer** | A service that reads or queries the resource created by another service. Tagged with a `produced_by` owner badge. |

---

## 🏷️ Visual Badge System in Rubix

When viewing microservice boundary cards in the Rubix dashboard ([`https://rubix.pxxl.click/`](https://rubix.pxxl.click/)):

* **Owned Resources (`creates`)**: Highlighted in **Emerald Green**, indicating this service is the authoritative owner of the data model.
* **External Dependencies (`reads`)**: Highlighted in **Cyan Blue**, displaying an explicit `produced_by: "AuthService"` tag indicating which service owns the underlying entity.

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

---

## 🛡️ Business Value

By identifying data producers versus data consumers before code extraction begins, Rubix prevents:
1. **Data Ownership Ambiguity**: Eliminates dual-write conflicts across services.
2. **Database Monolith Traps**: Guides architects on which database tables must be split or converted into asynchronous API events.
