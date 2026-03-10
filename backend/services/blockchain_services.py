from web3 import Web3
import json
from config import *

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

# Load DataRegistry ABI
with open("contracts/DataRegistry.json") as f:
    registry_abi = json.load(f)

contract = w3.eth.contract(
    address=w3.to_checksum_address(DATA_REGISTRY_ADDRESS),
    abi=registry_abi
)

# Load AccessControl ABI
with open("contracts/AccessControl.json") as f:
    access_control_abi = json.load(f)

access_contract = w3.eth.contract(
    address=w3.to_checksum_address(ACCESS_CONTROL_ADDRESS),
    abi=access_control_abi
)

def send_transaction(tx):
    # If we have a private key configured, sign the transaction locally.
    # Otherwise, rely on the local node (e.g. Ganache) to sign using an unlocked account.
    if PRIVATE_KEY:
        signed_tx = w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    else:
        tx_hash = w3.eth.send_transaction(tx)

    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return tx_hash.hex()


def register_data(name, description, data_hash=None):

    # The contract ABI expects 3 string arguments for registerData.
    # We pass a hash string (or repeat name) to satisfy the ABI.
    if data_hash is None:
        data_hash = name

    nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)

    tx = contract.functions.registerData(
        name,
        description,
        data_hash
    ).build_transaction({
        "from": ACCOUNT_ADDRESS,
        "nonce": nonce,
        "gas": 3000000,
        "gasPrice": w3.to_wei("20", "gwei")
    })

    return send_transaction(tx)
def request_access(data_id):

    nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)

    tx = access_contract.functions.requestAccess(
        data_id
    ).build_transaction({
        "from": ACCOUNT_ADDRESS,
        "nonce": nonce,
        "gas": 3000000,
        "gasPrice": w3.to_wei("20", "gwei")
    })

    return send_transaction(tx)    

def get_request_count(data_id):

    count = access_contract.functions.getRequestCount(
        data_id
    ).call()

    return count    

def get_data(data_id):

    data = contract.functions.getData(data_id).call()

    return {
        "id": data_id,
        "owner": data[0],
        "name": data[1],
        "description": data[2]
    }

def get_all_data():
    count = contract.functions.dataCount().call()
    all_data = []
    for i in range(1, count + 1):
        try:
            data = contract.functions.getData(i).call()
            all_data.append({
                "id": i,
                "owner": data[0],
                "name": data[1],
                "description": data[2]
            })
        except Exception:
            continue
    return all_data

def grant_access(data_id, user):

    user = w3.to_checksum_address(user)

    nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)

    tx = access_contract.functions.grantAccess(
        data_id,
        user
    ).build_transaction({
        "from": ACCOUNT_ADDRESS,
        "nonce": nonce,
        "gas": 3000000,
        "gasPrice": w3.to_wei("20", "gwei")
    })

    return send_transaction(tx)

def revoke_access(data_id, user):
    user = w3.to_checksum_address(user)
    nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)

    tx = access_contract.functions.revokeAccess(
        data_id,
        user
    ).build_transaction({
        "from": ACCOUNT_ADDRESS,
        "nonce": nonce,
        "gas": 3000000,
        "gasPrice": w3.to_wei("20", "gwei")
    })

    return send_transaction(tx)


    


def check_access(data_id, user):
    user = w3.to_checksum_address(user)
    return access_contract.functions.checkAccess(
        data_id,
        user
    ).call()