require('dotenv').config();
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const CrowdFunding = await hre.ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy();
  await crowdFunding.deployed();

  console.log("CrowdFunding deployed to:", crowdFunding.address);

  // Write address and ABI to a file for frontend
  const contractData = {
    address: crowdFunding.address,
    abi: CrowdFunding.interface.format("json"),
  };
  const outputDir = path.join(__dirname, "../../client/src/constants");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(outputDir, "CrowdFunding.json"),
    JSON.stringify(contractData, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 