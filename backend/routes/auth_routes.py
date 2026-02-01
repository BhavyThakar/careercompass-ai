from flask import Blueprint, request, jsonify
from models.user_model import create_user, get_user_by_email_and_password, get_user_by_id
from utils.helpers import require_login, get_logged_in_user
from datetime import datetime, timedelta
import jwt
from config import Config
import mysql.connector

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/api/register", methods=["POST"])
def register():
    data = request.json

    try:
        user_id = create_user(
            name=data["name"],
            email=data["email"],
            password=data["password"],
            role=data.get("role", "user")
        )
        return jsonify({"message": "User registered successfully", "user_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": "Email already exists"}), 400


@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json

    user = get_user_by_email_and_password(
        email=data["email"],
        password=data["password"]
    )

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # Generate JWT token
    token_payload = {
        "user_id": user["id"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(token_payload, Config.SECRET_KEY, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "role": user["role"]
        }
    })


@auth_bp.route("/api/profile", methods=["GET"])
@require_login
def get_profile():
    try:
        # Get user ID from token
        user = get_logged_in_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401

        user_id = user["user_id"]

        # Get user basic info
        user_info = get_user_by_id(user_id)
        if not user_info:
            return jsonify({"error": "User not found"}), 404

        # Get user stats
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)

        # Count total assessments
        cursor.execute("SELECT COUNT(*) as total FROM assessments WHERE user_id = %s", (user_id,))
        total_assessments = cursor.fetchone()["total"]

        # Count total recommendations
        cursor.execute("SELECT COUNT(*) as total FROM career_recommendations WHERE user_id = %s", (user_id,))
        total_recommendations = cursor.fetchone()["total"]

        # Calculate overall CGPA (average of technical, creativity, logic, communication scores)
        cursor.execute("""
            SELECT AVG((technical_score + creativity_score + logic_score + communication_score) / 4) as avg_cgpa
            FROM assessments
            WHERE user_id = %s
        """, (user_id,))
        cgpa_result = cursor.fetchone()
        overall_cgpa = cgpa_result["avg_cgpa"] if cgpa_result["avg_cgpa"] else 0

        # Calculate improvement score (mock for now - could be based on trend analysis)
        improvement_score = 5.2  # Placeholder

        # Get last assessment date
        cursor.execute("""
            SELECT MAX(submitted_at) as last_date
            FROM assessments
            WHERE user_id = %s
        """, (user_id,))
        last_assessment = cursor.fetchone()["last_date"]

        # Generate mock performance data (last 6 months)
        from datetime import datetime, timedelta
        performance_data = []
        attendance_data = []
        base_date = datetime.now()

        for i in range(6):
            month_date = base_date - timedelta(days=30 * i)
            month_name = month_date.strftime("%b")

            # Mock performance scores
            score = min(100, max(60, 75 + (i * 2) + (user_id % 10)))
            performance_data.append({"month": month_name, "score": score})

            # Mock attendance/assessment progress
            rate = min(100, max(70, 85 + (i * 1) + (user_id % 5)))
            attendance_data.append({"month": month_name, "rate": rate})

        # Reverse to show chronological order
        performance_data.reverse()
        attendance_data.reverse()

        cursor.close()
        db.close()

        return jsonify({
            "user": {
                "id": user_info["id"],
                "name": user_info["name"],
                "email": user_info["email"],
                "role": user_info["role"],
                "joined_date": user_info["created_at"].isoformat() if user_info["created_at"] else None
            },
            "stats": {
                "total_assessments": total_assessments,
                "total_recommendations": total_recommendations,
                "overall_cgpa": float(overall_cgpa),
                "improvement_score": improvement_score,
                "last_assessment_date": last_assessment.isoformat() if last_assessment else None
            },
            "performance_data": performance_data,
            "attendance_data": attendance_data
        })

    except Exception as e:
        print(f"Error fetching profile: {e}")
        return jsonify({"error": "Internal server error"}), 500
