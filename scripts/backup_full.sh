#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"
BACKUP_DIR=${BACKUP_DIR:-./backups}
mkdir -p "$BACKUP_DIR"

TS=$(date +"%Y%m%d_%H%M%S")
FILE="$BACKUP_DIR/sun_full_${TS}.dump"

echo "[backup] creating full backup: $FILE"
pg_dump --format=custom --file="$FILE" "$DATABASE_URL"

echo "[backup] done"
