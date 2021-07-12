// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');
  if (network.name !== "rinkeby") {
    console.warn(
      "You are trying to deploy a contract to a Network other than Rinkeby, the task requires that the smart contract be deployed to rinkeby"
    );
  }
  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());
  // We get the contract to deploy
  const Dagogo = await ethers.getContractFactory("Dagogo");
  const DexSwap = await ethers.getContractFactory("DexSwap");
  const dagogo = await Dagogo.deploy("ProtoFire Token", "TOK", ethers.utils.parseUnits('1000000'));
  await dagogo.deployed();
  const dexSwap = await DexSwap.deploy("DEX Exchange", dagogo.address);
  await dexSwap.deployed();

  console.log("Reward address:", dagogo.address);
  console.log("Exchange address:", dexSwap.address);
  dagogo.transfer(dexSwap.address, ethers.utils.parseUnits('1000000'));

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(dagogo, dexSwap);
}

function saveFrontendFiles(dagogo, dexSwap) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../exchange_dapp/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ protoFire: dagogo.address, dexSwap: dexSwap.address }, undefined, 2)
  );

  const protoFireArtifact = artifacts.readArtifactSync("Dagogo");
  const exchangeArtifact = artifacts.readArtifactSync("DexSwap");

  fs.writeFileSync(
    contractsDir + "/proto-fire.json",
    JSON.stringify(protoFireArtifact, null, 2)
  );

  fs.writeFileSync(
    contractsDir + "/dex-swap.json",
    JSON.stringify(exchangeArtifact, null, 2)
  );
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
