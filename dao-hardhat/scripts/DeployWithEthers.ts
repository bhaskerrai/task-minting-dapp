import { ethers } from "ethers";
import { SomeFile__factory } from '../typechain-types';  //Note: Change this to the solidity file (i.e fileName__factory) you have compiled
import {verify} from '../utils/verify';
import * as dotenv from 'dotenv';
dotenv.config();


function setupProvider() {
    const providerUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`

    return new ethers.JsonRpcProvider(providerUrl);
}

async function main() {

    const provider = setupProvider()
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider)

    console.log("Deploying contract...");
    const someContractFactory = new SomeFile__factory(wallet)
    
    const someContract = await someContractFactory.deploy();
    
    //Alternatively
    //const someContract = new ethers.Contract(contractAddress, contractABI, wallet);

    await someContract.waitForDeployment();
    const address = await someContract.getAddress();
    
    console.log(`Deployed contract at ${address}`);


    // Verify Contract

    // const args = ["arg1", "arg2", ...] 
    // verify(address, args)
    

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});