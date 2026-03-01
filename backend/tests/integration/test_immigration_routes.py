import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_crs_calculate():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "age": 30,
            "education_level": "masters",
            "first_language": {"speaking": 9, "listening": 9, "reading": 9, "writing": 9},
            "canadian_work_experience_years": 3
        }
        response = await client.post("/api/v1/immigration/crs/calculate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "total_score" in data
        assert data["total_score"] > 0
        assert "disclaimer" in data


@pytest.mark.asyncio
async def test_crs_calculate_invalid_input():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post("/api/v1/immigration/crs/calculate", json={})
        assert response.status_code == 422
