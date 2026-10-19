
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
        },
    )

    assert response.status_code == 400
    assert response.json["message"] == "Dữ liệu đầu vào không hợp lệ"


