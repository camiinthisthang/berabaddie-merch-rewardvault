// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/BeraBaddieToken.sol";

contract DeployBeraBaddieToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        BeraBaddieToken token = new BeraBaddieToken("BeraBaddie", "BBT", 18);

        vm.stopBroadcast();

        console.log("BeraBaddieToken deployed at:", address(token));
    }
}