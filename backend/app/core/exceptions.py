from fastapi import Request
from fastapi.responses import JSONResponse


# ---------------------------------------------------------------------------
# Custom exception classes
# ---------------------------------------------------------------------------

class LegalAIException(Exception):
    """Base exception for the LegalAI Studio application."""

    def __init__(self, message: str = "An unexpected error occurred", status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class NotFoundException(LegalAIException):
    """Raised when a requested resource is not found."""

    def __init__(self, message: str = "Resource not found"):
        super().__init__(message=message, status_code=404)


class UnauthorizedException(LegalAIException):
    """Raised when authentication fails or is missing."""

    def __init__(self, message: str = "Not authorized"):
        super().__init__(message=message, status_code=401)


class ValidationException(LegalAIException):
    """Raised when request data fails validation."""

    def __init__(self, message: str = "Validation error"):
        super().__init__(message=message, status_code=422)


# ---------------------------------------------------------------------------
# Exception handlers for FastAPI
# ---------------------------------------------------------------------------

async def legalai_exception_handler(request: Request, exc: LegalAIException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"},
    )
