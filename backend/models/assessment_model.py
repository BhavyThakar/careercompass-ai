# models/assessment_model.py

import mysql.connector
from config import Config


def create_assessment(
    user_id: int,
    technical_score: int,
    creativity_score: int,
    logic_score: int,
    communication_score: int,
    interest_domain: str
):
    """
    Insert a new assessment record for a student
    """
    db = mysql.connector.connect(**Config.DB_CONFIG)
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            INSERT INTO assessments
            (user_id, technical_score, creativity_score, logic_score, communication_score, interest_domain)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (
            user_id,
            technical_score,
            creativity_score,
            logic_score,
            communication_score,
            interest_domain
        ))
        db.commit()
        return cursor.lastrowid
    finally:
        cursor.close()
        db.close()


def get_assessments_by_user(user_id: int):
    """
    Fetch all assessments submitted by a user
    """
    db = mysql.connector.connect(**Config.DB_CONFIG)
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT *
            FROM assessments
            WHERE user_id = %s
            ORDER BY submitted_at DESC
        """
        cursor.execute(query, (user_id,))
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


def get_latest_assessment(user_id: int):
    """
    Fetch the most recent assessment of a user
    """
    db = mysql.connector.connect(**Config.DB_CONFIG)
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT *
            FROM assessments
            WHERE user_id = %s
            ORDER BY submitted_at DESC
            LIMIT 1
        """
        cursor.execute(query, (user_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def get_all_assessments():
    """
    Fetch all assessments (admin use)
    """
    db = mysql.connector.connect(**Config.DB_CONFIG)
    cursor = db.cursor(dictionary=True)
    try:
        query = """
            SELECT a.*, u.name, u.email
            FROM assessments a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.submitted_at DESC
        """
        cursor.execute(query)
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()
