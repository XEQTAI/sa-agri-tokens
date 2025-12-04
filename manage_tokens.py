#!/usr/bin/env python3
"""
SA Agri Tokens - Stellar Token Management Script
Manages MAIZE, WHEAT, and SOYSA tokens on Stellar Network
"""

from stellar_sdk import Keypair, Server, TransactionBuilder, Network, Asset
import json

# Load your token accounts
with open('stellar_accounts.json', 'r') as f:
    accounts = json.load(f)

# Connect to Stellar (change to horizon.stellar.org for mainnet)
server = Server("https://horizon-testnet.stellar.org")
network_passphrase = Network.TESTNET_NETWORK_PASSPHRASE

def issue_more_tokens(token_name, amount):
    """Issue additional tokens"""
    print(f"Issuing {amount} more {token_name} tokens...")

    token_data = accounts[token_name]
    issuer = Keypair.from_secret(token_data['issuer']['secret_key'])
    distributor_public = token_data['distributor']['public_key']

    asset = Asset(token_data['token_code'], issuer.public_key)
    issuer_account = server.load_account(issuer.public_key)

    transaction = (
        TransactionBuilder(
            source_account=issuer_account,
            network_passphrase=network_passphrase,
            base_fee=100
        )
        .append_payment_op(
            destination=distributor_public,
            asset=asset,
            amount=str(amount)
        )
        .set_timeout(30)
        .build()
    )

    transaction.sign(issuer)
    response = server.submit_transaction(transaction)

    print(f"✅ Issued {amount} {token_name} tokens!")
    print(f"TX: https://stellar.expert/explorer/testnet/tx/{response['hash']}")
    return response

def check_balances(token_name):
    """Check token balances"""
    print(f"\nChecking {token_name} balances...")

    token_data = accounts[token_name]
    distributor_public = token_data['distributor']['public_key']

    account = server.accounts().account_id(distributor_public).call()

    print(f"Distributor Account: {distributor_public}")
    print(f"\nBalances:")
    for balance in account['balances']:
        if balance['asset_type'] == 'native':
            print(f"  XLM: {balance['balance']}")
        else:
            print(f"  {balance.get('asset_code', 'Unknown')}: {balance['balance']}")

def transfer_tokens(token_name, to_address, amount):
    """Transfer tokens to another address"""
    print(f"Transferring {amount} {token_name} to {to_address}...")

    token_data = accounts[token_name]
    distributor = Keypair.from_secret(token_data['distributor']['secret_key'])

    asset = Asset(token_data['token_code'], token_data['issuer']['public_key'])
    distributor_account = server.load_account(distributor.public_key)

    transaction = (
        TransactionBuilder(
            source_account=distributor_account,
            network_passphrase=network_passphrase,
            base_fee=100
        )
        .append_payment_op(
            destination=to_address,
            asset=asset,
            amount=str(amount)
        )
        .set_timeout(30)
        .build()
    )

    transaction.sign(distributor)
    response = server.submit_transaction(transaction)

    print(f"✅ Transferred {amount} {token_name}!")
    print(f"TX: https://stellar.expert/explorer/testnet/tx/{response['hash']}")
    return response

# Example usage
if __name__ == "__main__":
    print("🌾 SA Agri Tokens Management")
    print("="*50)

    # Check balances for all tokens
    for token in ['MAIZE', 'WHEAT', 'SOYSA']:
        check_balances(token)
        print()

    # Uncomment to issue more tokens:
    # issue_more_tokens('MAIZE', 5000)

    # Uncomment to transfer tokens:
    # transfer_tokens('MAIZE', 'DESTINATION_PUBLIC_KEY', 100)
