// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;


import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Message is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    string public message;

    function initialize() public initializer {
        __Ownable_init();

        message = "First message";
    }

    function updateMessage(string memory _message) external {
        message = _message;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}


contract MessageV2 is Message {
    
    function deleteMessage() external {
        delete message;
    }
    
}

contract MessageV3 is MessageV2 {
    string public name;

    function addName(string memory _name) external {
        name = _name;
    }
}