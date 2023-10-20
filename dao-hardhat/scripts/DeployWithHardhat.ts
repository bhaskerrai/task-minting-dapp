import { ethers } from "hardhat";

async function main() {
    const [deployer, account2] = await ethers.getSigners();

    const someContractFactory = await ethers.getContractFactory("SomeFile");
    const someContract = await someContractFactory.deploy();

    await someContract.waitForDeployment();

    const tokenContractAddress = await someContract.getAddress();
    console.log(tokenContractAddress);


}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
