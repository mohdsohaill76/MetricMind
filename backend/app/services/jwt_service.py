"""JWT creation and verification helpers for MetricMind authentication."""

from datetime import UTC, datetime, timedelta

from fastapi import HTTPException, status
from jose import JWTError, jwt

from app.config.settings import settings


def create_access_token(subject: str) -> str:
    """Create a signed access token for a user identifier."""
    expires_at = datetime.now(UTC) + timedelta(
        minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
    )
    return jwt.encode(
        {"sub": subject, "exp": expires_at},
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM,
    )


def verify_access_token(token: str) -> str:
    """Return the authenticated username encoded in a valid access token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
        )
        subject = payload.get("sub")
    except JWTError as exc:
        raise _credentials_exception() from exc

    if not isinstance(subject, str) or not subject:
        raise _credentials_exception()

    return subject


def _credentials_exception() -> HTTPException:
    """Build the standard unauthenticated response."""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
