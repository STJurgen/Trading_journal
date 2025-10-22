#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$ROOT_DIR"

echo "Building frontend assets"
(cd frontend && npm install && npm run build)

echo "Building backend dependencies"
(cd backend && npm install)

echo "Creating Docker images"
docker-compose build

echo "Deploying stack"
docker-compose up -d

echo "Deployment complete."
