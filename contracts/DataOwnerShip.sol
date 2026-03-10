//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataOwnerShip {
    struct Data {
       address owner;
       string ipfshash;

    }
    mapping (uint => Data) public  dataRecords;
    uint public dataCount;

    function  registerData(string memory _hash) public {
        dataCount++;
        dataRecords[dataCount] = Data(msg.sender, _hash);
        
    }
    function getData(uint _id)  public  view returns (address, string memory) {
        Data memory data = dataRecords[_id];
        return (data.owner, data.ipfshash);
        
    }
}