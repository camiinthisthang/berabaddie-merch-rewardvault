// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";
import "forge-std/console.sol";
import {BeraBaddieToken} from "../src/BeraBaddieToken.sol";
import {MerchNFT} from "../src/MerchNFT.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BeraBaddieAirdropTest is Test {
    BeraBaddieToken private token;
    MerchNFT private nft;
    address private approvedMinter;
    address private deployer;

    uint256 constant TOTAL_SUPPLY = 1_000_000 * 1e18; 
    uint256 constant TOKENS_PER_NFT = 10 * 1e18;

    function setUp() public {
        deployer = address(this);
        approvedMinter = address(0xA);
        
        // Deploy MerchNFT locally
        nft = new MerchNFT("BeraBaddie Merch", "BBM");
        
        // Add approvedMinter to the list of approved addresses
        nft.addApprovedAddress(approvedMinter);

        // Deploy BeraBaddieToken with the address of the locally deployed MerchNFT
        token = new BeraBaddieToken("BeraBaddie", "BBT", 18, TOTAL_SUPPLY, address(nft));
    }

    function test_token_initial_state() public {
        assertEq(token.name(), "BeraBaddie");
        assertEq(token.symbol(), "BBT");
        assertEq(token.totalSupply(), TOTAL_SUPPLY);
        assertEq(token.balanceOf(address(token)), TOTAL_SUPPLY);
    }

    function test_claim_with_single_nft() public {
        address user = address(0x1234);
        uint256 tokenId = 1;
        string memory serialNumber = "SN12345";

        // Add valid hash
        bytes32 validHash = keccak256(abi.encodePacked(serialNumber));
        vm.prank(approvedMinter);
        nft.addValidHash(validHash);

        // Mint NFT
        vm.prank(approvedMinter);
        nft.wrapperMint(user, serialNumber, "@user1", "@user1_tg");

        // Check NFT ownership
        assertEq(nft.ownerOf(tokenId), user);

        // Claim tokens
        vm.prank(user);
        token.claim(serialNumber);

        // Check token balance
        assertEq(token.balanceOf(user), TOKENS_PER_NFT);
        assertEq(token.balanceOf(address(token)), TOTAL_SUPPLY - TOKENS_PER_NFT);

        // Check claimed status
        assertTrue(token.claimedSerials(keccak256(abi.encodePacked(serialNumber))));
    }

    function test_claim_with_multiple_nfts() public {
        address user = address(0x1234);
        uint256 nftCount = 3;

        for (uint256 i = 1; i <= nftCount; i++) {
            string memory serialNumber = string(abi.encodePacked("SN", Strings.toString(i)));
            
            // Add valid hash
            bytes32 validHash = keccak256(abi.encodePacked(serialNumber));
            vm.prank(approvedMinter);
            nft.addValidHash(validHash);

            // Mint NFT
            vm.prank(approvedMinter);
            nft.wrapperMint(user, serialNumber, "@user1", "@user1_tg");

            // Claim tokens for each NFT
            vm.prank(user);
            token.claim(serialNumber);

            // Check claimed status
            assertTrue(token.claimedSerials(keccak256(abi.encodePacked(serialNumber))));
        }

        // Check token balance
        assertEq(token.balanceOf(user), TOKENS_PER_NFT * nftCount);
        assertEq(token.balanceOf(address(token)), TOTAL_SUPPLY - (TOKENS_PER_NFT * nftCount));
    }

    function test_cannot_claim_twice() public {
        address user = address(0x1234);
        string memory serialNumber = "SN12345";

        // Add valid hash
        bytes32 validHash = keccak256(abi.encodePacked(serialNumber));
        vm.prank(approvedMinter);
        nft.addValidHash(validHash);

        // Mint NFT
        vm.prank(approvedMinter);
        nft.wrapperMint(user, serialNumber, "@user1", "@user1_tg");

        // First claim
        vm.prank(user);
        token.claim(serialNumber);

        // Try to claim again
        vm.expectRevert("Serial number already claimed");
        vm.prank(user);
        token.claim(serialNumber);
    }

    function test_cannot_claim_without_nft() public {
        address user = address(0x1234);
        string memory serialNumber = "SN12345";

        // Try to claim without minting NFT
        vm.expectRevert("Invalid serial number");
        vm.prank(user);
        token.claim(serialNumber);
    }

    function test_cannot_claim_with_invalid_serial() public {
        address user = address(0x1234);
        string memory validSerialNumber = "SN12345";
        string memory invalidSerialNumber = "SN54321";

        // Add valid hash
        bytes32 validHash = keccak256(abi.encodePacked(validSerialNumber));
        vm.prank(approvedMinter);
        nft.addValidHash(validHash);

        // Mint NFT with valid serial number
        vm.prank(approvedMinter);
        nft.wrapperMint(user, validSerialNumber, "@user1", "@user1_tg");

        // Try to claim with invalid serial number
        vm.expectRevert("Invalid serial number");
        vm.prank(user);
        token.claim(invalidSerialNumber);

        // Check that valid serial number is still claimable
        vm.prank(user);
        token.claim(validSerialNumber);
        assertTrue(token.claimedSerials(keccak256(abi.encodePacked(validSerialNumber))));
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}