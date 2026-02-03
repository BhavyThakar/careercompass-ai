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

@admin_bp.route("/students/<int:student_id>", methods=["GET"])
@require_admin
def get_student_details(student_id):
    db = None
    cursor = None
    try:
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)
        
        # Get student basic info
        cursor.execute("""
            SELECT id, name, email, created_at as enrolled
            FROM users 
            WHERE id = %s AND role = 'user'
        """, (student_id,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        # Get assessment details
        cursor.execute("""
            SELECT 
                technical_score,
                creativity_score,
                logic_score,
                communication_score,
                interest_domain,
                submitted_at
            FROM assessments
            WHERE user_id = %s
            ORDER BY submitted_at DESC
            LIMIT 1
        """, (student_id,))
        assessment = cursor.fetchone()
        
        # Get career recommendations
        cursor.execute("""
            SELECT 
                career_title,
                confidence_score,
                explanation,
                created_at
            FROM career_recommendations
            WHERE user_id = %s
            ORDER BY confidence_score DESC
            LIMIT 5
        """, (student_id,))
        recommendations = cursor.fetchall()
        
        # Get activity summary
        cursor.execute("""
            SELECT 
                COUNT(DISTINCT a.id) as assessment_count,
                COUNT(DISTINCT cr.id) as recommendation_count,
                MAX(a.submitted_at) as last_assessment,
                MAX(cr.created_at) as last_recommendation
            FROM users u
            LEFT JOIN assessments a ON u.id = a.user_id
            LEFT JOIN career_recommendations cr ON u.id = cr.user_id
            WHERE u.id = %s
        """, (student_id,))
        activity = cursor.fetchone()
        
        student['assessment'] = assessment
        student['recommendations'] = recommendations
        student['activity'] = activity
        
        return jsonify(student)
    except Exception as e:
        print(f"Error fetching student details: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@admin_bp.route("/students/<int:student_id>/action", methods=["POST"])
@require_admin
def take_student_action(student_id):
    db = None
    cursor = None
    try:
        action_data = request.json
        action = action_data.get('action')
        notes = action_data.get('notes', '')
        
        if action not in ['activate', 'deactivate', 'reset_assessment', 'send_notification', 'delete_recommendations', 'extend_access', 'suspend_account', 'reset_password']:
            return jsonify({"error": "Invalid action"}), 400
        
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)
        
        # Verify student exists
        cursor.execute("SELECT id, name, email FROM users WHERE id = %s AND role = 'user'", (student_id,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        # Perform specific actions
        if action == 'delete_recommendations':
            cursor.execute("DELETE FROM career_recommendations WHERE user_id = %s", (student_id,))
            action_desc = f"Deleted all recommendations for {student['name']}"
        elif action == 'reset_assessment':
            cursor.execute("DELETE FROM assessments WHERE user_id = %s", (student_id,))
            cursor.execute("DELETE FROM career_recommendations WHERE user_id = %s", (student_id,))
            action_desc = f"Reset assessment and recommendations for {student['name']}"
        elif action == 'suspend_account':
            cursor.execute("UPDATE users SET status = 'suspended' WHERE id = %s", (student_id,))
            action_desc = f"Suspended account for {student['name']}"
        elif action == 'activate':
            cursor.execute("UPDATE users SET status = 'active' WHERE id = %s", (student_id,))
            action_desc = f"Activated account for {student['name']}"
        elif action == 'deactivate':
            cursor.execute("UPDATE users SET status = 'inactive' WHERE id = %s", (student_id,))
            action_desc = f"Deactivated account for {student['name']}"
        elif action == 'reset_password':
            import secrets
            new_password = secrets.token_urlsafe(12)
            cursor.execute("UPDATE users SET password = %s WHERE id = %s", (new_password, student_id))
            action_desc = f"Reset password for {student['name']}. New password: {new_password}"
        else:
            action_desc = f"Student {action}: {student['name']} (ID: {student_id})"
        
        # Log the action
        cursor.execute("""
            INSERT INTO system_logs (action, performed_by)
            VALUES (%s, %s)
        """, (action_desc, request.headers.get('X-USER-ID')))
        
        db.commit()
        
        response_data = {
            "message": f"Action '{action}' performed successfully on student {student['name']}",
            "student": student
        }
        
        if action == 'reset_password':
            response_data["new_password"] = new_password
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"Error performing student action: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@admin_bp.route("/students/<int:student_id>/history", methods=["GET"])
@require_admin
def get_student_history(student_id):
    db = None
    cursor = None
    try:
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)
        
        # Get login history (mock data for now)
        cursor.execute("""
            SELECT 
                'login' as action_type,
                created_at,
                'User logged in' as description
            FROM system_logs
            WHERE performed_by = %s
            ORDER BY created_at DESC
            LIMIT 10
        """, (student_id,))
        login_history = cursor.fetchall()
        
        # Get assessment history
        cursor.execute("""
            SELECT 
                'assessment' as action_type,
                submitted_at as created_at,
                CONCAT('Assessment completed - Technical: ', technical_score, '%, Creativity: ', creativity_score, '%') as description
            FROM assessments
            WHERE user_id = %s
            ORDER BY submitted_at DESC
            LIMIT 10
        """, (student_id,))
        assessment_history = cursor.fetchall()
        
        # Get recommendation history
        cursor.execute("""
            SELECT 
                'recommendation' as action_type,
                created_at,
                CONCAT('Career recommendation: ', career_title, ' (', confidence_score, '% match)') as description
            FROM career_recommendations
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 10
        """, (student_id,))
        recommendation_history = cursor.fetchall()
        
        # Get system actions on this student
        cursor.execute("""
            SELECT 
                'system_action' as action_type,
                created_at,
                action as description
            FROM system_logs
            WHERE action LIKE %s
            ORDER BY created_at DESC
            LIMIT 10
        """, (f"%{student_id}%",))
        system_actions = cursor.fetchall()
        
        # Combine all histories and sort by date
        all_history = login_history + assessment_history + recommendation_history + system_actions
        all_history.sort(key=lambda x: x['created_at'], reverse=True)
        
        return jsonify(all_history[:20])  # Return latest 20 activities
    except Exception as e:
        print(f"Error fetching student history: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@admin_bp.route("/students/<int:student_id>/communications", methods=["GET"])
@require_admin
def get_student_communications(student_id):
    db = None
    cursor = None
    try:
        # Mock communications data for now
        communications = [
            {
                id: 1,
                type: 'email',
                subject: 'Welcome to Career Compass AI',
                content: 'Thank you for joining our platform...',
                sent_at: '2024-01-15T10:30:00Z',
                status: 'delivered'
            },
            {
                id: 2,
                type: 'notification',
                subject: 'Assessment Reminder',
                content: 'Please complete your assessment...',
                sent_at: '2024-01-20T14:15:00Z',
                status: 'read'
            }
        ]
        
        return jsonify(communications)
    except Exception as e:
        print(f"Error fetching student communications: {e}")
        return jsonify({"error": "Internal server error"}), 500

@admin_bp.route("/students/<int:student_id>/send-message", methods=["POST"])
@require_admin
def send_student_message(student_id):
    db = None
    cursor = None
    try:
        message_data = request.json
        subject = message_data.get('subject', '')
        content = message_data.get('content', '')
        message_type = message_data.get('type', 'notification')
        
        if not subject or not content:
            return jsonify({"error": "Subject and content are required"}), 400
        
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)
        
        # Get student info
        cursor.execute("SELECT name, email FROM users WHERE id = %s AND role = 'user'", (student_id,))
        student = cursor.fetchone()
        
        if not student:
            return jsonify({"error": "Student not found"}), 404
        
        # Log the message
        cursor.execute("""
            INSERT INTO system_logs (action, performed_by)
            VALUES (%s, %s)
        """, (f"Sent {message_type} to {student['name']}: {subject}", request.headers.get('X-USER-ID')))
        
        db.commit()
        
        return jsonify({
            "message": f"Message sent successfully to {student['name']}",
            "student": student
        })
        
    except Exception as e:
        print(f"Error sending student message: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()
