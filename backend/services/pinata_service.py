import requests
import os
from dotenv import load_dotenv

load_dotenv()

PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")

PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS"

def upload_to_pinata(file):

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY
    }

    files = {
        "file": file
    }

    response = requests.post(
        PINATA_URL,
        files=files,
        headers=headers
    )

    return response.json()