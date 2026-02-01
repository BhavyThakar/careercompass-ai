from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
from config import Config

mentorship_bp = Blueprint("mentorship_bp", __name__, url_prefix="/api/student")

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

@mentorship_bp.route("/mentors", methods=["GET"])
@token_required
def get_available_mentors():
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor(dictionary=True)

        # Get available mentors
        cursor.execute("""
            SELECT id, name, email, expertise_areas, experience_years,
                   bio, linkedin_url, rating, availability_status
            FROM mentors
            WHERE availability_status = 'available'
            ORDER BY rating DESC, experience_years DESC
        """)

        mentors = cursor.fetchall()

        cursor.close()
        return jsonify({"mentors": mentors}), 200

    except Exception as e:
        print(f"Error fetching mentors: {e}")
        return jsonify({"error": "Internal server error"}), 500

@mentorship_bp.route("/mentorship-sessions", methods=["GET"])
@token_required
def get_mentorship_sessions():
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor(dictionary=True)

        # Get user's mentorship sessions
        cursor.execute("""
            SELECT ms.id, ms.session_date, ms.session_type, ms.status, ms.notes,
                   m.name AS mentor_name, m.expertise_areas, m.email AS mentor_email
            FROM mentorship_sessions ms
            JOIN mentors m ON ms.mentor_id = m.id
            WHERE ms.mentee_id = %s
            ORDER BY ms.session_date DESC
        """, (request.user_id,))

        sessions = cursor.fetchall()

        cursor.close()
        return jsonify({"sessions": sessions}), 200

    except Exception as e:
        print(f"Error fetching mentorship sessions: {e}")
        return jsonify({"error": "Internal server error"}), 500

@mentorship_bp.route("/mentorship-sessions", methods=["POST"])
@token_required
def request_mentorship_session():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ['mentor_id', 'session_date', 'session_type', 'topic']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor()

        # Insert new mentorship session request
        cursor.execute("""
            INSERT INTO mentorship_sessions
            (mentee_id, mentor_id, session_date, session_type, topic, status)
            VALUES (%s, %s, %s, %s, %s, 'requested')
        """, (
            request.user_id,
            data['mentor_id'],
            data['session_date'],
            data['session_type'],
            data['topic']
        ))

        session_id = cursor.lastrowid
        db.commit()
        cursor.close()

        return jsonify({
            "success": True,
            "message": "Mentorship session requested successfully",
            "session_id": session_id
        }), 201

    except Exception as e:
        print(f"Error requesting mentorship session: {e}")
        return jsonify({"error": "Internal server error"}), 500

@mentorship_bp.route("/mentorship-sessions/<int:session_id>/feedback", methods=["POST"])
@token_required
def submit_session_feedback(session_id):
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor()

        # Verify the session belongs to the user
        cursor.execute("""
            SELECT id FROM mentorship_sessions
            WHERE id = %s AND mentee_id = %s
        """, (session_id, request.user_id))

        if not cursor.fetchone():
            cursor.close()
            return jsonify({"error": "Session not found"}), 404

        # Insert feedback
        cursor.execute("""
            INSERT INTO mentorship_feedback
            (session_id, rating, feedback_text, helpful_topics, improvement_suggestions)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            session_id,
            data.get('rating'),
            data.get('feedback_text'),
            data.get('helpful_topics'),
            data.get('improvement_suggestions')
        ))

        db.commit()
        cursor.close()

        return jsonify({"success": True, "message": "Feedback submitted successfully"}), 200

    except Exception as e:
        print(f"Error submitting feedback: {e}")
        return jsonify({"error": "Internal server error"}), 500
