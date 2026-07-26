"""In-memory user storage and authentication for MetricMind."""

from dataclasses import dataclass

from fastapi import HTTPException, status

from app.models.request_models import UserRegistrationRequest
from app.models.response_models import UserResponse
from app.services.password_service import hash_password, verify_password


@dataclass(frozen=True)
class StoredUser:
    """Internal representation of a registered user."""

    username: str
    email: str
    password_hash: str


_users_by_username: dict[str, StoredUser] = {}
_usernames_by_email: dict[str, str] = {}


def register_user(request: UserRegistrationRequest) -> UserResponse:
    """Register a user unless its username or email is already in use."""
    if request.username in _users_by_username:
        raise HTTPException(status_code=409, detail="Username is already registered.")
    if request.email in _usernames_by_email:
        raise HTTPException(status_code=409, detail="Email is already registered.")

    user = StoredUser(
        username=request.username,
        email=request.email,
        password_hash=hash_password(request.password),
    )
    _users_by_username[user.username] = user
    _usernames_by_email[user.email] = user.username
    return _to_user_response(user)


def authenticate_user(username: str, password: str) -> UserResponse:
    """Validate credentials and return the matching public user details."""
    user = _users_by_username.get(username)
    if user is None or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _to_user_response(user)


def get_user(username: str) -> UserResponse | None:
    """Return public user details for a registered username."""
    user = _users_by_username.get(username)
    return _to_user_response(user) if user is not None else None


def clear_users() -> None:
    """Clear in-memory users for test isolation."""
    _users_by_username.clear()
    _usernames_by_email.clear()


def _to_user_response(user: StoredUser) -> UserResponse:
    """Convert an internal user record to its public representation."""
    return UserResponse(username=user.username, email=user.email)
