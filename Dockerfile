FROM node:20-slim AS node_base
FROM python:3.12-slim

# Copy Node.js binary and npm from node_base
COPY --from=node_base /usr/local/bin/node /usr/local/bin/node
COPY --from=node_base /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node_base /usr/local/bin/npm /usr/local/bin/npm
COPY --from=node_base /usr/local/bin/npx /usr/local/bin/npx

WORKDIR /app

# Install git and global bobshell CLI package
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
RUN npm install -g bobshell

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY . .

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
