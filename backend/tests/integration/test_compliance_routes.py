import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.main import app
from app.core.database import get_session
from app.models.compliance import EmploymentStandard


@pytest.mark.asyncio
async def test_get_standards():
    # Create a test-specific SQLite engine and only the employment_standards table
    test_engine = create_async_engine("sqlite+aiosqlite://", echo=False)
    async with test_engine.begin() as conn:
        await conn.run_sync(EmploymentStandard.metadata.create_all, tables=[EmploymentStandard.__table__])

    TestSession = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)

    async def override_get_session():
        async with TestSession() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/compliance/standards?province=ON")
            assert response.status_code == 200
            data = response.json()
            assert "disclaimer" in data
    finally:
        app.dependency_overrides.clear()
        await test_engine.dispose()
