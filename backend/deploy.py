import json
import time
from web3 import Web3

# Connect to Ganache
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))
account = w3.eth.accounts[0]
print(f"Deploying from account: {account}")

def deploy_contract(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
    abi = data['abi']
    bytecode = data['bytecode']
    
    contract = w3.eth.contract(abi=abi, bytecode=bytecode)
    tx_hash = contract.constructor().transact({'from': account})
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    
    print(f"Deployed {filepath.split('/')[-1]} at {tx_receipt.contractAddress}")
    return tx_receipt.contractAddress, abi

# Paths to the freshly compiled hardhat artifacts
ownership_path = r'..\artifacts\contracts\DataOwnerShip.sol\DataOwnerShip.json'
registry_path = r'..\artifacts\contracts\RegistryData.sol\DataRegistry.json'
access_path = r'..\artifacts\contracts\AccessControl.sol\AccessControl.json'

ownership_addr, ownership_abi = deploy_contract(ownership_path)
registry_addr, registry_abi = deploy_contract(registry_path)
access_addr, access_abi = deploy_contract(access_path)

# Write the new addresses into config.py automatically!
config_file = 'config.py'
with open(config_file, 'r') as f:
    config_lines = f.readlines()

new_config = []
for line in config_lines:
    if line.startswith('DATA_OWNERSHIP_ADDRESS'):
        new_config.append(f'DATA_OWNERSHIP_ADDRESS = "{ownership_addr}"\n')
    elif line.startswith('DATA_REGISTRY_ADDRESS'):
        new_config.append(f'DATA_REGISTRY_ADDRESS = "{registry_addr}"\n')
    elif line.startswith('ACCESS_CONTROL_ADDRESS'):
        new_config.append(f'ACCESS_CONTROL_ADDRESS = "{access_addr}"\n')
    else:
        new_config.append(line)

with open(config_file, 'w') as f:
    f.writelines(new_config)

print("Updated config.py successfully.")

# Also copy the compiled ABIs to `contracts/*.json`
with open(r'contracts\DataOwnerShip.json', 'w') as f:
    json.dump(ownership_abi, f, indent=4)
with open(r'contracts\DataRegistry.json', 'w') as f:
    json.dump(registry_abi, f, indent=4)
with open(r'contracts\AccessControl.json', 'w') as f:
    json.dump(access_abi, f, indent=4)

print("Updated ABI files successfully.")
