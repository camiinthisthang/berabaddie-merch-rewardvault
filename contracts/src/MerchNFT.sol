// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/solmate/src/tokens/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MerchNFT is ERC721 {
    uint256 public totalSupply;
    mapping(uint256 => string) private serialNumbers;
    mapping(bytes32 => bool) public validHashes;
    mapping(uint256 => string) private twitterHandles;
    mapping(uint256 => string) private telegramHandles;
    mapping(address => bool) public isApproved;
    mapping(bytes32 => uint256) public serialToTokenId;

    struct TokenMetadata {
        string serialNumber;
        string twitterHandle;
        string telegramHandle;
        address owner;
    }

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        isApproved[msg.sender] = true; // The deployer is automatically approved
    }

    modifier onlyApproved() {
        require(isApproved[msg.sender], "Not approved");
        _;
    }

    function addApprovedAddress(address _address) external onlyApproved {
        isApproved[_address] = true;
    }

    function removeApprovedAddress(address _address) external onlyApproved {
        require(_address != msg.sender, "Cannot remove self");
        isApproved[_address] = false;
    }

    function addValidHash(bytes32 hash) external onlyApproved {
        validHashes[hash] = true;
    }

    function wrapperMint(
        address to,
        string calldata serialNumber,
        string calldata twitterHandle,
        string calldata telegramHandle
    ) external onlyApproved {
        require(verifySerialNumber(serialNumber), "Invalid serial number");
        
        uint256 tokenId = totalSupply + 1;
        _safeMint(to, tokenId);

        serialNumbers[tokenId] = serialNumber;
        twitterHandles[tokenId] = twitterHandle;
        telegramHandles[tokenId] = telegramHandle;
        totalSupply++;
        serialToTokenId[keccak256(abi.encodePacked(serialNumber))] = tokenId;

        // Invalidate the hash after use
        validHashes[keccak256(abi.encodePacked(serialNumber))] = false;
    }

    function verifySerialNumber(string memory serialNumber) internal view returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        return validHashes[hash];
    }

    function getTokenMetadata(uint256 tokenId) external view returns (TokenMetadata memory) {
        require(_ownerOf[tokenId] != address(0), "Token does not exist");
        return TokenMetadata({
            serialNumber: serialNumbers[tokenId],
            twitterHandle: twitterHandles[tokenId],
            telegramHandle: telegramHandles[tokenId],
            owner: _ownerOf[tokenId]
        });
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        require(_ownerOf[id] != address(0), "Token does not exist");
        
        // Here you would typically return a URL to a JSON file containing the metadata
        // For this example, we're returning a placeholder URL
        return string(abi.encodePacked("https://api.example.com/token/", Strings.toString(id)));
    }
}