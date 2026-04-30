# LegalAI Studio

A modular legal intelligence platform for Canadian immigration, contracts, compliance, document generation, and AI-powered legal research.

## Architecture

| Service | Stack | Port | Description |
|---------|-------|------|-------------|
| **Backend** | FastAPI + Python 3.11 | 8004 | REST API with 5 domain modules |
| **Frontend** | Next.js 14 + TypeScript | 3004 | LegalAI professional dashboard |
| **ATLAS** | Next.js 14 + TypeScript | 3005 | Newcomer immigration portal |
| **Database** | PostgreSQL 15 | 5432 | Data store |

## Modules

1. **Immigration Pathway Analyzer** — CRS calculator, PNP matching, post-landing checklist
2. **Contract Review Engine** — PDF/DOCX upload, clause extraction, risk scoring
3. **Document Generator** — Template-based document generation (NDA, etc.)
4. **Compliance Tracker** — Employment standards lookup, compliance checklists
5. **Legal Q&A** — AI-powered legal question answering with caching

## Quick Start

### With Docker

```bash
cp .env.example .env
# Edit .env with your values
docker-compose up -d
```

Services will be available at:
- Backend API: http://localhost:8004
- Frontend Dashboard: http://localhost:3004
- ATLAS Portal: http://localhost:3005

### Development

```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Running Tests

```bash
cd backend
pip install -e ".[dev]"
pytest -v
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8004/docs
- ReDoc: http://localhost:8004/redoc

## Deployment

Deploy to Railway:

```bash
npm install -g @railway/cli
railway login
bash scripts/deploy-railway.sh
```

## Legal Disclaimer

This platform is provided for educational and informational purposes only. It does not constitute legal advice. For guidance on your specific situation, please consult a licensed legal professional in your jurisdiction.
