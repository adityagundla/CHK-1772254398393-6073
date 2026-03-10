// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataMarketplace {

    struct Listing {
        uint dataId;
        address owner;
        uint price;
        bool active;
    }
    mapping(uint => Listing) public listings;
    event DataListed( uint dataId, uint price );

    event DataPurchased(  uint dataId, address buyer );

    function listData(uint _dataId,uint _price ) public {
        listings[_dataId] = Listing(
            _dataId,
            msg.sender,
            _price,
            true
        );
        emit DataListed(
            _dataId,
            _price
        );
    }

    function buyData(uint _dataId) public payable {
        Listing storage item = listings[_dataId];
        require(item.active, "Not active");
        require(
            msg.value >= item.price,
            "Insufficient payment"
        );
        payable(item.owner).transfer(msg.value);
        emit DataPurchased(
            _dataId,
            msg.sender
        );
    }
}