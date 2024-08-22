// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/MerchNFT.sol";

contract MerchNFTTest is Test {
    MerchNFT public merchNFT;
    address public deployer;
    address public approvedAddress;
    address public user;

    function setUp() public {
        deployer = address(this);
        approvedAddress = address(0x1);
        user = address(0x2);
        merchNFT = new MerchNFT("MerchNFT", "MNFT");
    }

    function testInitialState() public {
        assertEq(merchNFT.name(), "MerchNFT");
        assertEq(merchNFT.symbol(), "MNFT");
        assertTrue(merchNFT.isApproved(deployer));
        assertEq(merchNFT.totalSupply(), 0);
    }

    function testAddValidHash() public {
        bytes32 hash = keccak256(abi.encodePacked("TEST123"));
        merchNFT.addValidHash(hash);
        assertTrue(merchNFT.validHashes(hash));
    }

    function testAddValidHashOnlyApproved() public {
        bytes32 hash = keccak256(abi.encodePacked("TEST123"));
        vm.prank(user);
        vm.expectRevert("Not approved");
        merchNFT.addValidHash(hash);
    }

    function testAddApprovedAddress() public {
        merchNFT.addApprovedAddress(approvedAddress);
        assertTrue(merchNFT.isApproved(approvedAddress));
    }

    function testAddApprovedAddressOnlyApproved() public {
        vm.prank(user);
        vm.expectRevert("Not approved");
        merchNFT.addApprovedAddress(approvedAddress);
    }

    function testRemoveApprovedAddress() public {
        merchNFT.addApprovedAddress(approvedAddress);
        merchNFT.removeApprovedAddress(approvedAddress);
        assertFalse(merchNFT.isApproved(approvedAddress));
    }

    function testRemoveApprovedAddressCannotRemoveSelf() public {
        vm.expectRevert("Cannot remove self");
        merchNFT.removeApprovedAddress(deployer);
    }

    function testWrapperMint() public {
        string memory serialNumber = "TEST123";
        string memory twitterHandle = "@user";
        string memory telegramHandle = "@user_tg";
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        merchNFT.addValidHash(hash);

        merchNFT.wrapperMint(user, serialNumber, twitterHandle, telegramHandle);

        assertEq(merchNFT.totalSupply(), 1);
        assertEq(merchNFT.ownerOf(1), user);
        assertFalse(merchNFT.validHashes(hash)); // Hash should be invalidated after use

        MerchNFT.TokenMetadata memory metadata = merchNFT.getTokenMetadata(1);
        assertEq(metadata.serialNumber, serialNumber);
        assertEq(metadata.twitterHandle, twitterHandle);
        assertEq(metadata.telegramHandle, telegramHandle);
        assertEq(metadata.owner, user);
    }

    function testWrapperMintInvalidSerialNumber() public {
        string memory serialNumber = "INVALID";
        string memory twitterHandle = "@user";
        string memory telegramHandle = "@user_tg";
        vm.expectRevert("Invalid serial number");
        merchNFT.wrapperMint(user, serialNumber, twitterHandle, telegramHandle);
    }

    function testWrapperMintOnlyApproved() public {
        string memory serialNumber = "TEST123";
        string memory twitterHandle = "@user";
        string memory telegramHandle = "@user_tg";
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        merchNFT.addValidHash(hash);

        vm.prank(user);
        vm.expectRevert("Not approved");
        merchNFT.wrapperMint(user, serialNumber, twitterHandle, telegramHandle);
    }

    function testGetTokenMetadata() public {
        string memory serialNumber = "TEST123";
        string memory twitterHandle = "@user";
        string memory telegramHandle = "@user_tg";
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        merchNFT.addValidHash(hash);

        merchNFT.wrapperMint(user, serialNumber, twitterHandle, telegramHandle);

        MerchNFT.TokenMetadata memory metadata = merchNFT.getTokenMetadata(1);
        assertEq(metadata.serialNumber, serialNumber);
        assertEq(metadata.twitterHandle, twitterHandle);
        assertEq(metadata.telegramHandle, telegramHandle);
        assertEq(metadata.owner, user);
    }

    function testGetTokenMetadataNonexistentToken() public {
        vm.expectRevert("Token does not exist");
        merchNFT.getTokenMetadata(1);
    }

    function testTokenURI() public {
        string memory serialNumber = "TEST123";
        string memory twitterHandle = "@user";
        string memory telegramHandle = "@user_tg";
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        merchNFT.addValidHash(hash);

        merchNFT.wrapperMint(user, serialNumber, twitterHandle, telegramHandle);

        string memory expectedURI = "https://api.example.com/token/1";
        assertEq(merchNFT.tokenURI(1), expectedURI);
    }

    function testTokenURINonexistentToken() public {
        vm.expectRevert("Token does not exist");
        merchNFT.tokenURI(1);
    }
}