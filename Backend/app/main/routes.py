from flask import Blueprint, json, jsonify, request
from google.cloud import translate_v2 as translate
import os
from app import db
from functools import lru_cache
from datetime import datetime, timedelta
from google.oauth2 import service_account
import logging
from sqlalchemy.sql import text
from app.models import (
    User,
    SkillsNeeded,
    org_skills_connection,
    OrgProfile,
    TranslationCache,
    serialize_org_skill_connection
)

main = Blueprint("main", __name__)

# Add a simple health check endpoint to your Flask app
@main.route('/main/health')
def health_check():
    try:
        # Test database connection
        db.session.execute(text('SELECT 1'))
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500


# Get all organisations
@main.route("/main/orgs", methods=["GET"])
def get_all_orgs():

    orgs = OrgProfile.query.all()

    # Get the name and org overview of each organisation
    orgs_data = []
    for org in orgs:
        org_data = {
            "id": org.id,
            "user_id": org.user_id,
            "org_name": org.org_name,
            "org_overview": org.org_overview,
            "focus_areas": [focus_area.serialize() for focus_area in org.focus_areas],
            "skills_needed": [skill.serialize() for skill in org.skills_needed],
            "org_logo_filename": org.logo_url,
            "org_mission_statement": org.org_mission_statement,
            "org_year_established": org.org_year_established,
            "org_district_town": org.org_district_town,
            "org_county": org.org_county,
        }

        orgs_data.append(org_data)

    return jsonify(orgs_data), 200


@main.route("/main/match-skills", methods=["GET"])
def match_volunteer_skills():
    
    user_id = request.args.get("user_id")
    
    if not user_id:
        return jsonify({"message": "User ID is required"}), 400
    
    try:
        volunteer = User.query.get(user_id)
        if not volunteer:
            return jsonify({"message": "Volunteer not found"}), 404
        
        # Get the volunteer's skills
        volunteer_skills = set(skill.id for skill in volunteer.skills)
        
        # Query for organizations that need any of the volunteer's skills
        matching_orgs = (
            OrgProfile.query.join(org_skills_connection)
            .join(SkillsNeeded)
            .filter(SkillsNeeded.id.in_(volunteer_skills))
            .distinct()
            .all()
        )

        # Prepare the response data
        org_matches = []
        for org in matching_orgs:
            # Get the skills connections for this organization
            org_skills = (
                db.session.query(org_skills_connection)
                .join(SkillsNeeded)
                .filter(org_skills_connection.c.org_id == org.id)
                .all()
            )
            org_matches.append(
                {
                    "org_id": org.id,
                    "org_name": org.org_name,
                    "user_id": org.user_id,
                    "focus_areas": [focus_area.serialize() for focus_area in org.focus_areas],
                    "skills_needed": [
                        serialize_org_skill_connection(skill_connection)
                        for skill_connection in org_skills
                    ],
                }
            )
        
        return (
            jsonify(
                {"message": "Matching organizations found", "matches": org_matches}
            ),
            200,
        )
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"An error occurred: {str(e)}"}), 500

logger = logging.getLogger(__name__)

def get_translate_client():
    """
    Create and return a Google Translate client with proper environment detection:
    1. First check if we're in GitHub Actions
    2. Then check if we're in Cloud Run
    3. Finally fall back to local development
    """
    try:
        # First check if we're in GitHub Actions
        if os.getenv('GITHUB_ACTIONS'):
            creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            if not creds_path or not os.path.exists(creds_path):
                logger.warning("Skipping translation client initialization during GitHub Actions")
                return None
                
            credentials = service_account.Credentials.from_service_account_file(
                creds_path,
                scopes=['https://www.googleapis.com/auth/cloud-translation']
            )
            return translate.Client(credentials=credentials)
            
        # Then check if we're in Cloud Run
        elif os.getenv('K_SERVICE'):
            creds_path = '/secrets/google-creds/key.json'
            if not os.path.exists(creds_path):
                logger.warning(f"Cloud Run credentials not found at {creds_path}")
                return None

            credentials = service_account.Credentials.from_service_account_file(
                creds_path,
                scopes=['https://www.googleapis.com/auth/cloud-translation']
            )
            return translate.Client(credentials=credentials)

        # Finally, local development
        else:
            return translate.Client()
            
    except Exception as e:
        logger.warning(f"Error initializing Google Translate client: {str(e)} - translation features will be disabled")
        return None

# Initialize the client when the module is imported
translate_client = get_translate_client()

# Supported languages
SUPPORTED_LANGUAGES = {
    'en': 'English',
    'sw': 'Kiswahili'
}

# Cache translations to reduce API calls
@lru_cache(maxsize=1000)
def get_cached_translation(text, target_language):
    """Cache translation results to minimize API calls for repeated phrases."""
    # Generate a unique cache key
    cache_key = f"{text}_{target_language}"
    
    try:
        # Check if translation exists in cache
        cached_entry = (
            db.session.query(TranslationCache)
            .filter_by(key=cache_key)
            .first()
        )
        
        # Check if cache is still valid (less than 30 days old)
        if (cached_entry and 
            cached_entry.created_at > datetime.utcnow() - timedelta(days=30)):
            return {
                'translatedText': cached_entry.translated_text,
                'fromCache': True
            }
        
        # If no valid cache, perform translation
        result = translate_client.translate(
            text,
            target_language=target_language,
            source_language='en' if target_language == 'sw' else 'sw'
        )
        
        # Create new cache entry
        new_cache_entry = TranslationCache(
            key=cache_key,
            translated_text=result['translatedText'],
            source_language='en',
            target_language=target_language
        )
        
        # Add and commit to database
        db.session.add(new_cache_entry)
        db.session.commit()
        
        return {
            'translatedText': result['translatedText'],
            'fromCache': False
        }
    
    except Exception as e:
        # Fallback mechanism
        db.session.rollback()
        print(f"Translation error: {str(e)}")
        return {
            'translatedText': text,
            'fromCache': False
        }


@main.route("/main/translate", methods=["POST"])
def translate_text():
    try:
        data = request.get_json()
        
        if not data or 'text' not in data or 'targetLanguage' not in data:
            return jsonify({
                'error': 'Missing required fields: text and targetLanguage'
            }), 400

        text = data['text']
        target_language = data['targetLanguage']
        
        # Validate target language
        if target_language not in SUPPORTED_LANGUAGES:
            return jsonify({
                'error': 'Unsupported language. Only English (en) and Kiswahili (sw) are supported'
            }), 400
            
        # Skip translation if target language is English and text is in English
        if target_language == 'en':
            return jsonify({'translatedText': text})
            
        # Get cached translation
        translated_text = get_cached_translation(text, target_language)
        
        return jsonify({
            'translatedText': translated_text,
            'sourceLanguage': 'en',
            'targetLanguage': target_language
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500
