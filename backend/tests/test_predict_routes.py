
def test_predict_rejects_invalid_json(client):
    response = client.post(
        "/predict",
        data="this is not json",
        content_type="application/json",
    )

    assert response.status_code == 400


def test_predict_rejects_json_array(client):
    response = client.post(
        "/predict",
        json=[1, 2, 3],
    )

    assert response.status_code == 400
    assert response.json["message"] == "Dữ liệu JSON không hợp lệ"
