#!/bin/bash
# Start the Repo Decomposition Advisor backend
# Run from the project root: ./run.sh

set -e

if [ ! -f ".env" ]; then
  echo "⚠️  No .env file found. Copying from .env.example..."
  cp .env.example .env
  echo "✅ .env created — edit it to add BOB_API_KEY when available."
fi

echo "🚀 Starting backend on http://localhost:8000"
echo "📖 Interactive API docs at http://localhost:8000/docs"
echo ""

source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
