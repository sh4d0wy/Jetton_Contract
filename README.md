# Jetton Smart Contract

This project implements the Jetton standard on TON blockchain, providing a fungible token implementation similar to ERC-20 tokens on Ethereum. The implementation consists of a minter contract and wallet contracts that work together to create a complete token ecosystem.

## Table of Contents

- [Jetton Smart Contract](#jetton-smart-contract)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Contract Architecture](#contract-architecture)
    - [JettonMinter Contract](#jettonminter-contract)
    - [JettonWallet Contract](#jettonwallet-contract)
    - [How Contracts Interact](#how-contracts-interact)
  - [Token Metadata](#token-metadata)
    - [Metadata Format](#metadata-format)
  - [Deployment Guide](#deployment-guide)
    - [Prerequisites](#prerequisites)
    - [Step 1: Prepare Token Metadata](#step-1-prepare-token-metadata)
    - [Step 2: Deploy JettonMinter](#step-2-deploy-jettonminter)
    - [Step 3: Verify Initial Supply](#step-3-verify-initial-supply)
  - [Contract Administration](#contract-administration)
    - [Changing Ownership](#changing-ownership)
    - [Updating Metadata](#updating-metadata)
    - [Minting Tokens](#minting-tokens)
    - [Closing Minting](#closing-minting)
  - [User Operations](#user-operations)
    - [Checking Balances](#checking-balances)
    - [Transferring Tokens](#transferring-tokens)
  - [Technical Reference](#technical-reference)
    - [Scripts Reference](#scripts-reference)
      - [Setup and Deployment](#setup-and-deployment)
      - [Admin Operations](#admin-operations)
      - [Minter Getters](#minter-getters)
      - [Wallet Getters](#wallet-getters)
      - [User Operations](#user-operations-1)
    - [Contract Functions](#contract-functions)
      - [JettonMinter Functions](#jettonminter-functions)
      - [JettonWallet Functions](#jettonwallet-functions)
  - [Troubleshooting](#troubleshooting)
    - [Insufficient Balance](#insufficient-balance)
    - [Transaction Failed](#transaction-failed)
    - [Wallet Not Found](#wallet-not-found)
    - [Need Help?](#need-help)

## Overview

The Jetton standard on TON blockchain allows for the creation of fungible tokens. This implementation provides:

- A minter contract that controls the total supply and minting of new tokens
- Individual wallet contracts for each token holder
- Metadata storage for token information
- Standard operations like transfers, burns, and balance checks

## Contract Architecture

### JettonMinter Contract

The JettonMinter is the central contract that:

- Controls the total supply of tokens
- Stores the token metadata
- Manages administrative functions
- Creates and tracks wallet contracts for token holders

Think of the JettonMinter as the "central bank" of your token ecosystem. It's the only entity that can create new tokens and maintains the master record of the total supply.

### JettonWallet Contract

For each address that holds tokens, a separate JettonWallet contract is deployed. This wallet:

- Stores the token balance for a specific owner
- Handles transfers to other wallets
- Processes burn requests
- Provides balance information

Each JettonWallet is linked to the minter and can only receive new tokens from the minter or other valid wallets.

### How Contracts Interact

The contracts work together in the following ways:

1. **Token Creation Flow**:
   - The JettonMinter creates new tokens via the `mint` function
   - The minter deploys a JettonWallet for the recipient if one doesn't exist
   - Tokens are transferred to the recipient's wallet

2. **Transfer Flow**:
   - When a user wants to transfer tokens, they send a message to their JettonWallet
   - The sender's wallet reduces their balance
   - The sender's wallet sends a message to the recipient's wallet
   - The recipient's wallet increases their balance

3. **Burn Flow**:
   - A user sends a burn request to their wallet
   - The wallet reduces the balance and notifies the minter
   - The minter reduces the total supply

This architecture ensures that:
- The total supply is always accurate
- Each user's tokens are stored in a separate contract for security
- Only authorized operations can modify balances

## Token Metadata

### Metadata Format

Jetton metadata follows a standard format stored as a JSON object:

```json
{
"name": "TestTokenDigiTon",
"description": "This is a test token on the TON network",
"symbol": "TTDTN",
"decimals": 9,
"image": "https://olive-fashionable-mule-815.mypinata.cloud/ipfs/bafkreidb4qrsfsbb6esz4fmvgz4tu4vvb7krsqhpedgxcz2xglw2xaqbnu"
}
```

Key fields:
- `name`: Full name of your token
- `symbol`: Short ticker symbol (usually 3-5 characters)
- `description`: Detailed description of your token
- `decimals`: Number of decimal places (typically 9 for TON ecosystem)
- `image`: The image url where the token logo is hosted (eg- github pages, ipfs, google drive etc.)

## Deployment Guide

### Prerequisites

- Node.js 14+ installed
- TON development environment set up
- TON wallet with sufficient funds for deployment
- Blueprint framework installed: `npm install -g @ton/blueprint`

### Step 1: Prepare Token Metadata

1. Go to srcipts/deployJettonMinter.ts to find the default metadata.
2. Update the fields according to your preferences
3. The fields must follow the structure of [Metadata](#metadata-format)
   
### Step 2: Deploy JettonMinter

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/sh4d0wy/Jetton_Contract
   cd jetton
   npm install
   ```

2. Build the contracts:
   ```bash
   npx blueprint build
   ```

3. Deploy the JettonMinter contract:
   ```bash
   npx blueprint run deployJettonMinter
   ```

   This script:
   - Creates a new JettonMinter contract
   - Sets you as the owner/admin
   - Configures the initial metadata from your config
   - Sets the mintable flag to true (allowing new tokens to be created)

4. After deployment, you'll see the minter address in the console. Update your `config.ts`:
   ```typescript
   export const JETTON_MINTER_ADDRESS = Address.parse("EQBDcfsZW5DGz7mlJO9hOetx-5X6-uWiCVj20NrpnWpc01x9");
   ```

### Step 3: Verify Initial Supply

1. Verify your balance:
   ```bash
   npx blueprint run getMyWalletData
   ```

Congratulations! You've deployed your Jetton token and minted the initial supply.

## Contract Administration

### Changing Ownership

To transfer ownership of the minter contract:

```bash
npx blueprint run changeOwner <new_owner_address>
```

This transfers administrative rights to the new address. Only the current owner can perform this action.

### Updating Metadata

The Jetton token's metadata is stored fully onchain as a dictionary cell. You can update any field of the metadata (such as `name`, `description`, `symbol`, `decimals`, or `image`) using the `changeJettonContent.ts` script.

**How it works:**
- The script loads the current metadata (with default values).
- You specify the key and value you want to update as arguments.
- The script updates the specified key in the metadata object and rebuilds the metadata cell.
- The new cell is sent to the JettonMinter contract as an update.

**Usage:**
```bash
npx blueprint run changeJettonContent <key> <value>
```
- `<key>`: The metadata field you want to update (must be one of: `name`, `description`, `symbol`, `decimals`, `image`)
- `<value>`: The new value for the field

**Example:**
```bash
npx blueprint run changeJettonContent name "My New Jetton Name"
npx blueprint run changeJettonContent image "https://example.com/new-image.png"
```

**Notes:**
- Only the contract owner can update the metadata.
- The update is performed onchain and is visible to all users.
- The script does not require you to provide the full metadata object—just the field you want to change.

### Minting Tokens

The JettonMinter contract allows the owner to mint new tokens and send them to any address.  
Minting is performed on deployment (see `deployJettonMinter.ts`) and can also be done later using the `mintToken.ts` script.

**How it works:**
- Only the contract owner can mint new tokens.
- The owner specifies the recipient address and the amount to mint.
- The contract creates (mints) the specified number of tokens and sends them to the recipient's JettonWallet (deploying it if needed).

**Usage:**
```bash
npx blueprint run mintToken <recipient_address> <amount>
```
- `<recipient_address>`: The address to receive the minted tokens.
- `<amount>`: The number of tokens to mint (in basic units, e.g., 1000000000 for 1 token if decimals is 9).

**Example:**
```bash
npx blueprint run mintToken EQBDcfsZW5DGz7mlJO9hOetx-5X6-uWiCVj20NrpnWpc01x9 1000000000
```

**Notes:**
- The script will automatically deploy a JettonWallet for the recipient if they do not already have one.
- Only the owner can call this function; other users will receive an error.

### Closing Minting

To prevent any new tokens from being minted (making the supply fixed):

```bash
npx blueprint run closeMinting
```

⚠️ **Warning**: This action is irreversible. Once minting is closed, no new tokens can ever be created.

## User Operations

### Checking Balances

Users can check their token balance in several ways:

1. **Check your own balance**:
   ```bash
   npx blueprint run getMyWalletData
   ```

2. **Check balance by owner address**:
   ```bash
   npx blueprint run getOwnerWalletBalance <owner_address>
   ```

3. **Check balance by wallet address**:
   ```bash
   npx blueprint run getJettonWalletData <wallet_address>
   ```

### Transferring Tokens

To transfer tokens to another address:

```bash
npx blueprint run transferJetton <destination_address> <amount> [forward_ton_amount]
```

Parameters:
- `destination_address`: The recipient's address
- `amount`: Number of tokens to send (in basic units)
- `forward_ton_amount` (optional): Amount of TON to attach to the transfer (default: 0.01)

Example to send 10 tokens with 0.05 TON:
```bash
npx blueprint run transferJetton EQBDcfsZW5DGz7mlJO9hOetx-5X6-uWiCVj20NrpnWpc01x9 10000000000 0.05
```

Note: If the recipient doesn't have a wallet yet, one will be automatically deployed.

## Technical Reference

### Scripts Reference

#### Setup and Deployment
- `deployJettonMinter.ts`: Deploys a new Jetton Minter contract
- `deployJettonWallet.ts`: Deploys a new Jetton Wallet

#### Admin Operations
- `mintToken.ts`: Mints new tokens
- `changeOwner.ts`: Changes the owner of the Jetton Minter
- `changeJettonContent.ts`: Updates the Jetton content metadata
- `closeMinting.ts`: Closes minting permanently

#### Minter Getters
- `getJettonData.ts`: Gets information about the Jetton
- `getWalletAddress.ts`: Gets the wallet address for the current user
- `getWalletAddressForOwner.ts`: Gets the wallet address for a specific owner

#### Wallet Getters
- `getJettonWalletData.ts`: Gets data from a specific Jetton wallet
- `getMyWalletData.ts`: Gets data from the current user's wallet
- `getOwnerWalletBalance.ts`: Gets the balance of a wallet for a specific owner

#### User Operations
- `transferJetton.ts`: Transfers tokens from the user's wallet to another address

### Contract Functions

#### JettonMinter Functions

```typescript
// Mint new tokens
receive(msg: Mint)

// Get wallet address for owner
receive(msg: ProvideWalletAddress)

// Process burn notifications
receive(msg: JettonBurnNotification)

// Update token content/metadata
receive(msg: JettonUpdateContent)

// Change owner
receive(msg: ChangeOwner)

// Close minting
receive(msg: CloseMinting)

// Claim TON
receive(msg: ClaimTON)

// Getter: Get token data
get fun get_jetton_data(): JettonMinterState

// Getter: Get wallet address
get fun get_wallet_address(ownerAddress: Address): Address
```

#### JettonWallet Functions

```typescript
// Transfer tokens
receive(msg: JettonTransfer)

// Receive tokens
receive(msg: JettonTransferInternal)

// Get wallet balance
receive(msg: ProvideWalletBalance)

// Burn tokens
receive(msg: JettonBurn)

// Claim TON
receive(msg: ClaimTON)

// Getter: Get wallet data
get fun get_wallet_data(): JettonWalletData
```

## Troubleshooting

### Insufficient Balance

If you see "Insufficient balance" errors:

1. Make sure your wallet has enough TON to cover gas fees
2. For transfers, you need:
   - Base fee (approximately 0.05 TON)
   - Forward amount (default 0.01 TON)
   - Extra for wallet deployment if recipient doesn't have a wallet yet

### Transaction Failed

If your transaction fails:

1. Check the error message in the console
2. Verify you have the correct permissions (admin functions require owner)
3. For transfers, verify you have sufficient token balance

### Wallet Not Found

If you get "Wallet not found" or similar errors:

1. The wallet may not be deployed yet - try sending a small amount of tokens first
2. Verify the address is correct
3. Check if the address has interacted with the token before

### Need Help?

For more assistance:
1. Check the scripts directory for detailed examples
2. Examine the contract code in the contracts directory

