// SPDX-LICENSE-Identifier:GPL-2.0-or-later
pragma solidity >=0.7.0 <0.9.0;
pragma abicoder v2;

contract UserStorageData{
    struct TransactionStruct{
        address caller;
        address poolAddress;
        address tokenAddress0;
        address tokenAddress1;
        uint256 tokenId;
    }

    TransactionStruct[] transactions;

    function addToBlockchain(address poolAddress,address tokenAddress0,address tokenAddress1,uint256 tokenId) public
    {
        transactions.push(TransactionStruct(msg.sender,poolAddress,tokenAddress0,tokenAddress1,tokenId));
    }

    function removeTransaction(uint256 _tokenId) public {
        uint256 length = transactions.length;
        for (uint256 i = 0; i < length; i++) {
            if (transactions[i].tokenId == _tokenId) {
                transactions[i] = transactions[length - 1];
                transactions.pop();
                break; 
            }
        }
    }    

    function getAllTransactions()public view returns(TransactionStruct[] memory){
        return transactions;
    }
}

