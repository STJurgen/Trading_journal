#!/usr/bin/env bash
set -euo pipefail

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-changeme}"
DB_NAME="${DB_NAME:-trading_journal}"
OUTPUT_DIR="${1:-backups}"

mkdir -p "$OUTPUT_DIR"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
FILE="$OUTPUT_DIR/${DB_NAME}_$TIMESTAMP.sql"

echo "Creating database backup at $FILE"
MYSQL_PWD="$DB_PASSWORD" mysqldump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USER" \
  --routines \
  --single-transaction \
  "$DB_NAME" > "$FILE"

echo "Backup completed."
