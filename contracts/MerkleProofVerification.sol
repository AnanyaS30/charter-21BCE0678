// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleProofVerification is Ownable {
    // Variable to store the Merkle root
    bytes32 public merkleRoot;

    // Constructor that passes msg.sender to the Ownable constructor
    constructor() Ownable(msg.sender) {
        // Initialization logic if needed
    }

    // Function to set the Merkle root (only the owner can call this function)
    function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
        merkleRoot = _merkleRoot;
    }

    // Function to verify whether a transaction hash is in the Merkle tree
    function verifyTransactionInclusion(
        bytes32[] memory proof,  // Merkle proof provided by the user
        bytes32 leaf             // Transaction hash to verify (leaf node)
    ) public view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }
}