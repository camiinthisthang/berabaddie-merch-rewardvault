# BeraBaddie Contracts

This repository contains the smart contracts for the BeraBaddie project, including a custom ERC20 token (BeraBaddieToken), an NFT for merchandise (MerchNFT), and an airdrop mechanism.

## Contracts

### BeraBaddieToken (BBT)

BeraBaddieToken is an ERC20-compatible token with additional authorization features. It allows for minting new tokens and setting authorized addresses that can perform certain privileged actions.

Deployed at: [0x823E4867A834496E86f9330F21740E516fCA6653](https://bartio.beratrail.io/token/0x823E4867A834496E86f9330F21740E516fCA6653)
Rewards Vault at: [0x74978c6cDeA3ebC9D67D408e6cEd7e994771b993](https://bartio.beratrail.io/address/0x74978c6cDeA3ebC9D67D408e6cEd7e994771b993)

### MerchNFT (BBM)

MerchNFT is an ERC721-compatible token representing merchandise. It includes features such as:
- Serial number verifications
- Buyer authorization
- Linking merchandise to external URIs

Deployed at: [0x02BCeCEaA086a896079ad39dfb50CE1f7fA57231](https://bartio.beratrail.io/address/0x02BCeCEaA086a896079ad39dfb50CE1f7fA57231)

### Airdrop

The Airdrop contract implements a Merkle tree-based airdrop mechanism for distributing BeraBaddieTokens to eligible participants. This allows for efficient and gas-optimized token distribution.

## Functionality

1. **Token Minting**: BeraBaddieTokens can be minted by authorized addresses.
2. **NFT Minting**: Authorized buyers can mint MerchNFTs with unique serial numbers.
3. **Airdrop**: Users can claim BeraBaddieTokens through the airdrop mechanism if they are included in the Merkle tree.

## Airdrop Process

1. A Merkle tree is constructed off-chain with the list of eligible addresses and their corresponding token amounts.
2. The root of the Merkle tree is set in the Airdrop contract during deployment.
3. Users can claim their tokens by providing a Merkle proof along with their address and token amount.
4. The contract verifies the proof and, if valid, mints the specified amount of tokens to the user.

## Testing

The repository includes comprehensive tests for all contracts, covering various scenarios such as:
- NFT minting and serial number verification
- Token transfers and authorizations
- Airdrop claims and duplicate claim prevention

To run the tests:

```shell
$ forge test
```