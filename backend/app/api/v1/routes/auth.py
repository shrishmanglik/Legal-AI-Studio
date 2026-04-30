from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.dependencies import get_current_user
from app.core.exceptions import LegalAIException
from app.models.user import User
from app.schemas.auth import (
    RefreshTokenRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserResponse,
)
from app.services import auth_service

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session),
):
    """Register a new user account."""
    try:
        return await auth_service.register(session, user_data)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    session: AsyncSession = Depends(get_session),
):
    """Authenticate and obtain access + refresh tokens."""
    try:
        return await auth_service.login(session, credentials.email, credentials.password)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh(body: RefreshTokenRequest):
    """Exchange a valid refresh token for a new token pair."""
    try:
        return await auth_service.refresh_token(body.refresh_token)
    except LegalAIException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    """Return the profile of the currently authenticated user."""
    return UserResponse.model_validate(current_user)
