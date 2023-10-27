import { ethers } from 'hardhat';
import { verify } from '../utils/verify';

function sleep (ms:number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {

    console.log("Deploying MyToken Contract...")
    // const myNftContract = await ethers.deployContract("DynamicNFT");
    // await myNftContract.waitForDeployment();

    const MyNftContract = await ethers.getContractFactory("DynamicNFT");
    const myNftContract = await MyNftContract.deploy("6320");
    await myNftContract.waitForDeployment();
    console.log("MyToken deployed at", myNftContract.target)

    sleep(30 * 1000)


    //Verfying Contracts
    // verify(myNftContract.target.toString(), [])
    // verify("0x47C383658e159227Eea55a82E86159d0CDED2d7b", [])

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
