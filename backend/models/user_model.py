# models/user_model.py

import mysql.connector
from config import Config
import hashlib

# Create DB connection
db = mysql.connector.connect(**Config.DB_CONFIG)
cursor = db.cursor(dictionary=True)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_user(name, email, password, role="user"):
    hashed_password = hash_password(password)

    query = """
        INSERT INTO users (name, email, password, role)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(query, (name, email, hashed_password, role))
    db.commit()
    return cursor.lastrowid


def get_user_by_email_and_password(email, password):
    hashed_password = hash_password(password)

    query = """
        SELECT id, name, email, role
        FROM users
        WHERE email = %s AND password = %s
    """
    cursor.execute(query, (email, hashed_password))
    return cursor.fetchone()


def get_user_by_id(user_id):
    query = """
        SELECT id, name, email, role, created_at
        FROM users
        WHERE id = %s
    """
    cursor.execute(query, (user_id,))
    return cursor.fetchone()


def get_all_users():
    query = """
        SELECT id, name, email, role, created_at
        FROM users
    """
    cursor.execute(query)
    return cursor.fetchall()
