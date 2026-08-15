#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"

echo "[integrity] checking constraints and core counts"
psql "$DATABASE_URL" -c "select 'users' as table, count(*) as cnt from users"
psql "$DATABASE_URL" -c "select 'orders' as table, count(*) as cnt from orders"
psql "$DATABASE_URL" -c "select 'payments' as table, count(*) as cnt from payments"
psql "$DATABASE_URL" -c "select 'ai_inferences' as table, count(*) as cnt from ai_inferences"

echo "[integrity] done"
