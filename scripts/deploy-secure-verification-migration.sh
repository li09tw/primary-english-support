#!/bin/bash

set -euo pipefail

echo "🚀 Running verification_codes migration (plaintext -> hash)"

if [ -z "${DATABASE_NAME:-}" ]; then
  echo "❌ DATABASE_NAME not set" >&2
  exit 1
fi

echo "📊 Database: $DATABASE_NAME"
wrangler d1 execute "$DATABASE_NAME" --file=./scripts/migrate-verification-codes-to-hash.sql

echo "✅ Migration completed"


