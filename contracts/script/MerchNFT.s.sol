// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/MerchNFT.sol";

contract DeployMerchNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        MerchNFT nft = new MerchNFT("BeraBaddie Merch", "BBM");

        vm.stopBroadcast();

        console.log("MerchNFT deployed at:", address(nft));
    }
}