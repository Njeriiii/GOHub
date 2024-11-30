import base64
import requests
from datetime import datetime, timedelta
import logging

class MpesaClient:
    def __init__(self, consumer_key, consumer_secret, is_sandbox=True):
        """Initialize the M-Pesa client with credentials."""
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret
        self.access_token = None
        self.token_expiry = None
        self.base_url = "https://sandbox.safaricom.co.ke" if is_sandbox else "https://api.safaricom.co.ke"
    
    def _generate_auth_string(self):
        """Generate the base64 encoded auth string."""
        auth_string = f"{self.consumer_key}:{self.consumer_secret}"
        return base64.b64encode(auth_string.encode()).decode('utf-8')
    
    def get_access_token(self):
        """
        Get an access token from the M-Pesa API.
        Checks if current token is still valid before requesting a new one.
        """
        # Check if we have a valid token
        if self.access_token and self.token_expiry:
            if datetime.now() < self.token_expiry - timedelta(minutes=1):
                return self.access_token

        try:
            url = f"{self.base_url}/oauth/v1/generate"
            
            headers = {
                "Authorization": f"Basic {self._generate_auth_string()}"
            }
            
            params = {
                "grant_type": "client_credentials"
            }
            
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            
            result = response.json()
            
            self.access_token = result["access_token"]
            # Set token expiry time (subtracting 5 minutes for safety margin)
            self.token_expiry = datetime.now() + timedelta(seconds=int(result["expires_in"])) - timedelta(minutes=5)
            
            return self.access_token
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to get access token: {str(e)}")
    
    def generate_qr_code(self, qr_code_data):
        """
        Generate QR code using the M-Pesa API.
        Args:
            merchant_name: Name of the Company/M-Pesa Merchant
            amount: Total amount for the transaction
            trx_code: Transaction Type (PB or SM)
            cpi: Credit Party Identifier (paybill/phone number)
            ref_no: Transaction Reference
            size: QR code image size in pixels (default 300)
        Returns:
            QR code image data
        """

        try:
            # Get fresh access token if needed
            access_token = self.get_access_token()

            url = f"{self.base_url}/mpesa/qrcode/v1/generate"
        
            payload = {
                "MerchantName": qr_code_data.get('MerchantName'),
                "RefNo": qr_code_data.get('RefNo'),
                "Amount": str(qr_code_data.get('Amount')),
                "TrxCode": qr_code_data.get('TrxCode'),
                "CPI": qr_code_data.get('CPI'),
                "Size": qr_code_data.get('Size') if 'size' in qr_code_data else 300
            }
            
            headers = {
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            }
            
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            
            result = response.json()

            if 'QRCode' in result:
                return result['QRCode']
            else:
                raise Exception("QR code not found in response")
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to generate QR code: {str(e)}")
        

# Usage example:
# client = MpesaClient(
#     consumer_key="your_consumer_key",
#     consumer_secret="your_consumer_secret",
#     is_sandbox=True  # Set to False for production
# )
# 
# token = client.get_access_token()