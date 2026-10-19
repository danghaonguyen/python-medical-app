from flask import Flask, jsonify
from flask_migrate import Migrate

from database.database import db
from database.config import Config
from database_models import User, Prediction
from routers.auth import auth_bp
from routers.history import history_bp
from routers.predict import predict_bp
from flask_cors import CORS
from routers.auth import auth_bp, init_google_oauth

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
init_google_oauth(app)
migrate = Migrate(app, db)

CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000/auth/google/callback"
    ],
)
# https://haonguyen-medicalai.vercel.app

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(history_bp)
app.register_blueprint(predict_bp)


@app.route("/db-check/tables")
def db_check_tables():
    try:
        users_count = db.session.query(User).count()
        predictions_count = db.session.query(Prediction).count()

        return (
            jsonify(
                {
                    "status": "success",
                    "users_count": users_count,
                    "predictions_count": predictions_count,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
