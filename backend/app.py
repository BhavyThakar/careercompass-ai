from flask import Flask
from flask_cors import CORS
import mysql.connector

from config import Config

# Import blueprints
from routes.auth_routes import auth_bp
from routes.assessment_routes import assessment_bp
from routes.ai_routes import ai_bp
from routes.admin_routes import admin_bp
from routes.resume_settings_routes import resume_bp
from routes.learning_routes import learning_bp
from routes.resume_routes import resume_bp
from routes.career_routes import career_bp
from routes.opportunities_routes import opportunities_bp
from routes.mentorship_routes import mentorship_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    # ----------------------------------
    # Database connection
    # ----------------------------------
    db = mysql.connector.connect(**Config.DB_CONFIG)
    app.config["db"] = db  # optional, but useful later

    # ----------------------------------
    # Register route blueprints
    # ----------------------------------
    app.register_blueprint(auth_bp)
    app.register_blueprint(assessment_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(learning_bp)
    app.register_blueprint(resume_bp, name='resume_analyzer_bp')
    app.register_blueprint(career_bp)
    app.register_blueprint(opportunities_bp)
    app.register_blueprint(mentorship_bp)

    # ----------------------------------
    # Health check (for testing)
    # ----------------------------------
    @app.route("/api/health", methods=["GET"])
    def health():
        return {"status": "Backend is running"}, 200

    return app


# ----------------------------------
# Server start
# ----------------------------------
if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
