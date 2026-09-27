# Hackathon Judge Verification Checklist

Welcome to the Rubix evaluation checklist for IBM Bob 2.0 Hackathon judges.

This document provides quick links and validation guidance for reviewing the project and confirming that it addresses the intended architecture and product goals.

## Project deliverable links

- Landing page: https://rubix-landing.pxxl.click
- Live production web app: https://rubix.pxxl.click/
- Live backend API (Swagger UI): https://rubixbackend.pxxl.click/docs
- GitHub backend repository: https://github.com/techbyFEMI/Rubix_backend.git
- IBM Bob IDE session proof folder: `bob_sessions/`

## Evaluation criteria alignment

| Evaluation category | How Rubix addresses it |
| --- | --- |
| Use of IBM Bob 2.0 | Drives official **IBM Bob 2.0 Shell CLI** (`bob run`) as an async subprocess for whole-repository context reasoning and Bounded Context grouping. Logs token consumption and cost per run. |
| Technical complexity | Built with Python 3.14, FastAPI, Pydantic v2, LangGraph, and a static AST-based dependency parser. |
| User experience | Includes a modern dashboard with live log streaming, risk meters, ownership badges, and extraction recommendations. |
| Real-world impact | Replaces weeks of manual refactoring guesswork with a faster, evidence-based microservice planning workflow. |

## 60-second quick test for judges

1. Open the landing page at https://rubix-landing.pxxl.click.
2. Click `Start Analysis` to launch the web dashboard.
3. Paste the test monolithic repository URL: `https://github.com/techbyFEMI/routine-backend`.
4. Click `Analyze Repo`.
5. Observe the live terminal log executing the four-step DDD pipeline.
6. Review the generated boundary cards showing risk scores, producer/consumer ownership badges, and the `#1 Extract First` recommendation.

## Summary

Rubix demonstrates a practical architecture analysis workflow that blends AI-driven repository reasoning with measurable service extraction guidance. The solution is intended to reduce architectural uncertainty and provide evidence for better monolith-to-microservice modernization decisions.
