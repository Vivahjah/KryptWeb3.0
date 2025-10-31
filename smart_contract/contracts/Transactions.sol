// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;



contract Transactions {
    uint256 public transactionCount; // will keep track of number of transactions

    event Transfer(address from, address to, uint amount, string message, uint256 timestamp, string keyword);


//  Structure is a way of saying what properties this object will have
//  and what type they will be
// Now I want to make a transaction object, what i the information I want to store in it
    struct TransferStruct { 
        address from;
        address to;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] public transactions;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint) {
        return transactionCount;
    }
}   