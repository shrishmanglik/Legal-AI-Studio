#!/bin/bash
set -e

echo "=== LegalAI Studio — Deployment ==="
echo ""
echo "Architecture:"
echo "  Backend (FastAPI)  → Railway"
echo "  Frontend (Next.js) → Vercel"
echo "  ATLAS (Next.js)    → Vercel"
echo "  Database (Postgres) → Supabase"
echo ""

# ─── 1. RAILWAY: Backend Deployment ───

echo "=== Step 1: Deploy Backend to Railway ==="

if ! command -v railway &> /dev/null; then
    echo "Error: Railway CLI not found. Install with: npm install -g @railway/cli"
    exit 1
fi

if ! railway whoami &> /dev/null; then
    echo "Error: Not logged in to Railway. Run: railway login"
    exit 1
fi

echo "Creating Railway project..."
railway init --name legalai-studio 2>/dev/null || echo "Project may already exist, continuing..."

echo "Creating backend service..."
railway service create backend 2>/dev/null || true
railway link --service backend 2>/dev/null || true

# Set backend environment variables
# DATABASE_URL should point to your Supabase PostgreSQL
echo ""
echo "Setting backend environment variables..."
echo "NOTE: You must set DATABASE_URL to your Supabase connection string:"
echo "  railway variables set DATABASE_URL='postgresql+asyncpg://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres' --service backend"
echo ""

railway variables set \
    JWT_SECRET="$(openssl rand -hex 32)" \
    CORS_ORIGINS="${CORS_ORIGINS:-http://localhost:3004,http://localhost:3005}" \
    CLAUDE_API_KEY="${CLAUDE_API_KEY:-}" \
    SUPABASE_URL="${SUPABASE_URL:-}" \
    SUPABASE_KEY="${SUPABASE_KEY:-}" \
    DEBUG="false" \
    --service backend 2>/dev/null || true

echo "Deploying backend to Railway..."
railway up --service backend --detach 2>/dev/null || true

BACKEND_URL=$(railway domain --service backend 2>/dev/null || echo "legalai-backend.up.railway.app")
echo "Backend deployed at: https://${BACKEND_URL}"

# ─── 2. VERCEL: Frontend Deployment ───

echo ""
echo "=== Step 2: Deploy Frontend to Vercel ==="

if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Install with: npm install -g vercel"
    echo "Skipping Vercel deployment. Deploy manually:"
    echo "  cd frontend && vercel --prod"
    echo "  cd atlas && vercel --prod"
else
    echo "Deploying frontend to Vercel..."
    cd frontend
    vercel --prod --yes \
        -e NEXT_PUBLIC_API_URL="https://${BACKEND_URL}/api/v1" \
        2>/dev/null || echo "Frontend deploy may need manual intervention"
    FRONTEND_URL=$(vercel inspect --json 2>/dev/null | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "")
    cd ..

    echo ""
    echo "Deploying ATLAS to Vercel..."
    cd atlas
    vercel --prod --yes \
        -e NEXT_PUBLIC_API_URL="https://${BACKEND_URL}/api/v1" \
        2>/dev/null || echo "ATLAS deploy may need manual intervention"
    ATLAS_URL=$(vercel inspect --json 2>/dev/null | grep -o '"url":"[^"]*"' | head -1 | cut -d'"' -f4 || echo "")
    cd ..
fi

# ─── 3. Update CORS Origins ───

echo ""
echo "=== Step 3: Update CORS origins ==="

if [ -n "$FRONTEND_URL" ] && [ -n "$ATLAS_URL" ]; then
    railway variables set \
        CORS_ORIGINS="https://${FRONTEND_URL},https://${ATLAS_URL}" \
        --service backend 2>/dev/null || true
    echo "Updated CORS with Vercel domains"
else
    echo "NOTE: Manually update CORS_ORIGINS on Railway backend with your Vercel domains:"
    echo "  railway variables set CORS_ORIGINS='https://your-frontend.vercel.app,https://your-atlas.vercel.app' --service backend"
fi

# ─── 4. Database Setup ───

echo ""
echo "=== Step 4: Database Setup (Supabase) ==="
echo ""
echo "Ensure your Supabase project is set up:"
echo "  1. Create project at https://supabase.com/dashboard"
echo "  2. Copy the connection string from Settings > Database"
echo "  3. Set it on Railway: railway variables set DATABASE_URL='...' --service backend"
echo "  4. Run migrations: railway run --service backend -- alembic upgrade head"
echo "  5. Seed data: railway run --service backend -- python scripts/seed.py"

# ─── Summary ───

echo ""
echo "=== Deployment Summary ==="
echo ""
echo "Services:"
echo "  Backend (Railway):   https://${BACKEND_URL:-legalai-backend.up.railway.app}"
echo "  Frontend (Vercel):   ${FRONTEND_URL:-Deploy with: cd frontend && vercel --prod}"
echo "  ATLAS (Vercel):      ${ATLAS_URL:-Deploy with: cd atlas && vercel --prod}"
echo "  Database (Supabase): Configure at https://supabase.com/dashboard"
echo ""
echo "Next steps:"
echo "  1. Set DATABASE_URL on Railway to your Supabase connection string"
echo "  2. Run: railway run --service backend -- alembic upgrade head"
echo "  3. Run: railway run --service backend -- python scripts/seed.py"
echo "  4. Verify: curl https://${BACKEND_URL:-legalai-backend.up.railway.app}/api/v1/health"
echo "  5. Set CLAUDE_API_KEY for Legal Q&A: railway variables set CLAUDE_API_KEY=<key> --service backend"
echo "  6. (Optional) Set up Stripe keys for payment processing"
