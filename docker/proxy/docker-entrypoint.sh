#!/bin/sh
set -euo pipefail

# Entry script for the nginx proxy to generate htpasswd from a Docker secret (preferred)
# or from STUDIO_PASS environment fallback. Writes /etc/nginx/.htpasswd and starts nginx.

SECRET_PATH=/run/secrets/studio_pass
NGINX_HTPASS=/etc/nginx/.htpasswd

STUDIO_USER=${STUDIO_USER:-studio}

# Install htpasswd if missing
if ! command -v htpasswd >/dev/null 2>&1; then
  echo "Installing apache2-utils (htpasswd)..."
  apk add --no-cache apache2-utils >/dev/null 2>&1 || true
fi

if [ -f "$SECRET_PATH" ]; then
  STUDIO_PASS=$(cat "$SECRET_PATH")
else
  # fallback to env var if secret not provided
  STUDIO_PASS=${STUDIO_PASS:-postgres}
fi

echo "Generating htpasswd for user '$STUDIO_USER'"
# Use bcrypt (-B) when available for stronger hashes
if htpasswd -h 2>&1 | grep -q -- '-B'; then
  htpasswd -cbB "$NGINX_HTPASS" "$STUDIO_USER" "$STUDIO_PASS"
else
  htpasswd -cb "$NGINX_HTPASS" "$STUDIO_USER" "$STUDIO_PASS"
fi

echo "Starting nginx..."
# Also generate a runtime config.js in the nginx html root if a backend config is mounted
BACKEND_CONFIG_DIR=/etc/backend-config
NGINX_HTML_DIR=/usr/share/nginx/html
BACKEND_CONFIG_FILE="$BACKEND_CONFIG_DIR/config.json"
RUNTIME_CONFIG_FILE="$NGINX_HTML_DIR/config.js"

if [ -f "$BACKEND_CONFIG_FILE" ]; then
  echo "Generating runtime config.js from $BACKEND_CONFIG_FILE -> $RUNTIME_CONFIG_FILE"
  # Minimal transformation: wrap JSON as window.__GDPS_CONFIG
  cat "$BACKEND_CONFIG_FILE" | sed '1s/^/window.__GDPS_CONFIG = /' > "$RUNTIME_CONFIG_FILE"
else
  # If not mounted, but the frontend build produced a public/config.js we can copy it in place
  if [ -f "/docker/proxy/config.js" ]; then
    cp /docker/proxy/config.js "$RUNTIME_CONFIG_FILE" || true
  fi
fi

nginx -g 'daemon off;'
