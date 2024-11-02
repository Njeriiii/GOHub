import logging
from flask import Blueprint, jsonify, request, session, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from app import db
from app.models import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt, unset_jwt_cookies
from werkzeug.security import check_password_hash
from datetime import timedelta

auth = Blueprint("auth", __name__)


@auth.route("/auth/signup", methods=["OPTIONS", "POST"])
def signup():
    if request.method == "OPTIONS":
        return make_response("", 204)

    response_data = {}

    data = request.get_json()

    # code to validate and add user to the database goes here
    email = data["email"]
    first_name = data["firstName"]
    last_name = data["lastName"]
    password = data["password"]
    is_admin = data["isAdmin"]  # 'admin' for org admins, 'volunteer' for volunteers

    # Validate user_type
    if not isinstance(is_admin, bool):
        response_data["message"] = "Invalid user type"
        return jsonify(response_data), 400

    # Validate required fields
    if not all([email, first_name, last_name, password]) or is_admin not in [True, False]:
        response_data["message"] = "Missing required fields"
        return jsonify(response_data), 400

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
        is_admin=is_admin,
    )

    # Add the new user to the database
    try:
        db.session.add(new_user)
        db.session.commit()
        session["user_id"] = new_user.id

        response_data["message"] = "User registered successfully"
        response_data["user_id"] = new_user.id
        response_data["user_type"] = "admin" if is_admin else "volunteer"
        return jsonify(response_data), 201
    except Exception as e:
        db.session.rollback()
        response_data["message"] = f"An error occurred: {str(e)}"
        logging.error(response_data["message"])
        return jsonify(response_data), 500


@auth.route('/auth/login', methods=['POST'])
def login():
    """
    Validates the incoming JSON data
    Checks the user credentials
    Generates a JWT token if the credentials are valid

    Returns:
    - A JSON response containing the JWT token and a 200 status code if the credentials are valid
    """
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        # Identity can be any data that is json serializable
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401


@auth.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Logs out the user by revoking the JWT token
    """
    jti = get_jwt()['jti']
    
    response = jsonify({"msg": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response, 200


@auth.route('/auth/user', methods=['GET'])
@jwt_required()  # This decorator ensures that a valid JWT token is present
def get_current_user():
    # Get the identity of the current user from the JWT token
    current_user_id = get_jwt_identity()
    
    # Query the database to get the user
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    # Return the user data
    return jsonify({
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "is_admin": user.is_admin,
    }), 200