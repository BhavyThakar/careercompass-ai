# models/recommendation_model.py

import mysql.connector
from config import Config


def create_recommendation(
    user_id: int,
    assessment_id: int,
    career_title: str,
    confidence_score: int,
    explanation: str
):
    """
    Store AI-generated career recommendation
    """
    db = mysql.connector.connect(**Config.DB_CONFIG)
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            INSERT INTO career_recommendations
            (user_id, assessment_id, career_title, confidence_score, explanation)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            user_id,
            assessment_id,
            career_title,
            confidence_score,
            explanation
        ))
        db.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        db.close()


def get_latest_recommendation_by_user(user_id: int):
    """
    Fetch the latest career recommendation for a user
    """
    db = mysql.connector.connect(**Config.DB_CONFIG)
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT *
            FROM career_recommendations
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """
        cursor.execute(query, (user_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def get_recommendations_by_user(user_id: int):
    """
    Fetch all career recommendations for a user
    """
    db = mysql.connector.connect(**Config.DB_CONFIG)
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT *
            FROM career_recommendations
            WHERE user_id = %s
            ORDER BY created_at DESC
        """
        cursor.execute(query, (user_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


def get_all_recommendations():
    """
    Fetch all recommendations (admin use)
    """
    db = mysql.connector.connect(**Config.DB_CONFIG)
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT
                r.*,
                u.name AS user_name,
                u.email AS user_email
            FROM career_recommendations r
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        """
        cursor.execute(query)
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()
