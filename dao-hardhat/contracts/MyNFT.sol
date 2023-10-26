// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol"; 


contract MyToken is ERC721, Ownable {
    uint256 public mintPrice;
    uint256 public totalSupply;
    uint256 public maxSupply;
    uint256 public maxPerWallet;
    mapping ( address => uint256) public walletMints;

    constructor() ERC721("MyNFT", "MNFT") {
        mintPrice = 0.2 ether;
        totalSupply = 0;
        maxSupply = 1000;
        maxPerWallet = 3;
    }

    function mint(uint256 quantity) public payable  {
        require(msg.value == quantity * mintPrice, "Didn't send enough ETH!");
        require(totalSupply + quantity <= maxSupply, "Sold out!");
        require(walletMints[msg.sender] + quantity <= maxPerWallet, "Exceed limit to mint!");

        walletMints[msg.sender] += quantity;

        for (uint256 i = 0; i < quantity; i++) {
            uint256 _tokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(msg.sender, _tokenId);

        }

    }

    function generateArtwork() public view returns (bytes memory) {
        return abi.encodePacked(
            bytes32(block.number) 
        );
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token doesn't exist");
        bytes memory artworkData = generateArtwork();
        string memory json = Base64.encode(
            bytes(string(abi.encodePacked('{"image": "data:image/svg+xml;utf8,', artworkData, '"}')))
        );
        return string(abi.encodePacked('data:application/json;base64,', json));
    }

    function withdrawEther() public onlyOwner{
        (bool success,) = msg.sender.call{value: address(this).balance}("");
        require(success, "Withdraw Failed");
    }

    function setMintPrice(uint256 _price) public onlyOwner {
        mintPrice = _price * 1 ether;
    }
}
