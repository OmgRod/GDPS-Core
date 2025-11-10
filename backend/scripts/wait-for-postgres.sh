#!/bin/sh
set -euo pipefail

# Wait-for-Postgres helper. Usage: wait-for-postgres.sh host port
# Installs netcat if necessary, then polls until the TCP port is open.

HOST=${1:-db}
PORT=${2:-5432}

echo "Waiting for Postgres at $HOST:$PORT..."

if ! command -v nc >/dev/null 2>&1; then
  echo "Installing netcat-openbsd..."
  apk add --no-cache netcat-openbsd >/dev/null 2>&1 || true
fi

RETRY=0
until nc -z "$HOST" "$PORT" >/dev/null 2>&1; do
  RETRY=$((RETRY+1))
  echo "Postgres not ready, retry #$RETRY..."
  sleep 1
done

echo "Postgres is available."
