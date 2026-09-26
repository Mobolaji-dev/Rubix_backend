# 🏆 Hackathon Judge Verification Checklist

Welcome IBM Bob 2.0 Hackathon Judges! This document provides quick links and verification instructions for evaluating **Rubix (Repo Decomposition Advisor)**.

---

## 🔗 Project Deliverable Links

* 🌐 **Landing Page**: [https://rubix-landing.pxxl.click](https://rubix-landing.pxxl.click)
* 🚀 **Live Production Web Application**: [https://rubix.pxxl.click/](https://rubix.pxxl.click/)
* 📡 **Live Backend API (Swagger UI)**: [https://rubixbackend.pxxl.click/docs](https://rubixbackend.pxxl.click/docs)
* 🐙 **GitHub Backend Repository**: [https://github.com/techbyFEMI/Rubix_backend.git](https://github.com/techbyFEMI/Rubix_backend.git)
* 📁 **IBM Bob IDE Session Proof Folder**: [`bob_sessions/`](https://github.com/techbyFEMI/Rubix_backend/tree/main/bob_sessions)

---

## ✅ Evaluation Criteria Alignment

| Evaluation Category | How Rubix Addresses It |
|---|---|
| **Use of IBM Bob 2.0** | Leverages IBM Bob 2.0 API (`app/engine/bob_client.py`) for whole-repository context reasoning and IBM Bob IDE in the local workspace for domain event storming. |
| **Technical Complexity** | Built with Python 3.14 + FastAPI + Pydantic v2 + LangGraph StateGraph (4-step agent pipeline) + Python AST static dependency parser. |
| **User Experience & Design** | Modern dark-mode web dashboard featuring live log terminal streaming, quantitative 3-signal risk meters, producer/consumer badges, and `#1 Extract First` tags. |
| **Real-World Impact** | Replaces weeks of manual refactoring guesswork with an automated 60-second microservice boundary roadmap, preventing distributed monolith traps. |

---

## ⚡ 60-Second Quick Test for Judges

1. Open **[https://rubix-landing.pxxl.click](https://rubix-landing.pxxl.click)**.
2. Click **Start Analysis** to launch the web dashboard at `https://rubix.pxxl.click/`.
3. Paste the test monolithic repo URL: `https://github.com/techbyFEMI/routine-backend` and click **Analyze Repo**.
4. Observe the **live terminal log** executing the 4-step DDD pipeline.
5. Review the generated microservice boundary cards displaying **Risk Scores**, **Producer/Consumer badges**, and the **`#1 Extract First`** recommendation tag!
