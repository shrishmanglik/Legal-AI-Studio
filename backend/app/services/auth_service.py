from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundException, UnauthorizedException, ValidationException
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
    verify_token,
)
from app.models.user import User
from app.schemas.auth import TokenResponse, UserResponse


# ---------------------------------------------------------------------------
# Public service functions
# ---------------------------------------------------------------------------

async def register(session: AsyncSession, user_data) -> UserResponse:
    """Register a new user after checking for duplicate email."""
    result = await session.execute(
        select(User).where(User.email == user_data.email)
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise ValidationException("A user with this email already exists")

    user = User(
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=user_data.name,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    return UserResponse.model_validate(user)


async def login(session: AsyncSession, email: str, password: str) -> TokenResponse:
    """Verify credentials and return an access / refresh token pair."""
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(password, user.password_hash):
        raise UnauthorizedException("Invalid email or password")

    token_data = {"sub": str(user.id)}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


async def refresh_token(token: str) -> TokenResponse:
    """Verify a refresh token and issue a new access token."""
    payload = verify_token(token, token_type="refresh")
    if payload is None:
        raise UnauthorizedException("Invalid or expired refresh token")

    user_id = payload.get("sub")
    if user_id is None:
        raise UnauthorizedException("Token missing subject claim")

    token_data = {"sub": user_id}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
    )


async def get_user_by_id(session: AsyncSession, user_id: UUID) -> UserResponse:
    """Look up a user by their primary key."""
    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if user is None:
        raise NotFoundException("User not found")

    return UserResponse.model_validate(user)
