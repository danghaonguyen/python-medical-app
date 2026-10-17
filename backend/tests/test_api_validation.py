
def test_login_rejects_invalid_email(client):
    response = client.post(
        "/auth/login",
        json={
            "email": "invalid-email",
            "password": "Password123",
        },
    )

    assert response.status_code == 400
    assert response.json["message"] == "Dữ liệu đầu vào không hợp lệ"


def test_register_rejects_invalid_email(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "TestUser",
            "email": "invalid-email",
            "password": "Password123",
            "code": "123456",
        },
    )

    assert response.status_code == 400
    assert response.json["message"] == "Dữ liệu đầu vào không hợp lệ"


def test_send_verification_rejects_invalid_email(client):
    response = client.post(
        "/auth/send_verification_code",
        json={"email": "invalid-email"},
    )

    assert response.status_code == 400
    assert response.json["message"] == "Dữ liệu đầu vào không hợp lệ"


def test_send_password_reset_rejects_invalid_email(client):
    response = client.post(
        "/auth/send_password_reset",
        json={"email": "invalid-email"},
    )

    assert response.status_code == 400
    assert response.json["message"] == "Dữ liệu đầu vào không hợp lệ"
