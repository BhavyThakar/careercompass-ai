# routes/ai_routes.py

from flask import Blueprint, jsonify
from models.recommendation_model import get_latest_recommendation_by_user
from utils.helpers import require_login, require_admin

ai_bp = Blueprint("ai", __name__)


@ai_bp.route("/api/career/<int:user_id>", methods=["GET"])
@require_login
def get_latest_career(user_id):
    result = get_latest_recommendation_by_user(user_id)
    if not result:
        return jsonify({"message": "No career recommendation found"}), 404
    return jsonify(result)


@ai_bp.route("/api/admin/stats", methods=["GET"])
@require_admin
def admin_stats():
    # Minimal admin stats (can be expanded later)
    from models.user_model import get_all_users
    from models.assessment_model import get_all_assessments
    from models.recommendation_model import get_all_recommendations

    return jsonify({
        "totalUsers": len(get_all_users()),
        "totalAssessments": len(get_all_assessments()),
        "totalRecommendations": len(get_all_recommendations())
    })
