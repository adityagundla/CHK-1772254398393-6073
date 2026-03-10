import hre from "hardhat";

async function main() {
  const DataOwnerShip = await hre.ethers.getContractFactory("DataOwnerShip");
  const dataOwnerShip = await DataOwnerShip.deploy();
  await dataOwnerShip.waitForDeployment();
  const ownerAddress = await dataOwnerShip.getAddress();
  console.log("DATA_OWNERSHIP_ADDRESS =", ownerAddress);

  const DataRegistry = await hre.ethers.getContractFactory("DataRegistry");
  const dataRegistry = await DataRegistry.deploy();
  await dataRegistry.waitForDeployment();
  const registryAddress = await dataRegistry.getAddress();
  console.log("DATA_REGISTRY_ADDRESS =", registryAddress);

  const AccessControl = await hre.ethers.getContractFactory("AccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  const accessAddress = await accessControl.getAddress();
  console.log("ACCESS_CONTROL_ADDRESS =", accessAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
