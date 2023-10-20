import { run } from "hardhat";

// Function to verify our contract on etherscan.io
const verify = async (contractAddress: string, args: any[]) => {
    console.log("Verifying contract...");

    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        const error = e as any; // Type assertion

        if (error.message && typeof error.message === "string" && error.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!");
        } else {
            console.log(error);
        }
    }
};

export { verify };
