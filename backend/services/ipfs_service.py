import requests

PINATA_API_KEY = "ae051121c2e9325d0ee0"
PINATA_SECRET = "9fc77290993a9948786ba5c8074e32f45d337d419c93d2f2ea23742a14167a99"

def upload_to_ipfs(file_path):

    url = "https://api.pinata.cloud/pinning/pinFileToIPFS"

    files = {"file": open(file_path, "rb")}

    headers = {
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET
    }

    response = requests.post(url, files=files, headers=headers)

    ipfs_hash = response.json()["IpfsHash"]

    return ipfs_hash