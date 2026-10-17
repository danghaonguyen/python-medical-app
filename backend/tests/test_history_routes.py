
import routers.history as history


def test_get_history_rejects_other_user(client):
    with client.session_transaction() as sess:
        sess["user_id"] = 1

    response = client.get("/history/2")

    assert response.status_code == 403


def test_delete_prediction_requires_login(client):
    response = client.delete("/history/1")

    assert response.status_code == 401



def test_delete_prediction_returns_404_when_not_found(
    client, app, monkeypatch
):
    with app.app_context():
        with client.session_transaction() as sess:
            sess["user_id"] = 1

        class FakeQuery:
            def filter_by(self, **kwargs):
                assert kwargs == {"id": 999, "user_id": 1}
                return self

            def first(self):
                return None

        monkeypatch.setattr(
            history.Prediction,
            "query",
            FakeQuery(),
            raising=False,
        )

        response = client.delete("/history/999")

    assert response.status_code == 404

