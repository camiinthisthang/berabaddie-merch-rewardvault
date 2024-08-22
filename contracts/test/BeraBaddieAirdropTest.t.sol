// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test, console2} from "forge-std/Test.sol";
import {MerkleHelper} from "../src/airdrop/MerkleHelper.sol";
import {Airdrop} from "../src/airdrop/Airdrop.sol";
import {BeraBaddieToken} from "../src/BeraBaddieToken.sol";
import {MerchNFT} from "../src/MerchNFT.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BeraBaddieAirdropTest is Test {
    BeraBaddieToken private token;
    MerchNFT private nft;
    Airdrop private airdrop;
    address private approvedMinter;

    struct Reward {
        address to;
        uint256 amount;
    }

    Reward[] private rewards;
    bytes32[] private hashes;
    mapping(bytes32 => Reward) private hashToReward;

    uint256 constant N = 100;
    uint256 constant AIRDROP_AMOUNT = 100 * 1e18; // 100 tokens per NFT

    function setUp() public {
        token = new BeraBaddieToken("BeraBaddie", "BBT", 18);
        nft = new MerchNFT("BeraBaddie Merch", "BBM");
        approvedMinter = address(0xA);
        
        // Add approvedMinter to the list of approved addresses
        nft.addApprovedAddress(approvedMinter);

        // Initialize users and airdrop amounts
        for (uint256 i = 0; i < N; i++) {
            address user = address(uint160(i + 1));
            rewards.push(Reward({to: user, amount: AIRDROP_AMOUNT}));
            bytes32 leaf = keccak256(abi.encode(user, AIRDROP_AMOUNT));
            hashes.push(leaf);
            hashToReward[leaf] = rewards[i];
        }

        bytes32 root = MerkleHelper.calcRoot(hashes);
        airdrop = new Airdrop(address(token), root);
        token.setAuthorized(address(airdrop), true);
    }

    function test_nft_mint_and_airdrop() public {
        address user = address(uint160(1)); // Use the first user from the rewards array
        uint256 tokenId = 1;
        string memory serialNumber = "SN12345";
        string memory twitterHandle = "@user1";
        string memory telegramHandle = "@user1_tg";

        // Add a valid hash
        bytes32 validHash = keccak256(abi.encodePacked(serialNumber));
        vm.prank(approvedMinter);
        nft.addValidHash(validHash);

        // Mint NFT
        vm.prank(approvedMinter);
        nft.wrapperMint(user, serialNumber, twitterHandle, telegramHandle);

        // Check NFT ownership
        assertEq(nft.ownerOf(tokenId), user);

        // Generate proof for the user
        bytes32 leaf = keccak256(abi.encode(user, AIRDROP_AMOUNT));
        bytes32[] memory proof = MerkleHelper.getProof(hashes, 0);

        // Claim airdrop
        vm.prank(user);
        airdrop.claim(proof, user, AIRDROP_AMOUNT);

        // Check token balance
        assertEq(token.balanceOf(user), AIRDROP_AMOUNT);
    }

    function test_multiple_nft_mints_and_airdrops() public {
        for (uint256 i = 0; i < 5; i++) {
            address user = address(uint160(i + 1));
            uint256 tokenId = i + 1;
            string memory serialNumber = string(abi.encodePacked("SN", Strings.toString(tokenId)));
            string memory twitterHandle = string(abi.encodePacked("@user", Strings.toString(i + 1)));
            string memory telegramHandle = string(abi.encodePacked("@user", Strings.toString(i + 1), "_tg"));

            // Add a valid hash
            bytes32 validHash = keccak256(abi.encodePacked(serialNumber));
            vm.prank(approvedMinter);
            nft.addValidHash(validHash);

            // Mint NFT
            vm.prank(approvedMinter);
            nft.wrapperMint(user, serialNumber, twitterHandle, telegramHandle);

            // Check NFT ownership
            assertEq(nft.ownerOf(tokenId), user);

            // Generate proof for the user
            bytes32 leaf = keccak256(abi.encode(user, AIRDROP_AMOUNT));
            bytes32[] memory proof = MerkleHelper.getProof(hashes, i);

            // Claim airdrop
            vm.prank(user);
            airdrop.claim(proof, user, AIRDROP_AMOUNT);

            // Check token balance
            assertEq(token.balanceOf(user), AIRDROP_AMOUNT);
        }
    }

    function test_cannot_claim_twice() public {
        address user = address(uint160(1)); // Use the first user from the rewards array
        uint256 tokenId = 1;
        string memory serialNumber = "SN12345";
        string memory twitterHandle = "@user1";
        string memory telegramHandle = "@user1_tg";

        // Add a valid hash
        bytes32 validHash = keccak256(abi.encodePacked(serialNumber));
        vm.prank(approvedMinter);
        nft.addValidHash(validHash);

        // Mint NFT
        vm.prank(approvedMinter);
        nft.wrapperMint(user, serialNumber, twitterHandle, telegramHandle);

        // Generate proof for the user
        bytes32 leaf = keccak256(abi.encode(user, AIRDROP_AMOUNT));
        bytes32[] memory proof = MerkleHelper.getProof(hashes, 0);

        // Claim airdrop
        vm.prank(user);
        airdrop.claim(proof, user, AIRDROP_AMOUNT);

        // Try to claim again
        vm.expectRevert("airdrop already claimed");
        vm.prank(user);
        airdrop.claim(proof, user, AIRDROP_AMOUNT);
    }

    function test_cannot_claim_without_nft() public {
        address user = address(0x1234);

        // Generate proof for the user
        bytes32[] memory proof = MerkleHelper.getProof(hashes, 0);

        // Try to claim without minting NFT
        vm.expectRevert("invalid merkle proof");
        vm.prank(user);
        airdrop.claim(proof, user, AIRDROP_AMOUNT);
    }

    function onERC721Received(address, address, uint256, bytes memory) public virtual returns (bytes4) {
        return this.onERC721Received.selector;
    }
}