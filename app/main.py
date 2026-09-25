from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import router

app = FastAPI(
    title="Repo Decomposition Advisor",
    description=(
        "IBM Bob 2.0 Hackathon — analyses a monolithic codebase and proposes "
        "microservice boundaries using IBM Bob whole-repo reasoning + a 3-signal "
        "coupling/cohesion heuristic."
    ),
    version="0.1.0",
)

# Allow all origins in dev — tighten for production if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/health")
async def health():
    return {"status": "ok"}
