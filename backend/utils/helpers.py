# utils/helpers.py

from flask import request, jsonify
from functools import wraps
import jwt
from config import Config


def get_logged_in_user():
    """
    Extract logged-in user info from JWT token in Authorization header or custom headers.
    """
    # First try Authorization header with Bearer token
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            return {
                "user_id": payload["user_id"],
                "role": payload["role"]
            }
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    # Fallback to custom headers for admin endpoints
    user_id = request.headers.get("X-USER-ID")
    user_role = request.headers.get("X-USER-ROLE")

    if user_id and user_role:
        try:
            return {
                "user_id": int(user_id),
                "role": user_role
            }
        except ValueError:
            return None

    return None


def require_login(f):
    """
    Decorator to ensure the user is logged in
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_logged_in_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)

    return decorated_function


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_logged_in_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401

        if user["role"] != "admin":
            return jsonify({"error": "Forbidden"}), 403

        return f(*args, **kwargs)
    return decorated
