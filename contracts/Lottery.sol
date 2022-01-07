// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable {
        // validate the payable
        require(msg.value >= 1 ether);
        
        players.push(payable(msg.sender));
    }
    
    function pickWinner() public restricted {
        // Choose the winner
        uint index = random() % players.length;
        
        uint prize = (address(this).balance / 100) * 98;
        uint fee = address(this).balance - prize;
        
        // Send the prize to winner
        players[index].transfer(prize);
        
        // Send fee to manager
        payable(manager).transfer(fee);
        
        // Reset players
        players = new address payable[](0);
    }
    
    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(
            block.difficulty,
            block.timestamp,
            players
        )));
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}