import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from 'dotenv';
dotenv.config();

const polygonRpc = process.env.POLYGON_RPC
const PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY


const config: HardhatUserConfig = {
  solidity: "0.8.19",
  paths: { tests: "tests" },
  networks: {
    hardhat: {
      chainId: 1337, // Sepolia chainId
    },
    sepolia: {
      url: "https://sepolia.ledgerium.net/rpc", // Sepolia RPC URL
      chainId: 1729, // Sepolia chainId
      accounts: {
        mnemonic: "your-mnemonic-here", // Add your mnemonic for the Sepolia account
      },
    },

    polygon_mumbai: {
      url: polygonRpc,
      accounts: [`0x${PRIVATE_KEY}`]
   },
  },

  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export default config;
