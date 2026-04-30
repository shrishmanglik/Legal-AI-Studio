from fastapi import APIRouter

from app.api.v1.routes import (
    auth,
    compliance,
    contracts,
    documents,
    health,
    immigration,
    legal,
)

router = APIRouter()

router.include_router(health.router, tags=["health"])
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(immigration.router, prefix="/immigration", tags=["immigration"])
router.include_router(contracts.router, prefix="/contracts", tags=["contracts"])
router.include_router(contracts.clauses_router, tags=["contracts"])
router.include_router(documents.router, prefix="/documents", tags=["documents"])
router.include_router(compliance.router, prefix="/compliance", tags=["compliance"])
router.include_router(legal.router, prefix="/legal", tags=["legal"])
