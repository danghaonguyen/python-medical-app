
from datetime import datetime, timedelta
from types import SimpleNamespace

from werkzeug.security import generate_password_hash

import routers.auth as auth


def test_login_user_not_found(client, monkeypatch):
    monkeypatch.setattr(auth, "get_user_by_email", lambda email: None)

    response = client.post(
        "/auth/login",
        json={"email": "missing@example.com", "password": "Password123"},
    )

    assert response.status_code == 401


def test_login_wrong_password(client, monkeypatch):
    user = SimpleNamespace(
        id=1,
        username="TestUser",
        password=generate_password_hash("CorrectPass123"),
    )
    monkeypatch.setattr(auth, "get_user_by_email", lambda email: user)

    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "WrongPass123"},
    )

    assert response.status_code == 401


def test_logout_clears_session(client):
    with client.session_transaction() as sess:
        sess["user_id"] = 123
        sess["username"] = "TestUser"

    response = client.post("/auth/logout")

    assert response.status_code == 200
    with client.session_transaction() as sess:
        assert "user_id" not in sess
        assert "username" not in sess


def test_register_rejects_duplicate_email(client, monkeypatch):
    with client.session_transaction() as sess:
        sess["verify_email"] = "test@example.com"
        sess["verify_code"] = "123456"

    monkeypatch.setattr(
        auth,
        "get_user_by_email",
        lambda email: SimpleNamespace(id=1),
    )

    response = client.post(
        "/auth/register",
        json={
            "username": "TestUser",
            "email": "test@example.com",
            "password": "Password123",
            "code": "123456",
        },
    )

    assert response.status_code == 409



