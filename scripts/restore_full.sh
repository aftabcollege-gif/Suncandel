#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"
: "${1:?usage: restore_full.sh <dump_file>}"

DUMP_FILE="$1"

echo "[restore] restoring from: $DUMP_FILE"
pg_restore --clean --if-exists --no-owner --no-privileges --dbname="$DATABASE_URL" "$DUMP_FILE"

echo "[restore] done"
