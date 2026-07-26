"""Tests for MetricMind user-management endpoints."""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.user_service import clear_users


client = TestClient(app)
USER_PAYLOAD = {
    "username": "sohail",
    "email": "sohail@example.com",
    "password": "secure-password",
}
OTHER_USER_PAYLOAD = {
    "username": "alex",
    "email": "alex@example.com",
    "password": "another-secure-password",
}


@pytest.fixture(autouse=True)
def clear_user_store() -> Generator[None, None, None]:
    """Ensure every test starts with an empty in-memory user store."""
    clear_users()
    yield
    clear_users()


def _authorization_header() -> dict[str, str]:
    """Register the default user and return its bearer authorization header."""
    client.post("/api/v1/auth/register", json=USER_PAYLOAD)
    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": USER_PAYLOAD["username"], "password": USER_PAYLOAD["password"]},
    )
    return {"Authorization": f"Bearer {login_response.json()['access_token']}"}


@pytest.mark.parametrize(
    ("method", "path", "payload"),
    [
        ("get", "/api/v1/users/me", None),
        ("put", "/api/v1/users/me", {"username": "new-name"}),
        (
            "put",
            "/api/v1/users/change-password",
            {"current_password": "secure-password", "new_password": "new-secure-password"},
        ),
        ("delete", "/api/v1/users/me", None),
    ],
)
def test_user_management_endpoints_require_authentication(
    method: str, path: str, payload: dict[str, str] | None
) -> None:
    """All user-management endpoints reject missing bearer tokens."""
    request_kwargs = {"json": payload} if method in {"put", "post"} else {}
    response = getattr(client, method)(path, **request_kwargs)

    assert response.status_code == 401
    assert response.json()["message"] == "Could not validate credentials."


def test_get_my_profile() -> None:
    """The profile endpoint returns the bearer token's user."""
    response = client.get("/api/v1/users/me", headers=_authorization_header())

    assert response.status_code == 200
    assert response.json() == {"username": "sohail", "email": "sohail@example.com"}


def test_update_my_profile_username_and_email() -> None:
    """A user can update both profile fields in a single request."""
    headers = _authorization_header()
    response = client.put(
        "/api/v1/users/me",
        headers=headers,
        json={"username": "updated-user", "email": "updated@example.com"},
    )

    assert response.status_code == 200
    response_body = response.json()
    assert response_body["username"] == "updated-user"
    assert response_body["email"] == "updated@example.com"
    assert response_body["token_type"] == "bearer"

    old_token_response = client.get("/api/v1/users/me", headers=headers)
    assert old_token_response.status_code == 401

    refreshed_headers = {"Authorization": f"Bearer {response_body['access_token']}"}
    refreshed_token_response = client.get("/api/v1/users/me", headers=refreshed_headers)
    assert refreshed_token_response.status_code == 200
    assert refreshed_token_response.json() == {
        "username": "updated-user",
        "email": "updated@example.com",
    }

    login_response = client.post(
        "/api/v1/auth/login",
        json={"username": "updated-user", "password": USER_PAYLOAD["password"]},
    )
    assert login_response.status_code == 200


def test_update_my_profile_email_only_keeps_current_token() -> None:
    """An email-only update does not need to rotate the bearer token."""
    headers = _authorization_header()
    response = client.put(
        "/api/v1/users/me",
        headers=headers,
        json={"email": "updated@example.com"},
    )

    assert response.status_code == 200
    assert response.json() == {"username": "sohail", "email": "updated@example.com"}
    assert client.get("/api/v1/users/me", headers=headers).json() == {
        "username": "sohail",
        "email": "updated@example.com",
    }


@pytest.mark.parametrize(
    "payload",
    [{"username": "alex"}, {"email": "alex@example.com"}],
    ids=["duplicate-username", "duplicate-email"],
)
def test_update_my_profile_rejects_duplicate_values(payload: dict[str, str]) -> None:
    """Profile updates enforce username and email uniqueness."""
    headers = _authorization_header()
    client.post("/api/v1/auth/register", json=OTHER_USER_PAYLOAD)

    response = client.put("/api/v1/users/me", headers=headers, json=payload)

    assert response.status_code == 409


def test_update_my_profile_rejects_empty_request() -> None:
    """A profile update must include a field to change."""
    response = client.put("/api/v1/users/me", headers=_authorization_header(), json={})

    assert response.status_code == 422


def test_change_password_updates_login_credentials() -> None:
    """A password change rejects the old password and accepts the new one."""
    response = client.put(
        "/api/v1/users/change-password",
        headers=_authorization_header(),
        json={
            "current_password": USER_PAYLOAD["password"],
            "new_password": "new-secure-password",
        },
    )

    assert response.status_code == 200
    assert response.json() == {"message": "Password changed successfully."}

    assert client.post(
        "/api/v1/auth/login",
        json={"username": USER_PAYLOAD["username"], "password": USER_PAYLOAD["password"]},
    ).status_code == 401
    assert client.post(
        "/api/v1/auth/login",
        json={"username": USER_PAYLOAD["username"], "password": "new-secure-password"},
    ).status_code == 200


def test_change_password_rejects_incorrect_current_password() -> None:
    """The current password must be verified before changing it."""
    response = client.put(
        "/api/v1/users/change-password",
        headers=_authorization_header(),
        json={"current_password": "incorrect-password", "new_password": "new-secure-password"},
    )

    assert response.status_code == 400
    assert response.json()["message"] == "Current password is incorrect."


def test_change_password_validates_new_password_length() -> None:
    """New passwords use the existing registration password requirements."""
    response = client.put(
        "/api/v1/users/change-password",
        headers=_authorization_header(),
        json={"current_password": USER_PAYLOAD["password"], "new_password": "short"},
    )

    assert response.status_code == 422


def test_delete_my_profile_removes_user_from_store() -> None:
    """Deleting a profile removes it and invalidates future authentication."""
    headers = _authorization_header()
    response = client.delete("/api/v1/users/me", headers=headers)

    assert response.status_code == 204
    assert response.content == b""
    assert client.get("/api/v1/users/me", headers=headers).status_code == 401
    assert client.post(
        "/api/v1/auth/login",
        json={"username": USER_PAYLOAD["username"], "password": USER_PAYLOAD["password"]},
    ).status_code == 401
    assert client.post("/api/v1/auth/register", json=USER_PAYLOAD).status_code == 201
