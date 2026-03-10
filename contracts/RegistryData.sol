// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DataRegistry {

    struct DataRecord {
        uint dataId;
        address owner;
        string ipfsHash;
        string description;
        uint createdAt;
    }
    uint public dataCount;
    mapping(uint => DataRecord) public dataRecords;

    event DataRegistered(
        uint indexed dataId,
        address indexed owner,
        string ipfsHash
    );
    event DataUpdated(
        uint indexed dataId,
        string newHash
    );
    modifier onlyOwner(uint _dataId) {
        require(
            dataRecords[_dataId].owner == msg.sender,
            "Not the data owner"
        ); _;
    }
    function registerData(  string memory _ipfsHash,string memory _description  ) public {
        dataCount++;
        dataRecords[dataCount] = DataRecord(
            dataCount,
            msg.sender,
            _ipfsHash,
            _description,
            block.timestamp
        );

        emit DataRegistered(
            dataCount,
            msg.sender,
            _ipfsHash
        );
    }

    function updateDataHash( uint _dataId,  string memory _newHash   )  public onlyOwner(_dataId)
    {

        dataRecords[_dataId].ipfsHash = _newHash;

        emit DataUpdated(
            _dataId,
            _newHash
        );
    }

    function getData(uint _dataId)   public  view returns(  address,string memory,string memory, uint)
    {
        DataRecord memory record = dataRecords[_dataId];
        return (
            record.owner,
            record.ipfsHash,
            record.description,
            record.createdAt
        );
    }

    function getOwner(uint _dataId)  public view returns(address)
    {
        return dataRecords[_dataId].owner;
    }
}