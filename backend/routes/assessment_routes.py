# routes/assessment_routes.py

from flask import Blueprint, request, jsonify
from models.assessment_model import create_assessment, get_assessments_by_user
from models.recommendation_model import create_recommendation, get_recommendations_by_user
from services.ai_engine import generate_career_recommendation
from utils.helpers import require_login, get_logged_in_user
import mysql.connector
from config import Config

assessment_bp = Blueprint("assessment", __name__)


@assessment_bp.route("/api/submit-assessment", methods=["POST"])
@require_login
def submit_assessment():
    data = request.json

    assessment_id = create_assessment(
        user_id=data["user_id"],
        technical_score=data["technical"],
        creativity_score=data["creativity"],
        logic_score=data["logic"],
        communication_score=data["communication"],
        interest_domain=data["interest"]
    )

    ai_result = generate_career_recommendation({
        "technical_score": data["technical"],
        "creativity_score": data["creativity"],
        "logic_score": data["logic"],
        "communication_score": data["communication"],
        "interest_domain": data["interest"]
    })

    create_recommendation(
        user_id=data["user_id"],
        assessment_id=assessment_id,
        career_title=ai_result["career_title"],
        confidence_score=ai_result["confidence_score"],
        explanation=ai_result["explanation"]
    )

    return jsonify(ai_result)


@assessment_bp.route("/api/user/analysis", methods=["GET"])
@require_login
def get_user_analysis():
    try:
        # Get user ID from token
        user = get_logged_in_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401

        user_id = user["user_id"]

        # Get user's assessments
        assessments = get_assessments_by_user(user_id)
        recommendations = get_recommendations_by_user(user_id)

        if not assessments:
            return jsonify({"error": "No assessments found"}), 404

        # Get latest assessment for skills data
        latest_assessment = assessments[0] if assessments else None

        # Calculate skills data from assessment scores
        skills_data = []
        if latest_assessment:
            skills_data = [
                {"subject": "Technical Skills", "score": latest_assessment["technical_score"]},
                {"subject": "Creativity", "score": latest_assessment["creativity_score"]},
                {"subject": "Logic", "score": latest_assessment["logic_score"]},
                {"subject": "Communication", "score": latest_assessment["communication_score"]},
            ]

        # Calculate subject performance (mock data based on scores)
        avg_score = sum([a["technical_score"] + a["creativity_score"] + a["logic_score"] + a["communication_score"] for a in assessments]) / (len(assessments) * 4) if assessments else 0

        subject_performance = [
            {"subject": "Technical Skills", "score": int(avg_score), "status": "strength" if avg_score >= 80 else "average" if avg_score >= 60 else "gap"},
            {"subject": "Problem Solving", "score": int(avg_score + 5), "status": "strength" if avg_score + 5 >= 80 else "average" if avg_score + 5 >= 60 else "gap"},
            {"subject": "Communication", "score": int(avg_score - 10), "status": "strength" if avg_score - 10 >= 80 else "average" if avg_score - 10 >= 60 else "gap"},
            {"subject": "Teamwork", "score": int(avg_score + 2), "status": "strength" if avg_score + 2 >= 80 else "average" if avg_score + 2 >= 60 else "gap"},
        ]

        # Learning style analysis (mock based on scores)
        learning_styles = {
            "Visual Learner": min(100, max(40, latest_assessment["creativity_score"] if latest_assessment else 50)),
            "Reading/Writing": min(100, max(40, latest_assessment["logic_score"] if latest_assessment else 50)),
            "Kinesthetic": min(100, max(40, latest_assessment["technical_score"] if latest_assessment else 50)),
            "Auditory": min(100, max(40, latest_assessment["communication_score"] if latest_assessment else 50)),
        }

        # Strengths, weaknesses, gaps based on scores
        strengths = []
        weaknesses = []
        gaps = []

        if latest_assessment:
            if latest_assessment["technical_score"] >= 80:
                strengths.append("Technical Skills")
            elif latest_assessment["technical_score"] >= 60:
                weaknesses.append("Technical Skills")
            else:
                gaps.append("Technical Skills")

            if latest_assessment["creativity_score"] >= 80:
                strengths.append("Creativity")
            elif latest_assessment["creativity_score"] >= 60:
                weaknesses.append("Creativity")
            else:
                gaps.append("Creativity")

            if latest_assessment["logic_score"] >= 80:
                strengths.append("Problem Solving")
            elif latest_assessment["logic_score"] >= 60:
                weaknesses.append("Problem Solving")
            else:
                gaps.append("Problem Solving")

            if latest_assessment["communication_score"] >= 80:
                strengths.append("Communication")
            elif latest_assessment["communication_score"] >= 60:
                weaknesses.append("Communication")
            else:
                gaps.append("Communication")

        # AI insights based on recommendations
        ai_insights = []
        if recommendations:
            latest_rec = recommendations[0]
            ai_insights.append({
                "type": "strength",
                "title": f"Strong Match: {latest_rec['career_title']}",
                "description": f"Based on your assessment, {latest_rec['career_title']} appears to be an excellent fit with {latest_rec['confidence_score']}% confidence."
            })

            if avg_score < 70:
                ai_insights.append({
                    "type": "improvement",
                    "title": "Focus on Skill Development",
                    "description": "Consider improving your core skills to unlock more career opportunities."
                })

        return jsonify({
            "skills_data": skills_data,
            "subject_performance": subject_performance,
            "learning_styles": learning_styles,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "gaps": gaps,
            "ai_insights": ai_insights,
            "total_assessments": len(assessments),
            "latest_assessment_date": latest_assessment["submitted_at"].isoformat() if latest_assessment and latest_assessment["submitted_at"] else None
        })

    except Exception as e:
        print(f"Error fetching user analysis: {e}")
        return jsonify({"error": "Internal server error"}), 500


@assessment_bp.route("/api/user/recommendations", methods=["GET"])
@require_login
def get_user_recommendations():
    try:
        # Get user ID from token
        user = get_logged_in_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401

        user_id = user["user_id"]

        # Get user's recommendations
        recommendations = get_recommendations_by_user(user_id)

        if not recommendations:
            return jsonify({"error": "No recommendations found"}), 404

        # Format recommendations for frontend
        formatted_recommendations = []
        for rec in recommendations:
            formatted_recommendations.append({
                "id": rec["id"],
                "title": rec["career_title"],
                "match": rec["confidence_score"],
                "category": "Technology",  # Default category, could be enhanced
                "salary": "$80k - $150k",  # Mock data, could be from DB
                "growth": "+25%",  # Mock data
                "reasons": [rec["explanation"]],  # Simplified
                "skills": ["Programming", "Problem Solving"],  # Mock data
            })

        # Get top recommendation
        top_rec = max(recommendations, key=lambda x: x["confidence_score"])

        return jsonify({
            "recommendations": formatted_recommendations,
            "top_recommendation": {
                "title": top_rec["career_title"],
                "match": top_rec["confidence_score"],
                "description": top_rec["explanation"],
                "skills": ["Programming", "Problem Solving"],  # Mock
            }
        })

    except Exception as e:
        print(f"Error fetching user recommendations: {e}")
        return jsonify({"error": "Internal server error"}), 500


@assessment_bp.route("/api/user/path-unlocking", methods=["GET"])
@require_login
def get_path_unlocking():
    try:
        # Get user ID from token
        user = get_logged_in_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401

        user_id = user["user_id"]

        # Get user's latest assessment
        assessments = get_assessments_by_user(user_id)
        if not assessments:
            return jsonify({"error": "No assessments found"}), 404

        latest_assessment = assessments[0]

        # Mock career paths with unlocking logic based on scores
        career_paths = [
            {
                "id": 1,
                "title": "Software Developer",
                "unlocked": latest_assessment["technical_score"] >= 70 and latest_assessment["logic_score"] >= 65,
                "progress": min(100, (latest_assessment["technical_score"] + latest_assessment["logic_score"]) // 2),
                "skills": [
                    {"name": "Data Structures", "acquired": latest_assessment["logic_score"] >= 70},
                    {"name": "Algorithms", "acquired": latest_assessment["logic_score"] >= 75},
                    {"name": "Version Control", "acquired": latest_assessment["technical_score"] >= 65},
                    {"name": "Problem Solving", "acquired": latest_assessment["logic_score"] >= 70},
                ],
            },
            {
                "id": 2,
                "title": "Data Engineer",
                "unlocked": latest_assessment["technical_score"] >= 75,
                "progress": latest_assessment["technical_score"],
                "skills": [
                    {"name": "SQL", "acquired": latest_assessment["technical_score"] >= 70},
                    {"name": "Python", "acquired": latest_assessment["technical_score"] >= 75},
                    {"name": "Data Modeling", "acquired": latest_assessment["logic_score"] >= 70},
                    {"name": "ETL Basics", "acquired": latest_assessment["technical_score"] >= 80},
                ],
            },
            {
                "id": 3,
                "title": "Full Stack Developer",
                "unlocked": latest_assessment["technical_score"] >= 70 and latest_assessment["creativity_score"] >= 60,
                "progress": (latest_assessment["technical_score"] + latest_assessment["creativity_score"]) // 2,
                "skills": [
                    {"name": "Frontend Basics", "acquired": latest_assessment["creativity_score"] >= 60},
                    {"name": "Backend APIs", "acquired": latest_assessment["technical_score"] >= 70},
                    {"name": "React/Vue", "acquired": latest_assessment["creativity_score"] >= 65},
                    {"name": "DevOps Basics", "acquired": latest_assessment["technical_score"] >= 80},
                ],
            },
            {
                "id": 4,
                "title": "Machine Learning Engineer",
                "unlocked": latest_assessment["logic_score"] >= 80 and latest_assessment["technical_score"] >= 75,
                "progress": (latest_assessment["logic_score"] + latest_assessment["technical_score"]) // 2,
                "skills": [
                    {"name": "Python", "acquired": latest_assessment["technical_score"] >= 75},
                    {"name": "Statistics", "acquired": latest_assessment["logic_score"] >= 80},
                    {"name": "ML Algorithms", "acquired": latest_assessment["logic_score"] >= 85},
                    {"name": "Deep Learning", "acquired": latest_assessment["logic_score"] >= 90},
                    {"name": "Model Deployment", "acquired": latest_assessment["technical_score"] >= 85},
                ],
            },
            {
                "id": 5,
                "title": "Cloud Architect",
                "unlocked": latest_assessment["technical_score"] >= 85,
                "progress": latest_assessment["technical_score"],
                "skills": [
                    {"name": "Networking", "acquired": latest_assessment["technical_score"] >= 70},
                    {"name": "Linux", "acquired": latest_assessment["technical_score"] >= 75},
                    {"name": "AWS/Azure/GCP", "acquired": latest_assessment["technical_score"] >= 85},
                    {"name": "Infrastructure as Code", "acquired": latest_assessment["technical_score"] >= 90},
                    {"name": "Security", "acquired": latest_assessment["technical_score"] >= 80},
                ],
            },
            {
                "id": 6,
                "title": "Cybersecurity Specialist",
                "unlocked": latest_assessment["logic_score"] >= 75 and latest_assessment["technical_score"] >= 70,
                "progress": (latest_assessment["logic_score"] + latest_assessment["technical_score"]) // 2,
                "skills": [
                    {"name": "Networking", "acquired": latest_assessment["technical_score"] >= 70},
                    {"name": "Cryptography", "acquired": latest_assessment["logic_score"] >= 75},
                    {"name": "Penetration Testing", "acquired": latest_assessment["logic_score"] >= 80},
                    {"name": "Security Protocols", "acquired": latest_assessment["logic_score"] >= 85},
                    {"name": "Incident Response", "acquired": latest_assessment["logic_score"] >= 80},
                ],
            },
        ]

        unlocked_count = sum(1 for path in career_paths if path["unlocked"])
        total_count = len(career_paths)

        # Find next unlockable path
        next_unlock = None
        for path in career_paths:
            if not path["unlocked"] and path["progress"] >= 70:
                next_unlock = path
                break

        return jsonify({
            "career_paths": career_paths,
            "unlocked_count": unlocked_count,
            "total_count": total_count,
            "next_unlock": next_unlock["title"] if next_unlock else None,
            "skills_to_learn": sum(1 for path in career_paths for skill in path["skills"] if not skill["acquired"])
        })

    except Exception as e:
        print(f"Error fetching path unlocking: {e}")
        return jsonify({"error": "Internal server error"}), 500
