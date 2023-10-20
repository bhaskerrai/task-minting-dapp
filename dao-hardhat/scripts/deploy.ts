import { ethers } from 'hardhat';
import { verify } from '../utils/verify';

function sleep (ms:number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {

    console.log("Deploying CryptoDevsNFT Contract...")
    const cryptoDevsNFT = await ethers.deployContract("CryptoDevsNFT");
    await cryptoDevsNFT.waitForDeployment();
    console.log("CryptoDevsNFT deployed at", cryptoDevsNFT.target)
    
    console.log("Deploying FakeNFTMarketplace Contract...")
    const fakeNFTMarketplace = await ethers.deployContract("FakeNFTMarketplace");
    await fakeNFTMarketplace.waitForDeployment();
    console.log("FakeNFTMarketplace deployed at", fakeNFTMarketplace.target)
    
    console.log("Deploying CryptoDevsDAO Contract...")
    const amount = ethers.parseEther("1");

    const cryptoDevsDAO = await ethers.deployContract("CryptoDevsDAO", [
        cryptoDevsNFT.target,
        fakeNFTMarketplace.target
    ], {value: amount});

    await cryptoDevsDAO.waitForDeployment();
    console.log("CryptoDevsDAO deployed at", cryptoDevsDAO.target)

    sleep(30 * 1000)


    //Verfying Contracts
    verify(cryptoDevsNFT.target.toString(), [])
    
    verify(fakeNFTMarketplace.target.toString(), [])

    verify(cryptoDevsDAO.target.toString(), [
        cryptoDevsNFT.target, 
        fakeNFTMarketplace.target
    ])

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
