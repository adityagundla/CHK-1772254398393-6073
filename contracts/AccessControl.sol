// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControl {

    struct AccessRequest {
        uint dataId;
        address requester;
        bool approved;
        uint timestamp;
    }
    mapping(uint => address) public dataOwner;
    mapping(uint => AccessRequest[]) public accessRequests;
    mapping(uint => mapping(address => bool)) public accessPermissions;
    event DataRegistered(uint dataId, address owner);

    event AccessRequested(
        uint dataId,
        address requester
    );

    event AccessGranted(
        uint dataId,
        address requester
    );

    event AccessRevoked(
        uint dataId,
        address requester
    );

    function registerData(uint _dataId) public {
        require(dataOwner[_dataId] == address(0), "Data already registered");
        dataOwner[_dataId] = msg.sender;
        emit DataRegistered(_dataId, msg.sender);
    }

    function requestAccess(uint _dataId) public {
        require(dataOwner[_dataId] != address(0), "Data not found");

        accessRequests[_dataId].push(
            AccessRequest(
                _dataId,
                msg.sender,
                false,
                block.timestamp
            )
        );
        emit AccessRequested(_dataId, msg.sender);
    }
    function grantAccess(uint _dataId, address _requester) public {

        require(msg.sender == dataOwner[_dataId], "Only owner can grant");
        accessPermissions[_dataId][_requester] = true;
        emit AccessGranted(_dataId, _requester);
    }
    function revokeAccess(uint _dataId, address _requester) public {

        require(msg.sender == dataOwner[_dataId], "Only owner can revoke");
        accessPermissions[_dataId][_requester] = false;

        emit AccessRevoked(_dataId, _requester);
    }
    function checkAccess(uint _dataId, address _user)public  view returns(bool)
    {
        return accessPermissions[_dataId][_user];
    }
    function getRequestCount(uint _dataId) public view  returns(uint)
    {
        return accessRequests[_dataId].length;
    }
}