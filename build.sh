#!/usr/bin/env bash
set -e

echo "==> Installing Python dependencies..."
pip install -r requirements.txt

echo "==> Checking for Node.js / npm to install bobshell..."
if command -v npm &> /dev/null; then
    echo "==> Installing bobshell globally..."
    npm install -g bobshell || npm install --prefix ~/.local bobshell || true
else
    echo "==> npm not found in build environment. bobshell will auto-install on runtime if Node is present."
fi
