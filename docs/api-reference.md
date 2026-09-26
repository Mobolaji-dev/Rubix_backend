# 🔌 REST API Reference

The Rubix backend API is built using **Python 3.14 + FastAPI + Pydantic v2**, featuring an asynchronous job-polling architecture.

* **Base Production API URL**: `https://rubixbackend.pxxl.click`
* **Swagger OpenAPI Docs**: `https://rubixbackend.pxxl.click/docs`

---

## 1. Kick Off Analysis Job (`POST /analyze`)

Initiates a 4-step DDD decomposition pipeline for a GitHub repository.

* **HTTP Method**: `POST`
* **Endpoint**: `/analyze`
* **Status Code**: `202 Accepted`

### Request Body
```json
{
  "repo_url": "https://github.com/techbyFEMI/routine-backend",
  "repo_ref": "main"
}
```

### Response Payload
```json
{
  "job_id": "job_38a42f10",
  "status": "queued"
}
```

---

## 2. Poll Job Execution Status (`GET /analyze/{job_id}/status`)

Polls live execution progress, progress percentages, and terminal step logs.

* **HTTP Method**: `GET`
* **Endpoint**: `/analyze/{job_id}/status`
* **Status Code**: `200 OK`

### Response Payload (Running)
```json
{
  "job_id": "job_38a42f10",
  "status": "running",
  "progress_pct": 50,
  "current_step": "Step 3/4: Evaluated shared writes, call frequency, and producer/consumer data relationships.",
  "logs": [
    "[00412ms] Fetching repository source code...",
    "[00419ms] Invoking LangGraph StateGraph pipeline...",
    "[00845ms] [Step 1/4] Parsed repository — 12 modules indexed.",
    "[01250ms] [Step 2/4] Identified 3 bounded context candidates via IBM Bob 2.0."
  ]
}
```

---

## 3. Fetch Completed Analysis Result (`GET /analyze/{job_id}/result`)

Retrieves the final microservice decomposition map, risk scores, and extraction order.

* **HTTP Method**: `GET`
* **Endpoint**: `/analyze/{job_id}/result`
* **Status Code**: `200 OK`

### Response Payload
```json
{
  "job_id": "job_38a42f10",
  "repo_url": "https://github.com/techbyFEMI/routine-backend",
  "services": [
    {
      "proposed_name": "Task & Workflow Service",
      "owned_modules": ["routine_api/routers/tasks.py", "routine_api/routers/checkins.py"],
      "owned_data": [
        { "resource": "tasks", "relationship": "creates" },
        { "resource": "checkins", "relationship": "creates" }
      ],
      "external_dependencies": [
        { "resource": "users", "relationship": "reads", "produced_by": "User & Auth Service" }
      ],
      "risk_score": 0.18,
      "risk_reasons": ["Low cross-context calls", "Isolated database writes"],
      "fan_out_count": 1,
      "recommended_extraction_order": 1
    }
  ],
  "summary": {
    "total_modules": 12,
    "unassigned_modules": []
  }
}
```
