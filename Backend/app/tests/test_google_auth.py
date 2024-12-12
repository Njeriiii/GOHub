# test_google_auth.py
from dotenv import load_dotenv
import os
from google.cloud import translate_v2 as translate

def test_google_auth():
    # Load environment variables
    load_dotenv()
    
    # Print environment variables to verify
    print("Environment Variables:")
    print(f"GOOGLE_APPLICATION_CREDENTIALS: {os.getenv('GOOGLE_APPLICATION_CREDENTIALS')}")
    print(f"GOOGLE_CLOUD_PROJECT: {os.getenv('GOOGLE_CLOUD_PROJECT')}")
    
    # Verify file exists
    creds_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    if os.path.exists(creds_path):
        print(f"\nCredentials file exists at: {creds_path}")
    else:
        print(f"\nWARNING: Credentials file not found at: {creds_path}")
    
    try:
        # Try to initialize the client and perform a test translation
        client = translate.Client()
        result = client.translate('Hello', target_language='sw')
        print(f"\nTranslation test successful!")
        print(f"Hello → {result['translatedText']}")
        
    except Exception as e:
        print(f"\nError during translation test: {str(e)}")

if __name__ == "__main__":
    test_google_auth()