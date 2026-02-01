# routes/admin_routes.py

from flask import Blueprint, jsonify, request
from utils.helpers import require_admin
from config import Config
import mysql.connector
import json

admin_bp = Blueprint("admin_bp", __name__, url_prefix="/api/admin")

@admin_bp.route("/stats", methods=["GET"])
@require_admin
def admin_stats():
    db = None
    cursor = None
    try:
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) AS total_users FROM users WHERE role='user'")
        total_users = cursor.fetchone()["total_users"]

        cursor.execute("SELECT COUNT(*) AS total_assessments FROM assessments")
        total_assessments = cursor.fetchone()["total_assessments"]

        cursor.execute("SELECT COUNT(*) AS total_matches FROM career_recommendations")
        total_matches = cursor.fetchone()["total_matches"]

        # UI treats resumes as assessments
        total_resumes = total_assessments

        cursor.execute("""
            SELECT career_title AS name, COUNT(*) AS value
            FROM career_recommendations
            GROUP BY career_title
        """)
        career_distribution = cursor.fetchall()

        return jsonify({
            "total_users": total_users,
            "total_assessments": total_assessments,
            "total_resumes": total_resumes,
            "total_matches": total_matches,
            "career_distribution": career_distribution
        })
    except Exception as e:
        print(f"Error fetching admin stats: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@admin_bp.route("/analytics", methods=["GET"])
@require_admin
def get_admin_analytics():
    try:
        # Monthly data with more metrics
        cursor.execute("""
            SELECT
                DATE_FORMAT(u.created_at, '%b') as month,
                COUNT(DISTINCT u.id) as students,
                COUNT(DISTINCT a.id) as analyzed,
                COUNT(DISTINCT r.id) as matches,
                COUNT(DISTINCT CASE WHEN a.submitted_at IS NOT NULL THEN a.id END) as uploads
            FROM users u
            LEFT JOIN assessments a ON u.id = a.user_id AND a.submitted_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            LEFT JOIN career_recommendations r ON u.id = r.user_id AND r.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            WHERE u.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(u.created_at, '%Y-%m')
            ORDER BY u.created_at
        """)
        monthly_data = cursor.fetchall()

        # Weekly data (last 4 weeks)
        cursor.execute("""
            SELECT
                CONCAT('Week ', WEEK(u.created_at) - WEEK(CURDATE()) + 5) as week,
                COUNT(DISTINCT u.id) as registrations,
                COUNT(DISTINCT a.id) as analyses,
                COUNT(DISTINCT r.id) as matches
            FROM users u
            LEFT JOIN assessments a ON u.id = a.user_id AND a.submitted_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
            LEFT JOIN career_recommendations r ON u.id = r.user_id AND r.created_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
            WHERE u.created_at >= DATE_SUB(CURDATE(), INTERVAL 4 WEEK)
            GROUP BY WEEK(u.created_at)
            ORDER BY u.created_at
        """)
        weekly_data = cursor.fetchall()

        # Career data with growth
        cursor.execute("""
            SELECT
                career_title as name,
                COUNT(*) as value,
                ROUND(COUNT(*) * 1.0 / (SELECT COUNT(*) FROM career_recommendations) * 100, 1) as growth
            FROM career_recommendations
            GROUP BY career_title
            ORDER BY value DESC
            LIMIT 5
        """)
        career_data = cursor.fetchall()
        career_distribution = [
            {"name": row["name"], "value": row["value"], "growth": row["growth"], "color": "hsl(var(--primary))"} if i == 0 else
            {"name": row["name"], "value": row["value"], "growth": row["growth"], "color": "hsl(var(--success))"} if i == 1 else
            {"name": row["name"], "value": row["value"], "growth": row["growth"], "color": "hsl(var(--accent))"} if i == 2 else
            {"name": row["name"], "value": row["value"], "growth": row["growth"], "color": "hsl(var(--warning))"} if i == 3 else
            {"name": row["name"], "value": row["value"], "growth": row["growth"], "color": "hsl(var(--destructive))"}
            for i, row in enumerate(career_data)
        ]

        # Performance metrics (mock data for now, can be calculated from logs)
        performance_metrics = [
            {"metric": "Match Accuracy", "value": 87, "change": 5.2, "trend": "up"},
            {"metric": "Analysis Speed", "value": 92, "change": -2.1, "trend": "down"},
            {"metric": "User Satisfaction", "value": 94, "change": 8.7, "trend": "up"},
            {"metric": "System Uptime", "value": 99.8, "change": 0.1, "trend": "up"},
        ]

        # Skill demand data (mock data)
        skill_demand_data = [
            {"skill": "React", "demand": 85, "current": 72},
            {"skill": "Python", "demand": 78, "current": 68},
            {"skill": "JavaScript", "demand": 82, "current": 75},
            {"skill": "AWS", "demand": 70, "current": 58},
            {"skill": "SQL", "demand": 75, "current": 65},
            {"skill": "Machine Learning", "demand": 65, "current": 45},
        ]

        return jsonify({
            "monthly_data": monthly_data,
            "weekly_data": weekly_data,
            "career_distribution": career_distribution,
            "performance_metrics": performance_metrics,
            "skill_demand_data": skill_demand_data
        })

    except Exception as e:
        print(f"Error fetching admin analytics: {e}")
        return jsonify({"error": "Internal server error"}), 500

@admin_bp.route("/students", methods=["GET"])
@require_admin
def get_all_students():
    db = None
    cursor = None
    try:
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                u.id,
                u.name,
                u.email,
                u.created_at as enrolled,
                COALESCE(a.interest_domain, 'Not Specified') as major,
                CASE WHEN a.id IS NOT NULL THEN 'Active' ELSE 'Inactive' END as status
            FROM users u
            LEFT JOIN assessments a ON u.id = a.user_id
            WHERE u.role = 'user'
            ORDER BY u.created_at DESC
        """)
        students = cursor.fetchall()
        return jsonify(students)
    except Exception as e:
        print(f"Error fetching students: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()
