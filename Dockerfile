FROM python:3.12-slim

WORKDIR /app

# Install system dependencies: git, curl, node 22, npm
RUN apt-get update && \
    apt-get install -y git curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application (node_modules excluded via .dockerignore)
COPY . .

# Download and install IBM Bob Shell from IBM's official S3 source
# Install locally (--prefix /app) so config.py finds it at node_modules/.bin/bob
RUN BOB_VERSION=$(curl -sf https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell2-version.txt || echo "2.0.5") && \
    echo "Installing bobshell v${BOB_VERSION}..." && \
    curl -sL "https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell-${BOB_VERSION}.tgz" -o /tmp/bobshell.tgz && \
    rm -rf /app/node_modules/bobshell /app/node_modules/.bin/bob && \
    npm install --registry=https://registry.npmjs.org/ \
        --allow-scripts=@officecli/officecli \
        --progress=false --loglevel=error \
        --prefix /app /tmp/bobshell.tgz && \
    echo "Bob Shell installed at: $(ls -la /app/node_modules/.bin/bob || echo 'NOT FOUND')" && \
    node /app/node_modules/bobshell/dist/bob.js --version && \
    mkdir -p /root/.bob/settings /root/.bob/db /root/.bob/dev-db /root/.bob/sessions /tmp/.bob/settings /tmp/.bob/db /tmp/.bob/dev-db /tmp/.bob/sessions && \
    chmod -R 777 /root/.bob /tmp/.bob

EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
