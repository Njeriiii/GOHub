from flask import Blueprint, jsonify, request, session
from werkzeug.exceptions import NotFound
from werkzeug.security import check_password_hash, generate_password_hash

from app import db
# from app.auth.utils import login_required, send_reset_email
from app.models import User

auth = Blueprint("auth", __name__)


@auth.route("/signup", methods=["POST"])
def signup_post():
    response_data = {}

    data = request.get_json()

    # code to validate and add user to the database goes here
    email = data["email"]
    first_name = data["first_name"]
    last_name = data["last_name"]
    password = data["password"]

    # If this returns a user, then the email already exists in the database
    user = User.query.filter_by(email=email).first()

    # If a user is found, we want to return a JSON response indicating the email already exists
    if user:
        response_data["message"] = "Bad Request"
        return jsonify(response_data), 400  # 400 Bad Request

    # Create a new user with the form data. Hash the password so the plaintext version isn't saved.
    new_user = User(
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=generate_password_hash(password, method="sha256"),
    )

    # Add the new user to the database
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id

    response_data["message"] = "User registered successfully"

    return jsonify(response_data), 201  # 201 Created


@auth.route("/login", methods=["POST"])
def login_post():
    response_data = {}

    data = request.get_json()
    # Get user input from the request
    email = data["email"]
    password = data["password"]

    # Try to find the user by email in the database
    user = User.query.filter_by(email=email).first()

    # If no user with that email is found, return an error response
    if user is None:
        response_data["message"] = "User not found"
        return jsonify(response_data), 401  # 401 Unauthorized

    # Check if the provided password matches the stored hashed password
    if not check_password_hash(user.password, password):
        response_data["message"] = "Incorrect password"
        return jsonify(response_data), 401  # 401 Unauthorized

    response_data["message"] = "Login successful"
    session["user_id"] = user.id
    return jsonify(response_data), 200  # 200 OK


@auth.route("/logout", methods=["GET"])
# @login_required
def logout():
    """
    Log out a user.

    This route allows a logged-in user to log out, terminating their session.

    Returns:
    - A JSON response indicating successful logout with a 200 status code.

    Args:
    - None
    """
    response_data = {}
    # Clear the user's session and log them out
    session.pop("user_id", None)
    response_data["message"] = "Logout successful"
    return jsonify(response_data), 200  # 200 OK