#!/bin/bash

# Ensure the abi directory exists
mkdir -p abi

# Define the path to the MerchNFT contract JSON
contract_path="contracts/out/MerchNFT.sol/MerchNFT.json"

# Check if the contract JSON file exists
if [ ! -f "$contract_path" ]; then
    echo "Error: MerchNFT.json not found in $contract_path"
    exit 1
fi

# Extract the ABI and save it
jq '.abi' "$contract_path" > "abi/MerchNFT.json"

echo "Extracted ABI for MerchNFT"
echo "ABI extraction complete!"