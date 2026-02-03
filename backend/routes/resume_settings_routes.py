from flask import Blueprint, jsonify, request
from utils.helpers import require_admin
from config import Config
import mysql.connector
import json

resume_bp = Blueprint("resume_bp", __name__, url_prefix="/api/admin")

@resume_bp.route("/resume-settings", methods=["GET"])
@require_admin
def get_resume_settings():
    db = None
    cursor = None
    try:
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT setting_key, setting_value, setting_type, description FROM resume_settings")
        settings = cursor.fetchall()

        # Convert setting_value based on type
        for setting in settings:
            if setting['setting_type'] == 'boolean':
                setting['setting_value'] = setting['setting_value'].lower() == 'true'
            elif setting['setting_type'] == 'number':
                setting['setting_value'] = int(setting['setting_value'])
            elif setting['setting_type'] == 'json':
                setting['setting_value'] = json.loads(setting['setting_value'])

        return jsonify(settings)
    except Exception as e:
        print(f"Error fetching resume settings: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@resume_bp.route("/resume-settings", methods=["PUT"])
@require_admin
def update_resume_settings():
    db = None
    cursor = None
    try:
        data = request.get_json()
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor()

        for setting in data:
            setting_key = setting['setting_key']
            setting_value = setting['setting_value']
            setting_type = setting['setting_type']

            # Convert value based on type
            if setting_type == 'boolean':
                setting_value = 'true' if setting_value else 'false'
            elif setting_type == 'number':
                setting_value = str(setting_value)
            elif setting_type == 'json':
                setting_value = json.dumps(setting_value)

            cursor.execute("""
                UPDATE resume_settings
                SET setting_value = %s, setting_type = %s
                WHERE setting_key = %s
            """, (setting_value, setting_type, setting_key))

        db.commit()
        return jsonify({"message": "Resume settings updated successfully"})
    except Exception as e:
        print(f"Error updating resume settings: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@resume_bp.route("/scoring-criteria", methods=["GET"])
@require_admin
def get_scoring_criteria():
    db = None
    cursor = None
    try:
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, criteria_name, weight, required, description FROM scoring_criteria ORDER BY weight DESC")
        criteria = cursor.fetchall()
        return jsonify(criteria)
    except Exception as e:
        print(f"Error fetching scoring criteria: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@resume_bp.route("/scoring-criteria", methods=["PUT"])
@require_admin
def update_scoring_criteria():
    db = None
    cursor = None
    try:
        data = request.get_json()
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor()

        for criterion in data:
            criteria_id = criterion['id']
            weight = criterion['weight']
            required = criterion['required']

            cursor.execute("""
                UPDATE scoring_criteria
                SET weight = %s, required = %s
                WHERE id = %s
            """, (weight, required, criteria_id))

        db.commit()
        return jsonify({"message": "Scoring criteria updated successfully"})
    except Exception as e:
        print(f"Error updating scoring criteria: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@resume_bp.route("/resume-templates", methods=["GET"])
@require_admin
def get_resume_templates():
    db = None
    cursor = None
    try:
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id, name, active, downloads, created_at, updated_at FROM resume_templates ORDER BY downloads DESC")
        templates = cursor.fetchall()
        return jsonify(templates)
    except Exception as e:
        print(f"Error fetching resume templates: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()

@resume_bp.route("/resume-templates", methods=["PUT"])
@require_admin
def update_resume_templates():
    db = None
    cursor = None
    try:
        data = request.get_json()
        db = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = db.cursor()

        for template in data:
            template_id = template['id']
            active = template['active']

            cursor.execute("""
                UPDATE resume_templates
                SET active = %s
                WHERE id = %s
            """, (active, template_id))

        db.commit()
        return jsonify({"message": "Resume templates updated successfully"})
    except Exception as e:
        print(f"Error updating resume templates: {e}")
        return jsonify({"error": "Internal server error"}), 500
    finally:
        if cursor:
            cursor.close()
        if db and db.is_connected():
            db.close()
