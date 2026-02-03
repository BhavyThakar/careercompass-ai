from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
from config import Config

learning_bp = Blueprint("learning_bp", __name__, url_prefix="/api/student")

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

@learning_bp.route("/learning-roadmaps", methods=["GET"])
@token_required
def get_learning_roadmaps():
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor(dictionary=True)

        # Get user's roadmaps
        cursor.execute("""
            SELECT lr.id, lr.roadmap_type, lr.title, lr.description
            FROM learning_roadmaps lr
            WHERE lr.user_id = %s
            ORDER BY lr.roadmap_type
        """, (request.user_id,))

        roadmaps_data = cursor.fetchall()

        roadmaps = {}
        for roadmap in roadmaps_data:
            roadmap_type = roadmap['roadmap_type']

            # Get phases for this roadmap
            cursor.execute("""
                SELECT rp.id, rp.phase_order, rp.title, rp.duration, rp.status
                FROM roadmap_phases rp
                WHERE rp.roadmap_id = %s
                ORDER BY rp.phase_order
            """, (roadmap['id'],))

            phases = cursor.fetchall()

            # Get milestones for each phase
            for phase in phases:
                cursor.execute("""
                    SELECT rm.title, rm.completed, rm.icon
                    FROM roadmap_milestones rm
                    WHERE rm.phase_id = %s
                    ORDER BY rm.id
                """, (phase['id'],))

                phase['milestones'] = cursor.fetchall()

            roadmaps[roadmap_type] = {
                'title': roadmap['title'],
                'description': roadmap['description'],
                'phases': phases
            }

        cursor.close()
        return jsonify(roadmaps), 200

    except Exception as e:
        print(f"Error fetching learning roadmaps: {e}")
        return jsonify({"error": "Internal server error"}), 500

@learning_bp.route("/learning-roadmaps/<roadmap_type>/milestone/<int:milestone_id>/toggle", methods=["PUT"])
@token_required
def toggle_milestone(roadmap_type, milestone_id):
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor()

        # Verify the milestone belongs to the user's roadmap
        cursor.execute("""
            SELECT rm.completed
            FROM roadmap_milestones rm
            JOIN roadmap_phases rp ON rm.phase_id = rp.id
            JOIN learning_roadmaps lr ON rp.roadmap_id = lr.id
            WHERE rm.id = %s AND lr.user_id = %s AND lr.roadmap_type = %s
        """, (milestone_id, request.user_id, roadmap_type))

        result = cursor.fetchone()
        if not result:
            cursor.close()
            return jsonify({"error": "Milestone not found"}), 404

        # Toggle completion status
        new_status = not result[0]
        cursor.execute("""
            UPDATE roadmap_milestones
            SET completed = %s
            WHERE id = %s
        """, (new_status, milestone_id))

        db.commit()
        cursor.close()

        return jsonify({"success": True, "completed": new_status}), 200

    except Exception as e:
        print(f"Error toggling milestone: {e}")
        return jsonify({"error": "Internal server error"}), 500
