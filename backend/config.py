from web3 import Web3

BLOCKCHAIN_URL = "http://127.0.0.1:7545"

DATA_OWNERSHIP_ADDRESS = "0x373d8bb17B59d23C71583ce214D7b7BDf1ED51e6"
DATA_REGISTRY_ADDRESS = "0x3D6Ab05E5c4B4584cbd5443d2eaebA4b9E57F0F2"
ACCESS_CONTROL_ADDRESS = "0x21890E260F580725582b734CD9e56873c3f41fD3"

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