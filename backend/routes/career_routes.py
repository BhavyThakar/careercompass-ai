from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
from config import Config

career_bp = Blueprint("career_bp", __name__, url_prefix="/api/student")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        try:
            token = token.replace('Bearer ', '')
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
            request.user_id = data['user_id']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        return f(*args, **kwargs)
    return decorated

@career_bp.route("/career-readiness", methods=["GET"])
@token_required
def get_career_readiness():
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor(dictionary=True)

        # Get user's career readiness assessment
        cursor.execute("""
            SELECT overall_readiness_score, skills_readiness, experience_readiness,
                   network_readiness, mindset_readiness, assessment_date
            FROM career_readiness
            WHERE user_id = %s
            ORDER BY assessment_date DESC
            LIMIT 1
        """, (request.user_id,))

        readiness = cursor.fetchone()

        if not readiness:
            return jsonify({"error": "Career readiness assessment not found"}), 404

        cursor.close()
        return jsonify(readiness), 200

    except Exception as e:
        print(f"Error fetching career readiness: {e}")
        return jsonify({"error": "Internal server error"}), 500

@career_bp.route("/resume-ratings", methods=["GET"])
@token_required
def get_resume_ratings():
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor(dictionary=True)

        # Get user's resume ratings
        cursor.execute("""
            SELECT overall_rating, content_rating, format_rating, keywords_rating,
                   ats_compatibility_rating, feedback, rated_at
            FROM resume_ratings
            WHERE user_id = %s
            ORDER BY rated_at DESC
        """, (request.user_id,))

        ratings = cursor.fetchall()

        cursor.close()
        return jsonify({"ratings": ratings}), 200

    except Exception as e:
        print(f"Error fetching resume ratings: {e}")
        return jsonify({"error": "Internal server error"}), 500

@career_bp.route("/career-readiness", methods=["POST"])
@token_required
def update_career_readiness():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor()

        # Insert or update career readiness
        cursor.execute("""
            INSERT INTO career_readiness
            (user_id, overall_readiness_score, skills_readiness, experience_readiness,
             network_readiness, mindset_readiness)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
            overall_readiness_score = VALUES(overall_readiness_score),
            skills_readiness = VALUES(skills_readiness),
            experience_readiness = VALUES(experience_readiness),
            network_readiness = VALUES(network_readiness),
            mindset_readiness = VALUES(mindset_readiness),
            assessment_date = CURRENT_TIMESTAMP
        """, (
            request.user_id,
            data.get('overall_readiness_score'),
            data.get('skills_readiness'),
            data.get('experience_readiness'),
            data.get('network_readiness'),
            data.get('mindset_readiness')
        ))

        db.commit()
        cursor.close()

        return jsonify({"success": True, "message": "Career readiness updated successfully"}), 200

    except Exception as e:
        print(f"Error updating career readiness: {e}")
        return jsonify({"error": "Internal server error"}), 500
