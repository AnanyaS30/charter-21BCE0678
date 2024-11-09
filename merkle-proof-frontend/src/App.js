import React, { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { hexlify, zeroPad } from '@ethersproject/bytes';

function App() {
  const [transactionHash, setTransactionHash] = useState('');
  const [merkleProof, setMerkleProof] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Replace with your deployed contract address
  const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "merkleRoot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_merkleRoot",
          "type": "bytes32"
        }
      ],
      "name": "setMerkleRoot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32[]",
          "name": "proof",
          "type": "bytes32[]"
        },
        {
          "internalType": "bytes32",
          "name": "leaf",
          "type": "bytes32"
        }
      ],
      "name": "verifyTransactionInclusion",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // The verifyTransaction function needs to be inside the App component
  async function verifyTransaction() {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }
  
      const provider = new Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request accounts from MetaMask
      const signer = provider.getSigner();
      const contract = new Contract(contractAddress, contractABI, signer);
  
      // Debugging logs to inspect the inputs
      console.log('Transaction Hash:', transactionHash);  // Log transaction hash
      console.log('Merkle Proof:', merkleProof);          // Log raw Merkle proof input
  
      // Ensure the transaction hash is a valid 32-byte hex string
      if (!/^0x[0-9a-fA-F]{64}$/.test(transactionHash)) {
        setVerificationResult('Invalid transaction hash. It must be a 32-byte (64 character) hex string.');
        return;
      }
  
      // Convert transaction hash to bytes32 format
      const leaf = hexlify(zeroPad(transactionHash, 32));
  
      console.log('Formatted transaction hash (leaf):', leaf);  // Log formatted leaf
  
      // Convert Merkle proof to an array of bytes32 values
      const proofArray = merkleProof.split(',').map(p => p.trim());
  
      // Log the proofArray to ensure it's correct
      proofArray.forEach((proofElement, index) => {
        console.log( `Proof element ${index}: ${proofElement} (length: ${proofElement.length}) `);  // Log each proof element
      });
  
      const formattedProofArray = proofArray.map(p => {
        if (!/^0x[0-9a-fA-F]{64}$/.test(p)) {
          setVerificationResult('Invalid Merkle proof element. Each element must be a 32-byte (64 character) hex string.');
          throw new Error( `Invalid proof element: ${p} `);
        }
  
        const formattedProof = hexlify(zeroPad(p, 32));
        console.log('Formatted proof element:', formattedProof);  // Log formatted proof element
        return formattedProof;
      });
  
      // Call the smart contract to verify the transaction inclusion
      const isValid = await contract.verifyTransactionInclusion(formattedProofArray, leaf);
  
      setVerificationResult(isValid ? 'Valid Merkle Proof' : 'Invalid Merkle Proof');
    } catch (error) {
      console.error("Full error object:", error);
      setVerificationResult( `Error occurred during verification: ${error.message} `);
    }
  }
  return (
    <div className="App">
      <h1>Merkle Proof Verification</h1>

      <div>
        <label>Transaction Hash:</label>
        <input
          type="text"
          value={transactionHash}
          onChange={(e) => setTransactionHash(e.target.value)}
          placeholder="Enter transaction hash"
        />
      </div>

      <div>
        <label> Proof (comma-separated, hex):</label>
        <input
          type="text"
          value={merkleProof}
          onChange={(e) => setMerkleProof(e.target.value)}
          placeholder="Enter Merkle proof"
        />
      </div>

      <button onClick={verifyTransaction}>Verify</button>

      {verificationResult !== null && <p>{verificationResult}</p>}
    </div>
  );
}

export default App;