FROM python:3.12-slim

WORKDIR /app

# Install system dependencies: git, curl, node 22, npm
RUN apt-get update && \
    apt-get install -y git curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Download and install IBM Bob Shell from IBM's official S3 source
RUN BOB_VERSION=$(curl -sf https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell2-version.txt || echo "2.0.5") && \
    echo "Installing bobshell v${BOB_VERSION}..." && \
    curl -sL "https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell-${BOB_VERSION}.tgz" -o /tmp/bobshell.tgz && \
    npm install --registry=https://registry.npmjs.org/ \
        --allow-scripts=@officecli/officecli \
        --progress=false --loglevel=error \
        -g /tmp/bobshell.tgz && \
    echo "Bob Shell installed at: $(which bob || echo 'NOT FOUND')"

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application
COPY . .

EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
