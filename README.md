# Jetton Smart Contract

This project implements the Jetton standard on TON blockchain, providing a fungible token implementation with a minter contract and wallet contracts.

## Contracts

The project consists of two main contracts:

### JettonMinter

The JettonMinter contract is responsible for:
- Minting new tokens
- Tracking the total supply
- Managing ownership and administrative functions
- Providing wallet addresses for token holders
- Changing content of Token 

#### Key Functions:

- `mint`: Creates new tokens and sends them to a specified address
- `get_jetton_data`: Returns information about the token (supply, admin, content, etc.)
- `get_wallet_address`: Returns the wallet address for a given owner
- `close_minting`: Disables further minting of tokens
- `change_owner`: Transfers ownership of the minter
- `update_content`: Updates the token metadata

### JettonWallet

The JettonWallet contract is deployed for each token holder and is responsible for:
- Storing the token balance for a specific owner
- Processing transfers between wallets
- Burning tokens
- Providing wallet data

#### Key Functions:

- `transfer`: Transfers tokens to another address
- `burn`: Burns tokens, reducing the total supply
- `get_wallet_data`: Returns information about the wallet (balance, owner, minter)

## Scripts

This project includes several scripts to interact with the Jetton contracts:

### Setup and Deployment

- `deployJettonMinter.ts`: Deploys a new Jetton Minter contract
- `deployJettonWallet.ts`: Deploys a new Jetton Wallet

### Admin Token Operations

- `mintToken.ts`: Mints new tokens
- `changeOwner.ts`: Changes the owner of the Jetton Minter
- `changeJettonContent.ts`: Updates the Jetton content metadata

### Minter Getters

- `getJettonData.ts`: Gets information about the Jetton (supply, admin, content)
- `getWalletAddress.ts`: Gets the wallet address for the current user
- `getWalletAddressForOwner.ts`: Gets the wallet address for a specific owner

### Wallet Getters

- `getJettonWalletData.ts`: Gets data from a specific Jetton wallet
- `getMyWalletData.ts`: Gets data from the current user's wallet
- `getOwnerWalletBalance.ts`: Gets the balance of a wallet for a specific owner

### User Token Operations

- `transferJetton.ts`: Transfers tokens from the user's wallet to another address

## How to Run

### Prerequisites

- Node.js 14+ installed
- TON development environment set up

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file with your configuration:
   ```
   MNEMONIC="your wallet mnemonic phrase here"
   ```

2. Update the `config.ts` file with your deployed contract addresses.

### Running Scripts

Use the blueprint CLI to run the scripts:

```bash
npx blueprint run <script-name> [arguments]
```

#### Examples:

1. Deploy a new Jetton Minter:
   ```bash
   npx blueprint run deployJettonMinter
   ```

2. Get Jetton data:
   ```bash
   npx blueprint run getJettonData
   ```

3. Get your wallet address:
   ```bash
   npx blueprint run getWalletAddress
   ```

4. Get wallet address for a specific owner:
   ```bash
   npx blueprint run getWalletAddressForOwner <owner_address>
   ```

5. Get data from a specific wallet:
   ```bash
   npx blueprint run getJettonWalletData <wallet_address>
   ```

6. Get data from your wallet:
   ```bash
   npx blueprint run getMyWalletData
   ```

7. Get balance for a specific owner:
   ```bash
   npx blueprint run getOwnerWalletBalance <owner_address>
   ```

8. Transfer tokens:
   ```bash
   npx blueprint run transferJetton <destination_address> <amount> [forward_ton_amount]
   ```

## Troubleshooting

### Insufficient Balance

Make sure your wallet has enough TON to cover gas fees for operations.

