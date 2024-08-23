# BeraBaddie Contracts

This repository contains the smart contracts for the BeraBaddie project, including a custom ERC20 token (BeraBaddieToken), an NFT for merchandise (MerchNFT), and an airdrop mechanism.

## Contracts

### BeraBaddieToken (BBT)

BeraBaddieToken is an ERC20-compatible token with additional authorization features. It allows for minting new tokens and setting authorized addresses that can perform certain privileged actions.

Deployed at: [0x1a8D9CE295485310130A4ec41029eDe6a00Fdc8A](https://bartio.beratrail.io/token/0x1a8D9CE295485310130A4ec41029eDe6a00Fdc8A)
Rewards Vault at: [0x30218362267600895Dcf6ccCDb7191dE7c01085F](https://bartio.beratrail.io/address/0x30218362267600895Dcf6ccCDb7191dE7c01085F)

### MerchNFT (BBM)

MerchNFT is an ERC721-compatible token representing merchandise. It includes features such as:
- Serial number verifications
- Buyer authorization
- Linking merchandise to external URIs

Deployed at: [0xfE8CA5C708Daf7e6A321a0573841b61070fAC052](https://bartio.beratrail.io/address/0xfE8CA5C708Daf7e6A321a0573841b61070fAC052)

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