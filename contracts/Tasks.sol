pragma solidity ^0.5.0;

contract Chore {

address[16] public kids;

// Assigning a chore
function task(uint choreId) public returns (uint) {
    require(choreId >= 0 && choreId <= 15);

    kids[choreId] = msg.sender;

  return choreId;
}

    // Retrieving the adopters
    function getKids() public view returns (address[16] memory) {
    return kids;
    }

}
