"""Shared authentication helpers for backend tests."""

from fastapi.testclient import TestClient


def build_bearer_headers(
    client: TestClient,
    *,
    username: str,
    email: str,
    password: str,
) -> dict[str, str]:
    """Register a user, log in, and return a bearer authorization header."""
    registration_response = client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": email, "password": password},
    )
    assert registration_response.status_code in {201, 409}
    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": username, "password": password},
    )
    assert login_response.status_code == 200

    return {"Authorization": f"Bearer {login_response.json()['access_token']}"}
