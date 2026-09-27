# API Reference

The Rubix backend API is built using Python 3.14, FastAPI, and Pydantic v2. It uses an asynchronous job-polling architecture for repository analysis.

- Base production API URL: `https://rubixbackend.pxxl.click`
- Swagger/OpenAPI docs: `https://rubixbackend.pxxl.click/docs`

## 1. Start an analysis job (`POST /analyze`)

Initiates a four-step Domain-Driven Design decomposition pipeline for a GitHub repository.

- HTTP method: `POST`
- Endpoint: `/analyze`
- Status: `202 Accepted`

### Request body

```json
{
  "repo_url": "https://github.com/techbyFEMI/routine-backend",
  "repo_ref": "main"
}
```

### Response payload

```json
{
  "job_id": "job_38a42f10",
  "status": "queued"
}
```

## 2. Poll job status (`GET /analyze/{job_id}/status`)

Polls live execution progress, progress percentages, and terminal step logs.

- HTTP method: `GET`
- Endpoint: `/analyze/{job_id}/status`
- Status: `200 OK`

### Response payload while running

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

## 3. Fetch a completed analysis result (`GET /analyze/{job_id}/result`)

Retrieves the final microservice decomposition map, risk scores, and extraction order.

- HTTP method: `GET`
- Endpoint: `/analyze/{job_id}/result`
- Status: `200 OK`

### Response payload

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

## Notes

The API is designed to support a repository analysis workflow in which the user submits a codebase, waits for the pipeline to complete, and then inspects the resulting decomposition suggestions and boundary recommendations.
