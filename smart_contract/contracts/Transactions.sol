// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;




contract Transactions {
    uint256 transactionCount; // this will keep count of all the transactions


    // this event will be emitted whenever a transaction is created
    event Transfer(
        address from,
        address receiver,
        uint256 amount,
        string message,
        uint256 timestamp,
        string keyword
    );


    // A struct is like an object that shows how the transaction will look like
    // the data types and the information that each transaction will have
    struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }


//transactions is an array of TransferStruct meaning it will hold multiple transactions
//and each transaction will follow the structure defined in TransferStruct
    TransferStruct[] transactions;

    function addToBlockchain(
        address payable receiver, // payable means that this address can receive Ether
        uint256 amount,
        string memory message, // memory keyword are used for string types in Solidity
        string memory keyword
    ) public {
        transactionCount += 1; // when a new transaction is added, increment the count
        transactions.push(
            TransferStruct(
                msg.sender,
                receiver,
                amount,
                message,
                block.timestamp,
                keyword
            )
        );

        emit Transfer(
            msg.sender, // msg.sender is a global variable that represents the address of the caller
            receiver,
            amount,
            message,
            block.timestamp,// timestamp is a global variable that gives the current block timestamp
            keyword
        );
    }
    function getAllTransactions()
        public
        view
        returns (TransferStruct[] memory) 
    {
        return transactions;
    }
    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
