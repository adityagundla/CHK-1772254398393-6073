from web3 import Web3
import json
from config import *

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

# Load AccessControl ABI
with open("contracts/AccessControl.json") as f:
    access_control_abi = json.load(f)

access_contract = w3.eth.contract(
    address=w3.to_checksum_address(ACCESS_CONTROL_ADDRESS),
    abi=access_control_abi
)

def register_existing(data_id):
    try:
        # Check if already registered in AccessControl
        owner = access_contract.functions.dataOwner(data_id).call()
        if owner != "0x0000000000000000000000000000000000000000":
            print(f"Data ID {data_id} already registered to {owner}")
            return

        nonce = w3.eth.get_transaction_count(ACCOUNT_ADDRESS)
        tx = access_contract.functions.registerData(data_id).build_transaction({
            "from": ACCOUNT_ADDRESS,
            "nonce": nonce,
            "gas": 3000000,
            "gasPrice": w3.to_wei("20", "gwei")
        })
        
        tx_hash = w3.eth.send_transaction(tx)
        w3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"Successfully registered data ID {data_id} in AccessControl")
    except Exception as e:
        print(f"Failed to register data ID {data_id}: {e}")

# Register records 1 to 10 just in case
for i in range(1, 11):
    register_existing(i)
