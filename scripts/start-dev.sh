#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

if [[ ! -d "$BACKEND_DIR/node_modules" ]]; then
  echo "Installing backend dependencies..."
  (cd "$BACKEND_DIR" && npm install)
fi

if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
  echo "Installing frontend dependencies..."
  (cd "$FRONTEND_DIR" && npm install)
fi

echo "Starting backend on http://localhost:5000"
(cd "$BACKEND_DIR" && npm run dev) &
BACK_PID=$!

echo "Starting frontend on http://localhost:5173"
(cd "$FRONTEND_DIR" && npm run dev) &
FRONT_PID=$!

trap "echo 'Shutting down...'; kill $BACK_PID $FRONT_PID" EXIT

wait $BACK_PID $FRONT_PID
