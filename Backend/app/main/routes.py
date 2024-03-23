from flask import Blueprint, jsonify, request

from app import db

from app.models import (
    OrgProfile,
)

main = Blueprint("main", __name__)


# Get all organisations
@main.route("/main/orgs", methods=["GET"])
def get_all_orgs():

    orgs = OrgProfile.query.all()

    # Get the name and org overview of each organisation
    orgs_data = []
    for org in orgs:
        org_data = {
            "id": org.id,
            "org_name": org.org_name,
            "org_overview": org.org_overview,
            "email": org.admin_email,
        }

        orgs_data.append(org_data)

    return jsonify(orgs_data), 200
