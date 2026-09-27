#!/usr/bin/env bash
set -e

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

PROJECT_ROOT="$(pwd)"

# Check or install Node 22
NODE_VER=0
if command -v node &> /dev/null; then
    NODE_VER=$(node -v | cut -d. -f1 | tr -d 'v')
fi

if [ "$NODE_VER" -lt 22 ]; then
    echo "==> System Node.js version is ${NODE_VER} (< 22). Downloading standalone Node.js v22.14.0..."
    mkdir -p "${PROJECT_ROOT}/.node22"
    curl -sL "https://nodejs.org/dist/v22.14.0/node-v22.14.0-linux-x64.tar.xz" | tar -xJ --strip-components=1 -C "${PROJECT_ROOT}/.node22"
    export PATH="${PROJECT_ROOT}/.node22/bin:$PATH"
fi

echo "==> Node.js version active: $(node -v)"

echo "==> Installing IBM Bob Shell CLI from official IBM S3 source..."
BOB_VERSION=$(curl -sf https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell2-version.txt || echo "2.0.5")
BOB_TGZ_URL="https://s3.us-south.cloud-object-storage.appdomain.cloud/bob-shell/bobshell-${BOB_VERSION}.tgz"

echo "==> Downloading bobshell v${BOB_VERSION} from IBM S3..."
curl -sL "${BOB_TGZ_URL}" -o /tmp/bobshell.tgz

# Wipe any stale bobshell artifacts compiled against a different Node version
# to prevent ERR_UNKNOWN_BUILTIN_MODULE(url) on Node 22 strict ESM mode.
echo "==> Cleaning stale bobshell install (if any)..."
rm -rf "${PROJECT_ROOT}/node_modules/bobshell" \
       "${PROJECT_ROOT}/node_modules/.bin/bob" \
       "${PROJECT_ROOT}/node_modules/.package-lock.json"

echo "==> Installing bobshell..."
npm install --registry=https://registry.npmjs.org/ \
    --allow-scripts=@officecli/officecli \
    --progress=false --loglevel=error \
    --prefix "${PROJECT_ROOT}" /tmp/bobshell.tgz

echo "==> Bob Shell installation verified at: $(ls -la node_modules/.bin/bob 2>/dev/null || echo 'not found')"

# --- ESM smoke-test: catch ERR_UNKNOWN_BUILTIN_MODULE early ---
echo "==> Running ESM smoke-test on Node $(node -v)..."
if node "${PROJECT_ROOT}/node_modules/bobshell/dist/bob.js" --version > /dev/null 2>&1 && \
   node "${PROJECT_ROOT}/node_modules/bobshell/dist/bob.js" run --help > /dev/null 2>&1; then
    echo "==> Bob Shell ESM smoke-test PASSED — no ERR_UNKNOWN_BUILTIN_MODULE errors."
else
    echo "ERROR: Bob Shell ESM smoke-test FAILED. Check Node.js version compatibility." >&2
    exit 1
fi
