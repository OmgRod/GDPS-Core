#!/bin/sh
set -e

# Start Prisma Studio in the background (bind to 0.0.0.0 so it's reachable from host/docker)
if command -v npx >/dev/null 2>&1; then
  echo "Starting Prisma Studio on port 5555 (background)..."
  npx prisma studio --port 5555 --hostname 0.0.0.0 &
else
  echo "npx not found; skipping Prisma Studio startup"
fi

echo "Starting backend server..."
exec node dist/index.js
