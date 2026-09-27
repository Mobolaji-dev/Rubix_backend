# 🏗️ Repo Decomposition Advisor

**AI-Powered Microservice Boundary Advisor for IBM Bob 2.0**  
*IBM Bob 2.0 Hackathon Submission (Sep 25–27, 2026)*

---

## 📌 Executive Summary

Engineering teams moving monolithic codebases to microservices face a high-friction, error-prone manual task: **figuring out where service boundaries actually exist**. Boundary detection structurally requires understanding coupling, call frequencies, and data ownership across an entire repository—not just individual files.

**Repo Decomposition Advisor** solves this workflow using **IBM Bob 2.0 full-repository context reasoning** combined with a **4-step Domain-Driven Design (DDD) LangGraph agent** and a quantitative **3-signal coupling heuristic**.

---

## 🚀 Key Features

- **4-Step DDD LangGraph Agent**: Orchestrates whole-repo reasoning:
  1. *Domain Event Extraction* (AST parsing & event storming across endpoints)
  2. *Bounded Context Identification* (IBM Bob 2.0 domain boundary grouping)
  3. *Coupling & Data Ownership Audit* (3-signal heuristic + producer/consumer resource mapping)
  4. *Extraction Candidate Ranking* (Safe extraction order assignment)
- **Producer / Consumer Relationship Tracking**: Explicitly distinguishes services that merely read a table from services that **create a resource another service cannot function without** (`creates` vs `reads` with `produced_by` owner tags).
- **3-Signal Risk Scoring Heuristic**: Scores boundary safety from `0.00` (Clean Cut) to `1.00` (Deep Entanglement):
  $$\text{Risk Score} = 0.45 \cdot S_{\text{data}} + 0.35 \cdot S_{\text{calls}} + 0.20 \cdot S_{\text{density}}$$
- **Real-Time Polling & Log Terminal**: FastAPI endpoints support live progress tracking (`progress_pct`) and step-by-step terminal log streaming for React frontends.

---

## 🛠️ Tech Stack & Architecture

- **AI Reasoning Engine**: IBM Bob 2.0 (`bob_client.py`)
- **Agent Framework**: LangGraph (`langgraph.graph.StateGraph`)
- **Backend API**: Python 3.14 + FastAPI + Pydantic v2
- **Static Analysis**: Python `ast` module (AST import/call graph builder)

---

## 📡 API Endpoints Summary

| HTTP Method | Endpoint | Description |
|---|---|---|
| `POST` | `/analyze` | Kick off repo decomposition job (`repo_url`, `repo_ref`) |
| `GET` | `/analyze/{job_id}/status` | Poll execution status, `progress_pct`, and live log lines |
| `GET` | `/analyze/{job_id}/result` | Fetch completed microservice breakdown & risk payload |
| `GET` | `/health` | Health check endpoint |

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment & IBM Bob 2.0 Shell
Create a `.env` file:
```env
BOB_API_KEY=your_ibm_bob_api_key_here
PORT=8000
```

*Note: Rubix drives the official **IBM Bob 2.0 Shell CLI** (`bob run`) as an asynchronous subprocess, utilizing whole-repository context and recording token usage automatically.*

### 3. Run FastAPI Dev Server
```bash
./run.sh
```

Interactive Swagger API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).
