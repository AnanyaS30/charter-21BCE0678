const hre = require("hardhat");

async function main() {
  const MerkleProofVerification = await hre.ethers.getContractFactory("MerkleProofVerification");
  const merkleProofVerification = await MerkleProofVerification.deploy();

  await merkleProofVerification.deployed();

  console.log("MerkleProofVerification deployed to:", merkleProofVerification.address);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });