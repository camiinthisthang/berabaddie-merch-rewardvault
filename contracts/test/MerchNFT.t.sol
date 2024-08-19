// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/MerchNFT.sol";

contract MerchNFTTest is Test {
    MerchNFT public merchNFT;
    address public owner;
    address public buyer;
    address public user;

    function setUp() public {
        owner = address(this);
        buyer = address(0x1);
        user = address(0x2);
        merchNFT = new MerchNFT("MerchNFT", "MNFT");
    }

    function testInitialState() public {
        assertEq(merchNFT.name(), "MerchNFT");
        assertEq(merchNFT.symbol(), "MNFT");
        assertEq(merchNFT.owner(), owner);
        assertEq(merchNFT.totalSupply(), 0);
    }

    function testAddValidHash() public {
        bytes32 hash = keccak256(abi.encodePacked("TEST123"));
        merchNFT.addValidHash(hash);
        assertTrue(merchNFT.validHashes(hash));
    }

    function testAddValidHashOnlyOwner() public {
        bytes32 hash = keccak256(abi.encodePacked("TEST123"));
        vm.prank(user);
        vm.expectRevert("Not the owner");
        merchNFT.addValidHash(hash);
    }

    function testAddBuyer() public {
        merchNFT.addBuyer(buyer);
        assertTrue(merchNFT.isBuyer(buyer));
    }

    function testAddBuyerOnlyOwner() public {
        vm.prank(user);
        vm.expectRevert("Not the owner");
        merchNFT.addBuyer(buyer);
    }

    function testWrapperMint() public {
        merchNFT.addBuyer(buyer);

        string memory serialNumber = "TEST123";
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        merchNFT.addValidHash(hash);

        vm.prank(buyer);
        merchNFT.wrapperMint(user, abi.encode(serialNumber), "https://example.com/merch/1");

        assertEq(merchNFT.totalSupply(), 1);
        assertEq(merchNFT.ownerOf(1), user);
        assertEq(merchNFT.tokenURI(1), "https://example.com/merch/1");
        assertEq(merchNFT.getSerialNumber(1), serialNumber);
        assertFalse(merchNFT.validHashes(hash)); // Hash should be invalidated after use
    }

    function testWrapperMintInvalidSerialNumber() public {
        merchNFT.addBuyer(buyer);

        string memory serialNumber = "INVALID";
        vm.prank(buyer);
        vm.expectRevert("Invalid serial number");
        merchNFT.wrapperMint(user, abi.encode(serialNumber), "https://example.com/merch/1");
    }

    function testWrapperMintOnlyBuyer() public {
        string memory serialNumber = "TEST123";
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        merchNFT.addValidHash(hash);

        vm.prank(user);
        vm.expectRevert("Not a buyer");
        merchNFT.wrapperMint(user, abi.encode(serialNumber), "https://example.com/merch/1");
    }

    function testGetSerialNumber() public {
        merchNFT.addBuyer(buyer);

        string memory serialNumber = "TEST123";
        bytes32 hash = keccak256(abi.encodePacked(serialNumber));
        merchNFT.addValidHash(hash);

        vm.prank(buyer);
        merchNFT.wrapperMint(user, abi.encode(serialNumber), "https://example.com/merch/1");

        assertEq(merchNFT.getSerialNumber(1), serialNumber);
    }

    function testGetSerialNumberNonexistentToken() public {
        vm.expectRevert("Token does not exist");
        merchNFT.getSerialNumber(1);
    }

    function testTokenURINonexistentToken() public {
        vm.expectRevert("Token does not exist");
        merchNFT.tokenURI(1);
    }
}