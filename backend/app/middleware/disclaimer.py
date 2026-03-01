import json

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

DISCLAIMER_TEXT = (
    "This information is provided for educational and informational purposes only. "
    "It does not constitute legal advice. For guidance on your specific situation, "
    "please consult a licensed legal professional in your jurisdiction."
)

# Paths that are excluded from disclaimer injection
EXCLUDED_PREFIXES = ("/api/v1/health", "/api/v1/auth/")


class DisclaimerMiddleware(BaseHTTPMiddleware):
    """Injects a ``disclaimer`` field into every JSON response under /api/v1/,
    except for health-check and authentication endpoints."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        path = request.url.path

        # Only process /api/v1/ routes
        if not path.startswith("/api/v1/"):
            return response

        # Exclude health and auth endpoints
        if any(path.startswith(prefix) for prefix in EXCLUDED_PREFIXES):
            return response

        content_type = response.headers.get("content-type", "")
        if "application/json" not in content_type:
            return response

        # Read the original response body
        body_chunks: list[bytes] = []
        async for chunk in response.body_iterator:  # type: ignore[attr-defined]
            if isinstance(chunk, str):
                body_chunks.append(chunk.encode("utf-8"))
            else:
                body_chunks.append(chunk)
        body = b"".join(body_chunks)

        try:
            data = json.loads(body)
            if isinstance(data, dict):
                data["disclaimer"] = DISCLAIMER_TEXT
            elif isinstance(data, list):
                data = {"data": data, "disclaimer": DISCLAIMER_TEXT}
            new_body = json.dumps(data).encode("utf-8")
        except (json.JSONDecodeError, TypeError):
            new_body = body

        return Response(
            content=new_body,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type="application/json",
        )
