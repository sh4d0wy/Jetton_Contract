# Jetton Scripts

This directory contains scripts for interacting with the Jetton Minter and Jetton Wallet contracts.

## Minter Scripts

### Deployment and Administration

- **deployJettonMinter.ts**: Deploys a new Jetton Minter contract
  ```bash
  npx blueprint run deployJettonMinter
  ```

### Admin specific Functions

- **changeOwner.ts**: Changes the owner of the Jetton Minter
  ```bash
  npx blueprint run changeOwner <new_owner_address>
  ```

- **changeJettonContent.ts**: Updates a single field in the Jetton metadata onchain.
  ```bash
  npx blueprint run changeJettonContent <key> <value>
  ```
  - `<key>`: The metadata field to update (`name`, `description`, `symbol`, `decimals`, `image`)
  - `<value>`: The new value for the field

  Example:
  ```bash
  npx blueprint run changeJettonContent symbol "NEW"
  npx blueprint run changeJettonContent decimals "6"
  ```

  This script will update only the specified field in the onchain metadata, leaving all other fields unchanged.

- **mintToken.ts**: Mints new tokens to a specified address.
  ```bash
  npx blueprint run mintToken <recipient_address> <amount>
  ```
  - `<recipient_address>`: The address to receive the minted tokens.
  - `<amount>`: The number of tokens to mint (in basic units).

  Example:
  ```bash
  npx blueprint run mintToken EQBDcfsZW5DGz7mlJO9hOetx-5X6-uWiCVj20NrpnWpc01x9 1000000000
  ```

  Only the contract owner can mint new tokens. The script will deploy a JettonWallet for the recipient if needed.

### Minter Getter Functions

- **getJettonData.ts**: Gets information about the Jetton
  ```bash
  npx blueprint run getJettonData
  ```
  Returns:
  - Total supply
  - Whether minting is enabled
  - Admin address
  - Jetton content (metadata)
  - Jetton wallet code

- **getWalletAddress.ts**: Gets the wallet address for the current user
  ```bash
  npx blueprint run getWalletAddress
  ```

- **getWalletAddressForOwner.ts**: Gets the wallet address for a specific owner
  ```bash
  npx blueprint run getWalletAddressForOwner <owner_address>
  ```
  Example:
  ```bash
  npx blueprint run getWalletAddressForOwner EQBDcfsZW5DGz7mlJO9hOetx-5X6-uWiCVj20NrpnWpc01x9
  ```

## Wallet Scripts

### Wallet Getter Functions

- **getJettonWalletData.ts**: Gets data from a specific Jetton wallet
  ```bash
  npx blueprint run getJettonWalletData <wallet_address>
  ```
  Returns:
  - Balance
  - Owner address
  - Minter address
  - Wallet code
  
  Example:
  ```bash
  npx blueprint run getJettonWalletData EQCdqSTxUDe_Vu1MpgX6XS3ak5sAiXAgJhPZJW5ADW4ZpHiP
  ```

- **getMyWalletData.ts**: Gets data from the current user's wallet
  ```bash
  npx blueprint run getMyWalletData
  ```

- **getOwnerWalletBalance.ts**: Gets the balance of a wallet for a specific owner
  ```bash
  npx blueprint run getOwnerWalletBalance <owner_address>
  ```
  Example:
  ```bash
  npx blueprint run getOwnerWalletBalance EQBDcfsZW5DGz7mlJO9hOetx-5X6-uWiCVj20NrpnWpc01x9
  ```

### User Specific Functions

- **transferJetton.ts**: Transfers tokens from your wallet to another address
  ```bash
  npx blueprint run transferJetton <destination_address> <amount> [forward_ton_amount]
  ```
  Parameters:
  - `destination_address`: The address to send tokens to
  - `amount`: The amount of tokens to send
  - `forward_ton_amount` (optional): The amount of TON to forward with the transfer (default: 0.01)
  
  Example:
  ```bash
  npx blueprint run transferJetton EQBDcfsZW5DGz7mlJO9hOetx-5X6-uWiCVj20NrpnWpc01x9 1000 0.05
  ```

## Troubleshooting

### Error: Insufficient gas

Make sure your wallet has enough TON to cover gas fees for operations. The scripts use the following approximate fees:
- Transfer: 0.05 TON + forward amount
- Mint: 0.05 TON + forward amount
- Deploy: 0.05 TON

### Error: Sender address is not defined

This error occurs when the blueprint cannot find your wallet. Make sure you have set up your `.env` file correctly with your mnemonic. 