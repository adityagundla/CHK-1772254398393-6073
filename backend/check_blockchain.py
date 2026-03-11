from web3 import Web3
import json
from config import *

w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:7545"))

with open("contracts/DataRegistry.json") as f:
    registry_abi = json.load(f)

with open("contracts/AccessControl.json") as f:
    access_control_abi = json.load(f)

contract = w3.eth.contract(
    address=w3.to_checksum_address(DATA_REGISTRY_ADDRESS),
    abi=registry_abi
)

access_contract = w3.eth.contract(
    address=w3.to_checksum_address(ACCESS_CONTROL_ADDRESS),
    abi=access_control_abi
)

print(f"Registry Address: {DATA_REGISTRY_ADDRESS}")
print(f"AccessControl Address: {ACCESS_CONTROL_ADDRESS}")

try:
    count = contract.functions.dataCount().call()
    print(f"Blockchain dataCount: {count}")
    
    for i in range(1, count + 1):
        data = contract.functions.dataRecords(i).call()
        print(f"Record {i}: {data}")
except Exception as e:
    print(f"Error calling contract: {e}")
