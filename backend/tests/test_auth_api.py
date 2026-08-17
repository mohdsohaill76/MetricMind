"""Tests for MetricMind JWT authentication endpoints."""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.user_service import clear_users


client = TestClient(app)
REGISTRATION_PAYLOAD = {
    "username": "sohail",
    "email": "sohail@example.com",
    "password": "secure-password",
}


@pytest.fixture(autouse=True)
def clear_user_store() -> Generator[None, None, None]:
    """Ensure authentication tests use an isolated in-memory user store."""
    clear_users()
    yield
    clear_users()


def test_register_user_successfully() -> None:
    """A new username and email can be registered."""
    response = client.post("/api/v1/auth/register", json=REGISTRATION_PAYLOAD)

    assert response.status_code == 201
    assert response.json() == {
        "message": "User registered successfully.",
        "user": {"username": "sohail", "email": "sohail@example.com"},
    }


@pytest.mark.parametrize(
    "payload",
    [
        {**REGISTRATION_PAYLOAD, "email": "another@example.com"},
        {**REGISTRATION_PAYLOAD, "username": "another-user"},
    ],
    ids=["duplicate-username", "duplicate-email"],
)
def test_register_user_rejects_duplicate_username_or_email(
    payload: dict[str, str],
) -> None:
    """Duplicate usernames and emails are rejected."""
    client.post("/api/v1/auth/register", json=REGISTRATION_PAYLOAD)

    response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 409


def test_login_returns_bearer_access_token() -> None:
    """Valid credentials return a JWT bearer token."""
    client.post("/api/v1/auth/register", json=REGISTRATION_PAYLOAD)

    response = client.post(
        "/api/v1/auth/login",
        json={"username": "sohail", "password": "secure-password"},
    )

    body = response.json()
    assert response.status_code == 200
    assert body["token_type"] == "bearer"
    assert isinstance(body["access_token"], str)
    assert body["access_token"]


def test_register_user_rejects_invalid_email_address() -> None:
    """Invalid email addresses use FastAPI's standard validation response."""
    response = client.post(
        "/api/v1/auth/register",
        json={**REGISTRATION_PAYLOAD, "email": "not-an-email"},
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["loc"] == ["body", "email"]


def test_get_current_user_with_valid_bearer_token() -> None:
    """A valid access token returns the authenticated user."""
    client.post("/api/v1/auth/register", json=REGISTRATION_PAYLOAD)
    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": "sohail", "password": "secure-password"},
    )
    assert login_response.status_code == 200

    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {login_response.json()['access_token']}"},
    )

    assert response.status_code == 200
    assert response.json() == {"username": "sohail", "email": "sohail@example.com"}


def test_get_current_user_rejects_invalid_token() -> None:
    """An invalid bearer token returns the standard unauthenticated response."""
    response = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer invalid-token"},
    )

    assert response.status_code == 401
    assert response.json() == {
        "error": "HTTP Error",
        "message": "Could not validate credentials.",
    }


def test_get_current_user_rejects_missing_token() -> None:
    """A missing bearer token returns the standard unauthenticated response."""
    response = client.get("/api/v1/auth/me")

    assert response.status_code == 401
    assert response.json() == {
        "error": "HTTP Error",
        "message": "Could not validate credentials.",
    }


def test_login_rejects_invalid_password() -> None:
    """A known user cannot authenticate with an invalid password."""
    client.post("/api/v1/auth/register", json=REGISTRATION_PAYLOAD)

    response = client.post(
        "/api/v1/auth/login",
        json={"username": "sohail", "password": "wrong-password"},
    )

    assert response.status_code == 401
    assert response.json() == {
        "error": "HTTP Error",
        "message": "Invalid username or password.",
    }


def test_login_rejects_unknown_user() -> None:
    """Unknown usernames cannot authenticate."""
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "unknown", "password": "secure-password"},
    )

    assert response.status_code == 401
    assert response.json() == {
        "error": "HTTP Error",
        "message": "Invalid username or password.",
    }
