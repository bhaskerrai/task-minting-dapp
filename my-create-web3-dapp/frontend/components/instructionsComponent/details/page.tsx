"use client"
import styles from "../instructionsComponent.module.css";
import {
    MyToken,
    MyTokenABI,
} from "@/constants";

import { useState, useEffect } from "react";
import { formatEther } from "viem/utils";
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, useSignMessage } from "wagmi";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions"



const Details = () => {

    const {address, isConnecting, isDisconnected} = useAccount()

    const [loading, setLoading] = useState(false);
    
    const [showForm, setShowForm] = useState(false);
    const [tokenQuantity, setTokenQuantity] = useState("");


    const totalNoOfTokenMinted = useContractRead({
        abi: MyTokenABI,
        address: MyToken,
        functionName: "totalSupply"
    })

    const totalSupply: number = totalNoOfTokenMinted.data as number


    const totalNFTsMintedByUser = useContractRead({
        abi: MyTokenABI,
        address: MyToken,
        functionName: "walletMints",
        args:[address]
    })

    const yourNFTs: number = totalNFTsMintedByUser.data as number


    const mintFeeToPay = useContractRead({
        abi: MyTokenABI,
        address: MyToken,
        functionName: "mintPrice",
    })

    const mintFee: number = mintFeeToPay.data as number


    // Fetching the balance of DAO
    const daoBalance = useBalance({
        address: MyToken,
    })

    // Fetching the owner of the DAO
    const daoOwner = useContractRead({
        abi: MyTokenABI,
        address: MyToken,
        functionName: "owner",
    });

    const ownerOfDAO: string = daoOwner.data as string
    // const owner = ownerOfDAO.toLowerCase()
    const owner = ownerOfDAO ? ownerOfDAO.toLowerCase() : '';

    

    function handleClick() {
        setShowForm(!showForm);

    }


    
    async function mint() {
        setLoading(true);

        const tokenQuantityBigInt: bigint = BigInt(parseInt(tokenQuantity));
        const mintFeeBigInt: bigint = BigInt(mintFee);
    
        const mintFeeToPay: bigint = tokenQuantityBigInt * mintFeeBigInt;

        try {
        const tx = await writeContract({
            address: MyToken,
            abi: MyTokenABI,
            functionName: "mint",
            args: [tokenQuantity],
            value: mintFeeToPay,
        });

        await waitForTransaction(tx);

        const tokenId = totalSupply + 1; 
        displayArtwork(tokenId);


        } catch (error) {
            console.error(error);
            window.alert(error);
        }

        setLoading(false);
    }


    function renderForm() {
        if(loading) {
            return <div>Loading...</div>
        }

        else {
            return (
                <div>
                    <label>Tokens: &nbsp;&nbsp;</label>
                    <input 
                        type="number"
                        placeholder="0"
                        onChange={(e) => setTokenQuantity(e.target.value)}   
                    />
                    <span>&nbsp;&nbsp;</span>
                    <button className={styles.cardButton} onClick={mint}>Mint</button>
                </div>
            )
        }
    }


    async function withdrawDAOEther() {
        setLoading(true)

        try {

            const tx = await writeContract({
                abi: MyTokenABI,
                address: MyToken,
                functionName: "withdrawEther",
                args: [],
            })

            await waitForTransaction(tx);
            
        } catch (error) {
            console.log(error);
            window.alert(error);
        }

        setLoading(false)
    }


    async function tokenURI(tokenId: number) {
        const artworkData = useContractRead({
            abi: MyTokenABI,
            address: MyToken,
            functionName: "tokenURI",
        });
        
        return artworkData as unknown as string;
    }
    
    

    function displayArtwork(tokenId: number) {
        const artworkElement = document.getElementById("artwork");
    
        if (artworkElement) {
            artworkElement.innerHTML = `<img src="${tokenURI(tokenId)}" alt="Dynamic Artwork"/>`;
        } else {
            console.error("Artwork element not found");
        }
    }


    

    if (isDisconnected) {
        return <div>Your are disconnected. Connect your wallet again.</div>
    }

    else if (isConnecting) {
        return <div>Loading...</div>
    }


    return (
        <>
            <div>

                {totalNFTsMintedByUser.isLoading ? (
                <div>Loading the number of NFTs minted by you...</div>
                ) : totalNFTsMintedByUser.error ? (
                <div>Error loading the number of NFTs you minted</div>
                ) : totalSupply !== undefined && (
                <div>You've minted: {yourNFTs.toString()} NFTs</div>
                )}

                <div>Maximum NFTs per Wallet: 3</div>

                {totalNoOfTokenMinted.isLoading ? (
                <div>Loading the number of NFTs minted so far...</div>
                ) : totalNoOfTokenMinted.error ? (
                <div>Error loading the number of NFTs minted</div>
                ) : totalSupply !== undefined && (
                <div>Total NFTs minted: {totalSupply.toString()}</div>
                )}
                

                {daoBalance.isLoading ? (
                <div>Loading DAO balance...</div>
                ) : daoBalance.error ? (
                <div>Error loading DAO balance</div>
                ) : daoBalance.data && daoBalance.data.value !== undefined && (
                <>
                    DAO Balance:{" "}
                    {formatEther(daoBalance.data.value).toString()} ETH
                </>
                )}

            </div>

            <div className={styles.buttons_container}>
                <button
                    className={styles.button} 
                    onClick={handleClick}
                >
                    Mint NFT
                </button>
            </div>

            {showForm &&(
                renderForm()
            )}


            {address && address.toLowerCase() === owner && (
                <div className={styles.buttons_container}>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        
                        <button
                            className={styles.button} 
                            onClick={withdrawDAOEther}
                        >
                            Withdraw DAO ETH
                        </button>
                    )}
                </div>
            )}

        </>
    )
}



export default Details