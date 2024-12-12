from flask import Blueprint, jsonify, request
from google.cloud import translate_v2 as translate
import os
from app import db
from functools import lru_cache
from datetime import datetime, timedelta

from app.models import (
    User,
    SkillsNeeded,
    org_skills_connection,
    OrgProfile,
    TranslationCache
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
            "user_id": org.user_id,
            "org_name": org.org_name,
            "org_overview": org.org_overview,
            "focus_areas": [focus_area.serialize() for focus_area in org.focus_areas],
            "skills_needed": [skill.serialize() for skill in org.skills_needed],
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
            
            org_matches.append(
                {
                    "org_id": org.id,
                    "org_name": org.org_name,
                    "user_id": org.user_id,
                    "focus_areas": [focus_area.serialize() for focus_area in org.focus_areas],
                    # "matching_skills": matching_skills,
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
    

def get_translate_client():
    """
    Create and return a Google Translate client using environment variables.
    Provides more robust error handling and configuration.
    """
    try:
        # Use environment variables
        credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

        # Validate credentials
        if not credentials_path:
            raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set")
        
        if not os.path.exists(credentials_path):
            raise FileNotFoundError(f"Credentials file not found at: {credentials_path}")

        # Set the environment variable for Google Cloud authentication
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = credentials_path

        # Initialize the translate client
        return translate.Client()

    except Exception as e:
        print(f"Error initializing Google Translate client: {e}")
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

@main.route("/main/translate-batch", methods=["POST"])
def translate_batch():
    """Endpoint for translating multiple texts at once"""
    try:
        data = request.get_json()
        
        if not data or 'texts' not in data or 'targetLanguage' not in data:
            return jsonify({
                'error': 'Missing required fields: texts and targetLanguage'
            }), 400

        texts = data['texts']
        target_language = data['targetLanguage']
        
        # Validate target language
        if target_language not in SUPPORTED_LANGUAGES:
            return jsonify({
                'error': 'Unsupported language. Only English (en) and Kiswahili (sw) are supported'
            }), 400
        
        # Skip translation if target language is English
        if target_language == 'en':
            return jsonify({'translatedTexts': texts})
        
        translated_texts = []
        for text in texts:
            if isinstance(text, str):
                translated_text = get_cached_translation(text, target_language)
                translated_texts.append(translated_text)
            else:
                translated_texts.append(text)

        return jsonify({
            'translatedTexts': translated_texts,
            'sourceLanguage': 'en',
            'targetLanguage': target_language
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'error': f'Server error: {str(e)}'
        }), 500

@main.route("/api/supported-languages", methods=["GET"])
def get_supported_languages():
    """Get list of supported languages (English and Kiswahili only)"""
    return jsonify({
        'languages': [
            {'code': code, 'name': name}
            for code, name in SUPPORTED_LANGUAGES.items()
        ]
    })
