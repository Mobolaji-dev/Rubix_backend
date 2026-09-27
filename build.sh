#!/usr/bin/env bash
set -e

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Installing IBM Bob Shell CLI from official IBM S3 source..."
BOB_VERSION=$(curl -sf https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell2-version.txt || echo "2.0.5")
BOB_TGZ_URL="https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell-${BOB_VERSION}.tgz"

if command -v npm &> /dev/null; then
    echo "==> Downloading bobshell v${BOB_VERSION} from IBM S3..."
    curl -sL "${BOB_TGZ_URL}" -o /tmp/bobshell.tgz

    echo "==> Installing bobshell to project-local node_modules..."
    npm install --registry=https://registry.npmjs.org/ \
        --allow-scripts=@officecli/officecli \
        --progress=false --loglevel=error \
        --prefix "$(pwd)" /tmp/bobshell.tgz

    echo "==> Bob Shell installed: $(ls -la node_modules/.bin/bob 2>/dev/null || echo 'not found at node_modules/.bin/bob')"
else
    echo "==> npm not available, skipping bobshell install."
fi
