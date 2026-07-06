#!/usr/bin/env bash
# SELV local development setup.
# Run once after cloning: bash scripts/setup.sh

set -euo pipefail

echo "→ Checking Node ≥20..."
node_ver=$(node -v | cut -c2- | cut -d. -f1)
if [ "$node_ver" -lt 20 ]; then
  echo "✗ Node 20+ required (found $(node -v)). Install via https://nodejs.org"
  exit 1
fi

echo "→ Installing dependencies..."
npm install

echo "→ Setting up environment..."
if [ ! -f .env ]; then
  cp .env.example .env
  # Generate a secure AUTH_SECRET automatically
  secret=$(openssl rand -base64 32)
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|generate-with--openssl-rand-base64-32|$secret|" .env
  else
    sed -i "s|generate-with--openssl-rand-base64-32|$secret|" .env
  fi
  echo "  ✓ .env created with a generated AUTH_SECRET"
  echo "  ✎ Fill in DATABASE_URL, REDIS_URL, and RESEND_API_KEY before npm run dev"
else
  echo "  ✓ .env already exists — skipping"
fi

echo "→ Starting Docker services (Postgres + Redis)..."
if command -v docker compose &>/dev/null; then
  docker compose up -d
  echo "  ✓ Postgres on :5432, Redis on :6379"
else
  echo "  ✎ docker compose not found — start Postgres and Redis manually"
fi

echo "→ Running database migrations..."
npx prisma migrate dev --name init 2>/dev/null || npx prisma migrate deploy

echo "→ Seeding database..."
npm run db:seed

echo ""
echo "✓ Setup complete. Run: npm run dev"
echo "  Styleguide: http://localhost:3000/styleguide"
echo "  Preview:    http://localhost:3000/preview"
