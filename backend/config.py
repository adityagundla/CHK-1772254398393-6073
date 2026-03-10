from web3 import Web3

BLOCKCHAIN_URL = "http://127.0.0.1:7545"

DATA_OWNERSHIP_ADDRESS = "0x00F613362D53b441c6Ad8c8D1Ab5cDBB9d93e50F"
DATA_REGISTRY_ADDRESS = "0x36709d7fbe00A27C76C22c89c1D3B5F183C836C2"
ACCESS_CONTROL_ADDRESS = "0xA2bFbc3ba94Ad0338B0F9912b8886BaA325D1785"

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