
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


def test_send_verification_code_success(client, monkeypatch):
    monkeypatch.setattr(auth, "send_email", lambda *args: None)

    response = client.post(
        "/auth/send_verification_code",
        json={"email": "test@example.com"},
    )

    assert response.status_code == 200
    with client.session_transaction() as sess:
        assert sess["verify_email"] == "test@example.com"
        assert len(sess["verify_code"]) == 6
        assert sess["verify_code"].isdigit()


def test_send_verification_code_email_failure(client, monkeypatch):
    def fail_email(*args):
        raise RuntimeError("Email service unavailable")

    monkeypatch.setattr(auth, "send_email", fail_email)

    response = client.post(
        "/auth/send_verification_code",
        json={"email": "test@example.com"},
    )

    assert response.status_code == 500
    with client.session_transaction() as sess:
        assert "verify_code" not in sess


def test_register_rejects_wrong_verification_code(client):
    with client.session_transaction() as sess:
        sess["verify_email"] = "test@example.com"
        sess["verify_code"] = "123456"

    response = client.post(
        "/auth/register",
        json={
            "username": "TestUser",
            "email": "test@example.com",
            "password": "Password123",
            "code": "654321",
        },
    )

    assert response.status_code == 400


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


def test_send_password_reset_user_not_found(client, monkeypatch):
    monkeypatch.setattr(auth, "get_user_by_email", lambda email: None)

    response = client.post(
        "/auth/send_password_reset",
        json={"email": "missing@example.com"},
    )

    assert response.status_code == 404


def test_verify_reset_code_rejects_wrong_code(client, monkeypatch):
    user = SimpleNamespace(
        reset_code="123456",
        reset_code_expiry=datetime.now() + timedelta(minutes=10),
    )
    monkeypatch.setattr(auth, "get_user_by_email", lambda email: user)

    response = client.post(
        "/auth/verify_reset_code",
        json={"email": "test@example.com", "code": "654321"},
    )

    assert response.status_code == 400


def test_verify_reset_code_rejects_expired_code(client, monkeypatch):
    user = SimpleNamespace(
        reset_code="123456",
        reset_code_expiry=datetime.now() - timedelta(minutes=1),
    )
    monkeypatch.setattr(auth, "get_user_by_email", lambda email: user)

    response = client.post(
        "/auth/verify_reset_code",
        json={"email": "test@example.com", "code": "123456"},
    )

    assert response.status_code == 400


def test_verify_reset_code_success(client, monkeypatch):
    user = SimpleNamespace(
        reset_code="123456",
        reset_code_expiry=datetime.now() + timedelta(minutes=10),
    )
    monkeypatch.setattr(auth, "get_user_by_email", lambda email: user)

    response = client.post(
        "/auth/verify_reset_code",
        json={"email": "test@example.com", "code": "123456"},
    )

    assert response.status_code == 200


def test_reset_password_rejects_wrong_code(client, monkeypatch):
    user = SimpleNamespace(
        reset_code="123456",
        reset_code_expiry=datetime.now() + timedelta(minutes=10),
    )
    monkeypatch.setattr(auth, "get_user_by_email", lambda email: user)

    response = client.post(
        "/auth/reset_password",
        json={
            "email": "test@example.com",
            "code": "654321",
            "new_password": "NewPassword123",
        },
    )

    assert response.status_code == 400
