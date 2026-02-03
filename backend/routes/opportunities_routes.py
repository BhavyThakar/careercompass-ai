from flask import Blueprint, jsonify, request
from functools import wraps
import jwt
from config import Config

opportunities_bp = Blueprint("opportunities_bp", __name__, url_prefix="/api/student")

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

@opportunities_bp.route("/nearby-opportunities", methods=["GET"])
@token_required
def get_nearby_opportunities():
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor(dictionary=True)

        # Get user's location
        cursor.execute("""
            SELECT location_lat, location_lng, location_name, search_radius_km
            FROM nearby_opportunities
            WHERE user_id = %s
        """, (request.user_id,))

        user_location = cursor.fetchone()
        if not user_location:
            return jsonify({"error": "User location not set"}), 404

        # Get nearby job opportunities (simplified - in real implementation would use geospatial queries)
        cursor.execute("""
            SELECT id, title, company, location, job_type, experience_level,
                   salary_min, salary_max, description, application_url, posted_date
            FROM job_opportunities
            WHERE is_active = TRUE
            ORDER BY posted_date DESC
            LIMIT 20
        """)

        opportunities = cursor.fetchall()

        cursor.close()
        return jsonify({
            "user_location": user_location,
            "opportunities": opportunities
        }), 200

    except Exception as e:
        print(f"Error fetching nearby opportunities: {e}")
        return jsonify({"error": "Internal server error"}), 500

@opportunities_bp.route("/job-matches", methods=["GET"])
@token_required
def get_job_matches():
    try:
        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor(dictionary=True)

        # Get user's job matches with job details
        cursor.execute("""
            SELECT jm.id, jm.match_score, jm.skills_match, jm.experience_match,
                   jm.location_match, jm.salary_match, jm.is_saved, jm.is_applied,
                   jo.title, jo.company, jo.location, jo.job_type, jo.experience_level,
                   jo.salary_min, jo.salary_max, jo.description, jo.application_url
            FROM job_matches jm
            JOIN job_opportunities jo ON jm.job_id = jo.id
            WHERE jm.user_id = %s
            ORDER BY jm.match_score DESC
        """, (request.user_id,))

        matches = cursor.fetchall()

        cursor.close()
        return jsonify({"matches": matches}), 200

    except Exception as e:
        print(f"Error fetching job matches: {e}")
        return jsonify({"error": "Internal server error"}), 500

@opportunities_bp.route("/job-matches/<int:match_id>/save", methods=["PUT"])
@token_required
def save_job_match(match_id):
    try:
        data = request.get_json()
        if not data or 'saved' not in data:
            return jsonify({"error": "Missing 'saved' field"}), 400

        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor()

        # Verify the match belongs to the user
        cursor.execute("""
            SELECT id FROM job_matches
            WHERE id = %s AND user_id = %s
        """, (match_id, request.user_id))

        if not cursor.fetchone():
            cursor.close()
            return jsonify({"error": "Job match not found"}), 404

        # Update saved status
        cursor.execute("""
            UPDATE job_matches
            SET is_saved = %s
            WHERE id = %s
        """, (data['saved'], match_id))

        db.commit()
        cursor.close()

        return jsonify({"success": True, "message": "Job match updated successfully"}), 200

    except Exception as e:
        print(f"Error saving job match: {e}")
        return jsonify({"error": "Internal server error"}), 500

@opportunities_bp.route("/nearby-opportunities/location", methods=["POST"])
@token_required
def update_user_location():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        required_fields = ['location_lat', 'location_lng', 'location_name']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        db = request.environ.get('db') or None
        if not db:
            return jsonify({"error": "Database connection not available"}), 500

        cursor = db.cursor()

        # Insert or update user location
        cursor.execute("""
            INSERT INTO nearby_opportunities
            (user_id, location_lat, location_lng, location_name, search_radius_km)
            VALUES (%s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
            location_lat = VALUES(location_lat),
            location_lng = VALUES(location_lng),
            location_name = VALUES(location_name),
            search_radius_km = VALUES(search_radius_km),
            last_updated = CURRENT_TIMESTAMP
        """, (
            request.user_id,
            data['location_lat'],
            data['location_lng'],
            data['location_name'],
            data.get('search_radius_km', 50)
        ))

        db.commit()
        cursor.close()

        return jsonify({"success": True, "message": "Location updated successfully"}), 200

    except Exception as e:
        print(f"Error updating user location: {e}")
        return jsonify({"error": "Internal server error"}), 500
