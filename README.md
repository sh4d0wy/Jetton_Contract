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
    - [Hosting on IPFS](#hosting-on-ipfs)
  - [Deployment Guide](#deployment-guide)
    - [Prerequisites](#prerequisites)
    - [Step 1: Prepare Token Metadata](#step-1-prepare-token-metadata)
    - [Step 2: Deploy JettonMinter](#step-2-deploy-jettonminter)
    - [Step 3: Mint Initial Supply](#step-3-mint-initial-supply)
  - [Contract Administration](#contract-administration)
    - [Changing Ownership](#changing-ownership)
    - [Updating Metadata](#updating-metadata)
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
"image_data": "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"
}
```

Key fields:
- `name`: Full name of your token
- `symbol`: Short ticker symbol (usually 3-5 characters)
- `description`: Detailed description of your token
- `decimals`: Number of decimal places (typically 9 for TON ecosystem)
- `image`: Base64 encoded image of token that can be converted using online image to base64 encoders

### Hosting on IPFS

For decentralization, we recommend hosting your metadata on IPFS:

1. **Create your metadata JSON file** with the format above
2. **Upload to IPFS** using one of these methods:
   - [Pinata](https://pinata.cloud/) - User-friendly IPFS pinning service
   - [NFT.Storage](https://nft.storage/) - Free storage for NFTs and tokens
   - [Infura IPFS](https://infura.io/product/ipfs) - Enterprise IPFS solution

3. **Get the IPFS CID** (Content Identifier) - This looks like: `bafkreic7rpannnli7lfoumh47zhsnrbtoqmdf66sz6alhmj74at4ml7lmy`

4. **Gateway URL** (for testing) - You can view your metadata at:
   `https://ipfs.io/ipfs/bafkreic7rpannnli7lfoumh47zhsnrbtoqmdf66sz6alhmj74at4ml7lmy`

For production tokens, consider using a dedicated IPFS gateway or pinning service to ensure reliability.

## Deployment Guide

### Prerequisites

- Node.js 14+ installed
- TON development environment set up
- TON wallet with sufficient funds for deployment
- Blueprint framework installed: `npm install -g @ton/blueprint`

### Step 1: Prepare Token Metadata

1. Create a JSON file with your token metadata (see [Metadata Format](#metadata-format))

2. Upload to IPFS using Pinata or similar service:
   - Create an account on [Pinata](https://pinata.cloud/)
   - Upload your JSON file
   - Copy the CID (Content Identifier)

3. Update the `config.ts` file with your IPFS URI:
   ```typescript
   // Example: Using a gateway URL for better accessibility
   export const JETTON_CONTENT_URI = "https://olive-fashionable-mule-815.mypinata.cloud/ipfs/bafkreic7rpannnli7lfoumh47zhsnrbtoqmdf66sz6alhmj74at4ml7lmy";
   ```

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

### Step 3: Mint Initial Supply

1. Mint tokens to your address:
   ```bash
   npx blueprint run mintToken
   ```

   The default script mints 1000 tokens to your address. To customize:
   - Edit `scripts/mintToken.ts` to change the amount
   - Or create a new script with parameters

2. Verify your balance:
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

If you need to update your token's metadata:

1. Create and upload the new metadata JSON to IPFS
2. Get the new URI
3. Run:
   ```bash
   npx blueprint run changeJettonContent <new_uri>
   ```

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

