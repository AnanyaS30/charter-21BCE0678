const { ethers } = require('ethers');
const { MerkleTree } = require('merkletreejs');
const sha256 = require('crypto-js/sha256');

// Step 1: Set up the provider (Infura or Alchemy)
// Replace 'your-infura-project-id' with your actual Infura project ID
const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/1_hQmbQzkDj_5iuVszTRIaq8cmDE5aws');

// Step 2: Fetch Transactions from Block 7038037
async function fetchTransactions(blockNumber) {
    try {
        const block = await provider.getBlockWithTransactions(blockNumber);

        if (!block || !block.transactions) {
            console.log("No transactions found.");
            return [];
        }

        // Extract the transaction hashes
        return block.transactions.map(tx => tx.hash);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

// Step 3: Generate the Merkle Tree, Root, and Proof
async function generateMerkleTreeForBlock(blockNumber) {
    try {
        // Fetch the transaction hashes from the block
        const txHashes = await fetchTransactions(blockNumber);

        if (txHashes.length === 0) {
            console.log("No transactions found in the block.");
            return;
        }

        // Step 4: Hash each transaction hash using sha256
        const leaves = txHashes.map(txHash => sha256(txHash).toString());

        // Step 5: Create the Merkle Tree using the hashed transaction hashes
        const merkleTree = new MerkleTree(leaves, sha256);

        // Step 6: Get the Merkle Root
        const merkleRoot = merkleTree.getRoot().toString('hex');
        console.log("Merkle Root:", merkleRoot);

        // Step 7: Generate a Merkle proof for the first transaction (as an example)
        const leaf = sha256(txHashes[0]).toString();  // Hash of the first transaction
        const proof = merkleTree.getProof(leaf).map(p => p.data.toString('hex'));
        console.log("Merkle Proof for the first transaction:", proof);

        return { txHashes, merkleRoot, proof };
    } catch (error) {
        console.error("Error generating Merkle Tree:", error);
    }
}

// Call the function for block number 7038037
generateMerkleTreeForBlock(7038037);