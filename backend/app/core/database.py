from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.core.config import settings

_engine_kwargs: dict = {"pool_pre_ping": True}
if not settings.DATABASE_URL.startswith("sqlite"):
    _engine_kwargs["pool_size"] = 20
    _engine_kwargs["max_overflow"] = 10

engine = create_async_engine(settings.DATABASE_URL, **_engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session():
    async with AsyncSessionLocal() as session:
        yield session
