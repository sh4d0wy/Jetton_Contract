# Jetton Minter Scripts

This directory contains scripts for interacting with the Jetton Minter contract.

## Getter Scripts

### Get Jetton Data

Retrieves general information about the Jetton, including total supply, whether it's mintable, admin address, and content.

```bash
npx blueprint run getJettonData
```

### Get Wallet Address

Retrieves the Jetton wallet address for the current sender.

```bash
npx blueprint run getWalletAddress
```

### Get Wallet Address for Specific Owner

Retrieves the Jetton wallet address for a specific owner address.

```bash
npx blueprint run getWalletAddressForOwner <owner_address>
```

Example:
```bash
npx blueprint run getWalletAddressForOwner EQBDcfsZW5DGz7mlJO9hOetx-5X6-uWiCVj20NrpnWpc01x9
```

## Other Scripts

- `deployJettonMinter.ts`: Deploys a new Jetton Minter contract
- `deployJettonWallet.ts`: Deploys a new Jetton Wallet
- `mintToken.ts`: Mints new tokens
- `changeOwner.ts`: Changes the owner of the Jetton Minter
- `changeJettonContent.ts`: Updates the Jetton content metadata 