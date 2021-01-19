pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Tasks.sol";

contract TestTasks {
 // The address of the task contract to be tested
 Chore chore = Chore(DeployedAddresses.Chore());

 // The id of the chore that will be used for testing
 uint expectedChoreId = 8;

 //The expected owner of adopted pet is this contract
 address expectedKid = address(this);

// Testing the adopt() function
function testUserCanAcceptChore() public {
  uint returnedId = chore.task(expectedChoreId);

  Assert.equal(returnedId, expectedChoreId, "Acceptance of the expected chore should match what is returned.");
}
// Testing retrieval of a single chore's owner
function testGetKidAddressByChoreId() public {
  address kid = chore.kids(expectedChoreId);

  Assert.equal(kid, expectedKid, "Owner of the expected pet should be this contract");
}
// Testing retrieval of all pet owners
function testGetKidAddressByChoreIdInArray() public {
  // Store kids in memory rather than contract's storage
  address[16] memory kids = chore.getKids();

  Assert.equal(kids[expectedChoreId], expectedKid, "Owner of the expected pet should be this contract");
}
}
