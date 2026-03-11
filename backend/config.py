from web3 import Web3

BLOCKCHAIN_URL = "http://127.0.0.1:7545"

DATA_OWNERSHIP_ADDRESS = "0x6DbCd3ec69622B725d3607fca4c46c278a57c9D2"
DATA_REGISTRY_ADDRESS = "0xCe33E4aF80c2aEdaeDd87EE20c21aDf97fE7c13C"
ACCESS_CONTROL_ADDRESS = "0x485Dd1dd59Ac8b0Af0633E45D1006328DAea95d9"

# Use a local Ganache account (unlocked + funded) by default.
PRIVATE_KEY = None
ACCOUNT_ADDRESS = None

w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_URL))

try:
    account = w3.eth.accounts[0]
except Exception as e:
    print(f"Warning: Could not connect to blockchain node at {BLOCKCHAIN_URL}. Is Ganache running?")
    account = "0x0000000000000000000000000000000000000000"

if ACCOUNT_ADDRESS is None:
    ACCOUNT_ADDRESS = account