require("@nomiclabs/hardhat-ethers");
require("dotenv").config(); // Ensure dotenv is loaded to use environment variables
console.log("Private Key length:", process.env.PRIVATE_KEY.length); // To check if it's 64 characters long
console.log("Private Key:", process.env.PRIVATE_KEY); // To see the actual key being loaded



module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.27", // Your contract's Solidity version
      },
      {
        version: "0.8.20", // OpenZeppelin's Solidity version
      },
    ],
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/1_hQmbQzkDj_5iuVszTRIaq8cmDE5aws/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};