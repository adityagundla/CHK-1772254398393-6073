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

    if data_hash is None:
        data_hash = name

    nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)

    tx = contract.functions.registerData(
        data_hash,
        name
    ).build_transaction({
        "from": ACCOUNT_ADDRESS,
        "nonce": nonce,
        "gas": 3000000,
        "gasPrice": w3.to_wei("20", "gwei")
    })

    tx_hash = send_transaction(tx)
    
    # After registering in DataRegistry, we MUST also register in AccessControl
    # so that the AccessControl contract knows the data exists and who the owner is.
    try:
        receipt = w3.eth.get_transaction_receipt(tx_hash)
        # The event is DataRegistered(uint indexed dataId, address indexed owner, string ipfsHash)
        logs = contract.events.DataRegistered().process_receipt(receipt)
        if logs:
            data_id = logs[0]['args']['dataId']
            
            nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
            atx = access_contract.functions.registerData(data_id).build_transaction({
                "from": ACCOUNT_ADDRESS,
                "nonce": nonce,
                "gas": 3000000,
                "gasPrice": w3.to_wei("20", "gwei")
            })
            send_transaction(atx)
            print(f"Registered dataId {data_id} in AccessControl")
            return tx_hash, data_id
    except Exception as e:
        print(f"Warning: Failed to register in AccessControl: {e}")

    return tx_hash, None
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

    data = contract.functions.dataRecords(data_id).call()

    return {
        "id": data[0],
        "owner": data[1],
        "ipfsHash": data[2],      # this holds the Pinata Hash (dataHash)
        "name": data[3],          # this holds the File Name (description)
        "description": data[3],   # fallback map to name
        "createdAt": data[4]
    }

def get_all_data():
    count = contract.functions.dataCount().call()
    all_data = []
    for i in range(1, count + 1):
        try:
            data = contract.functions.dataRecords(i).call()
            all_data.append({
                "id": data[0],
                "owner": data[1],
                "ipfsHash": data[2],
                "name": data[3],
                "description": data[3],
                "createdAt": data[4]
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