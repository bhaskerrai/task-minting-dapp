// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract FakeNFTMarketplace { 
    
    uint256 public nftPrice = 0.1 ether;
    mapping (uint256 => address) public tokens;

    function purchase(uint256 _tokenId) external payable{
        require(msg.value == nftPrice, "NFT costs 0.1 ether");
        tokens[_tokenId] = msg.sender;
    }

    function getNftPrice() external view returns (uint256) {
        return nftPrice;
    }

    function available(uint256 _tokenId) external view returns (bool) {
        
        if( tokens[_tokenId] == address(0)) {
            return true;
        }

        return false;
    }

}