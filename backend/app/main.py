from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine
from app.core.exceptions import (
    LegalAIException,
    legalai_exception_handler,
    generic_exception_handler,
)
from app.middleware.disclaimer import DisclaimerMiddleware


# ---------------------------------------------------------------------------
# Lifespan (replaces deprecated on_event)
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables if they don't exist
    from app.models import Base  # noqa: F811

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: dispose of the engine connection pool
    await engine.dispose()


# ---------------------------------------------------------------------------
# Application factory
# ---------------------------------------------------------------------------

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

# -- Exception handlers -----------------------------------------------------
app.add_exception_handler(LegalAIException, legalai_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# -- Middleware (order matters: last added = first executed) -----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(DisclaimerMiddleware)

# -- Routers ----------------------------------------------------------------
from app.api.v1.router import router as v1_router  # noqa: E402

app.include_router(v1_router, prefix="/api/v1")
