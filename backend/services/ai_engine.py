# services/ai_engine.py

"""
AI Engine (Rule-Based)

This module contains the core career recommendation logic.
For the current phase, recommendations are generated using
rule-based intelligence. This can later be replaced or
enhanced with ML/DL models without changing routes or DB.
"""


def generate_career_recommendation(assessment):
    """
    Generate career recommendation based on assessment scores

    assessment: dict with keys
    - technical_score
    - creativity_score
    - logic_score
    - communication_score
    - interest_domain
    """

    technical = assessment.get("technical_score", 0)
    creativity = assessment.get("creativity_score", 0)
    logic = assessment.get("logic_score", 0)
    communication = assessment.get("communication_score", 0)
    interest = assessment.get("interest_domain", "").lower()

    # ---------- RULE-BASED AI LOGIC ----------

    # Strong technical + logic
    if technical >= 70 and logic >= 65:
        career = "Software Engineer"
        confidence = 85
        explanation = (
            "High technical and logical ability indicates strong potential "
            "for software development roles."
        )

    # Creative thinker
    elif creativity >= 70:
        career = "UI/UX Designer"
        confidence = 80
        explanation = (
            "Creativity score suggests strong design thinking "
            "and user experience skills."
        )

    # Communication-focused
    elif communication >= 70:
        career = "Business Analyst"
        confidence = 75
        explanation = (
            "Strong communication skills are well suited for "
            "analysis, coordination, and stakeholder roles."
        )

    # Interest-based fallback
    elif "data" in interest:
        career = "Data Analyst"
        confidence = 72
        explanation = (
            "Interest in data-oriented domains aligns with "
            "analytical and data-driven career paths."
        )

    # Balanced profile
    else:
        career = "General IT Professional"
        confidence = 65
        explanation = (
            "Balanced skill set detected. Recommended to explore "
            "multiple IT domains before specialization."
        )

    return {
        "career_title": career,
        "confidence_score": confidence,
        "explanation": explanation
    }
