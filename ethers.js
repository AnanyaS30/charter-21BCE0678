// Export the fetchTransactions function
module.exports = { fetchTransactions };
const { ethers } = require("ethers");

// Connect to the Sepolia testnet via Infura
const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/1_hQmbQzkDj_5iuVszTRIaq8cmDE5aws");

async function fetchTransactions(blockNumber) {
    try {
        // Fetch the block with transactions
        const block = await provider.getBlockWithTransactions(blockNumber);
        const txHashes = block.transactions.map(tx => tx.hash);

        // Log the transaction hashes
        console.log("Transaction Hashes:", txHashes);

        // Return the transaction hashes
        return txHashes;
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

// Export the function so it can be used in another file
module.exports = { fetchTransactions };
