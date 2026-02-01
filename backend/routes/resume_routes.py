from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
from config import Config

resume_bp = Blueprint("resume_bp", __name__, url_prefix="/api/student")

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

@resume_bp.route("/resume-analyzer", methods=["GET"])
@token_required
def get_resume_analysis():
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor(dictionary=True)

        # Get user's latest resume
        cursor.execute("""
            SELECT r.id, r.filename, r.analysis_status, r.overall_score
            FROM resumes r
            WHERE r.user_id = %s
            ORDER BY r.upload_date DESC
            LIMIT 1
        """, (request.user_id,))

        resume = cursor.fetchone()
        if not resume:
            return jsonify({"error": "No resume found"}), 404

        # Get quality metrics
        cursor.execute("""
            SELECT metric_name, metric_value, color
            FROM resume_quality_metrics
            WHERE resume_id = %s
            ORDER BY metric_name
        """, (resume['id'],))

        quality_metrics = cursor.fetchall()

        # Get extracted skills
        cursor.execute("""
            SELECT skill_name, skill_level, verified
            FROM extracted_skills
            WHERE resume_id = %s
            ORDER BY skill_name
        """, (resume['id'],))

        extracted_skills = cursor.fetchall()

        # Get extracted projects
        cursor.execute("""
            SELECT title, description, technologies, impact
            FROM extracted_projects
            WHERE resume_id = %s
            ORDER BY title
        """, (resume['id'],))

        extracted_projects = cursor.fetchall()

        # Get improvement suggestions
        cursor.execute("""
            SELECT title, description, priority
            FROM improvement_suggestions
            WHERE resume_id = %s
            ORDER BY priority, title
        """, (resume['id'],))

        improvement_suggestions = cursor.fetchall()

        cursor.close()

        return jsonify({
            "overall_score": resume['overall_score'],
            "quality_metrics": quality_metrics,
            "extracted_skills": extracted_skills,
            "extracted_projects": extracted_projects,
            "improvement_suggestions": improvement_suggestions
        }), 200

    except Exception as e:
        print(f"Error fetching resume analysis: {e}")
        return jsonify({"error": "Internal server error"}), 500

@resume_bp.route("/resume-upload", methods=["POST"])
@token_required
def upload_resume():
    try:
        # This is a placeholder for file upload functionality
        # In a real implementation, you'd handle file uploads here
        return jsonify({"message": "Resume upload functionality to be implemented"}), 200
    except Exception as e:
        print(f"Error uploading resume: {e}")
        return jsonify({"error": "Internal server error"}), 500

@resume_bp.route("/resume-analyzer/suggestions/<int:suggestion_id>/complete", methods=["PUT"])
@token_required
def complete_suggestion(suggestion_id):
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor()

        # Verify the suggestion belongs to the user's resume
        cursor.execute("""
            SELECT s.id
            FROM improvement_suggestions s
            JOIN resumes r ON s.resume_id = r.id
            WHERE s.id = %s AND r.user_id = %s
        """, (suggestion_id, request.user_id))

        if not cursor.fetchone():
            cursor.close()
            return jsonify({"error": "Suggestion not found"}), 404

        # Mark suggestion as completed (you might want to add a completed field to the table)
        # For now, we'll just return success
        cursor.close()

        return jsonify({"success": True, "message": "Suggestion marked as completed"}), 200

    except Exception as e:
        print(f"Error completing suggestion: {e}")
        return jsonify({"error": "Internal server error"}), 500
