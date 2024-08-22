// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../lib/solmate/src/tokens/ERC20.sol";
import "./MerchNFT.sol";

contract BeraBaddieToken is ERC20 {
    MerchNFT public immutable merchNFT;
    mapping(bytes32 => bool) public claimedSerials;
    uint256 public constant TOKENS_PER_NFT = 10 * 1e18;

    mapping(address => bool) public owners;
    address public immutable deployer;

    event Claimed(address indexed claimer, string serialNumber, uint256 amount);
    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);

    modifier onlyOwner() {
        require(owners[msg.sender], "Not authorized");
        _;
    }

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply, address _merchNFTAddress) 
        ERC20(_name, _symbol, _decimals) 
    {
        merchNFT = MerchNFT(_merchNFTAddress);
        _mint(address(this), _totalSupply);
        deployer = msg.sender;
        owners[msg.sender] = true;
    }

    function addOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owners[newOwner] = true;
        emit OwnerAdded(newOwner);
    }

    function removeOwner(address ownerToRemove) external {
        require(msg.sender == deployer, "Only deployer can remove owners");
        require(ownerToRemove != deployer, "Cannot remove deployer");
        owners[ownerToRemove] = false;
        emit OwnerRemoved(ownerToRemove);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }

    function claim(string calldata serialNumber) external {
        bytes32 serialHash = keccak256(abi.encodePacked(serialNumber));
        require(!claimedSerials[serialHash], "Serial number already claimed");

        uint256 tokenId = merchNFT.serialToTokenId(serialHash);
        require(tokenId != 0, "Invalid serial number");
        require(merchNFT.ownerOf(tokenId) == msg.sender, "Must own MerchNFT with this serial number to claim");

        uint256 claimAmount = TOKENS_PER_NFT;
        require(balanceOf[address(this)] >= claimAmount, "Insufficient balance in contract");

        claimedSerials[serialHash] = true;

        _transfer(address(this), msg.sender, claimAmount);

        emit Claimed(msg.sender, serialNumber, claimAmount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = balanceOf[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            balanceOf[from] = fromBalance - amount;
            balanceOf[to] += amount;
        }

        emit Transfer(from, to, amount);
    }
}