"""Password hashing helpers for MetricMind authentication."""

from passlib.context import CryptContext


_password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Return a bcrypt hash for a plaintext password."""
    return _password_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Return whether a plaintext password matches its stored hash."""
    return _password_context.verify(password, password_hash)
