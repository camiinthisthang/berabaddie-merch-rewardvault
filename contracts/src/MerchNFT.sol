// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MerchNFT is ERC721 {
    uint256 public totalSupply;
    mapping(uint256 => string) private serialNumbers;
    mapping(bytes32 => bool) public validHashes;
    mapping(uint256 => string) private merchLinks;
    mapping(address => bool) public isBuyer;
    address public owner;

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyBuyer() {
        require(isBuyer[msg.sender], "Not a buyer");
        _;
    }

    function addBuyer(address _buyer) external onlyOwner {
        isBuyer[_buyer] = true;
    }

    function addValidHash(bytes32 hash) external onlyOwner {
        validHashes[hash] = true;
    }

    function wrapperMint(address to, bytes calldata serialNumberData, string calldata merchLink) external onlyBuyer {
        string memory serialNumber = abi.decode(serialNumberData, (string));

        require(verifySerialNumber(serialNumber), "Invalid serial number");
        
        uint256 tokenId = totalSupply + 1;
        _safeMint(to, tokenId);

        serialNumbers[tokenId] = serialNumber;
        merchLinks[tokenId] = merchLink;
        totalSupply++;

        // Invalidate the hash after use
        validHashes[keccak256(abi.encodePacked(serialNumber))] = false;
    }

    function verifySerialNumber(string memory serialNumber) internal view returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        return validHashes[hash];
    }

    function getSerialNumber(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf[tokenId] != address(0), "Token does not exist");
        return serialNumbers[tokenId];
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_ownerOf[id] != address(0), "Token does not exist");
        return merchLinks[id];
    }
}