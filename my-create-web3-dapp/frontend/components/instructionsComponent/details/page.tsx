"use client"
import styles from "../instructionsComponent.module.css";
import {
    CryptoDevsDAOABI,
    CryptoDevsDAOAddress,
    CryptoDevsNFTABI,
    CryptoDevsNFTAddress,
} from "@/constants";

import { useState, useEffect } from "react";
import {ethers} from 'ethers';
import { useAccount, useBalance, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, useSignMessage } from "wagmi";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions"

interface Proposal {
    proposalId: number;
    nftTokenId: string;
    deadline: Date;
    yayVotes: string;
    nayVotes: string;
    executed: boolean;
}


const Details = () => {

    const {address, isConnecting, isDisconnected} = useAccount()

    // State variable to show loading state when waiting for a transaction to go through
    const [loading, setLoading] = useState(false);
    
    const [showProposalForm, setShowProposalForm] = useState(false);
    const [viewProposals, setViewProposals] = useState(false);
    const [fakeNftTokenId, setFakeNftTokenId] = useState("");

    // State variable to store all proposals in the DAO
    const [proposals, setProposals] = useState<any[]>([]);


    // Fetch the CryptoDevs NFT balance of the user
    const nftBalanceOfUser = useContractRead({
        abi: CryptoDevsNFTABI,
        address: CryptoDevsNFTAddress,
        functionName: "balanceOf",
        args: [address],
    })

    const nftBalance: number = nftBalanceOfUser.data as number;



    // Fetch the balance of DAO
    const daoBalance = useBalance({
        address: CryptoDevsDAOAddress,
    })

    // Fetch the owner of the DAO
    const daoOwner = useContractRead({
        abi: CryptoDevsDAOABI,
        address: CryptoDevsDAOAddress,
        functionName: "owner",
    });

    const ownerOfDAO: string = daoOwner.data as string



    // Fetch the number of proposals in the DAO
    const numOfProposalsInDAO = useContractRead({
        abi: CryptoDevsDAOABI,
        address: CryptoDevsDAOAddress,
        functionName: "numProposals",
    })

    const numProposals: number = numOfProposalsInDAO.data as number

    function handleClick() {
        setShowProposalForm(true);
        setViewProposals(false);

    }

    function handleView() {
        setViewProposals(true);
        setShowProposalForm(false);
    }


    //this method didn't work
    // async function createProposal() {
    //     setLoading(true)

    //     try {
    //         const {config} = usePrepareContractWrite({
    //             abi: CryptoDevsDAOABI,
    //             address: CryptoDevsDAOAddress,
    //             functionName: "createProposal",
    //             args: [fakeNftTokenId],
    //         })

    //         const { data, isLoading, isSuccess, write } = useContractWrite(config)

    //         if(write) {
    //             write()
    //         }

    //         // const tx = await write();

    //         // await tx.wait(); // Wait for the transaction to be mined

    //         // // Transaction successful
    //         // console.log('Transaction successful:', tx);

            
    //     } catch (error) {
    //         console.error(error)
    //         window.alert(error)
    //     }

    //     setLoading(false)
    // }



    // Function to make a createProposal transaction in the DAO
    
    async function createProposal() {
        setLoading(true);

        try {
        const tx = await writeContract({
            address: CryptoDevsDAOAddress,
            abi: CryptoDevsDAOABI,
            functionName: "createProposal",
            args: [fakeNftTokenId],
        });

        await waitForTransaction(tx);

        } catch (error) {
            console.error(error);
            window.alert(error);
        }

        setLoading(false);
    }


    function renderCreateProposal() {
        if(loading) {
            return <div>Loading...</div>
        }

        else if (nftBalance === 0) {
            return (
                <div>
                    You do not own any CryptoDevs NFTs. <br />
                    <b>You cannot create or vote on proposals</b>
                </div>
            )
        }

        else {
            return (
                <div>
                    <label>Fake NFT Token ID to Purchase: &nbsp;&nbsp;</label>
                    <input 
                        type="number"
                        placeholder="0"
                        onChange={(e) => setFakeNftTokenId(e.target.value)}   
                    />
                    <span>&nbsp;&nbsp;</span>
                    <button className={styles.cardButton} onClick={createProposal}>Create</button>
                    {/* <button onClick={() => createProposal?.()}>
                        Create
                    </button> */}
                </div>
            )
        }
    }

    async function executeProposal(proposalId: number) {
        setLoading(true);

        try {

            const tx = await writeContract({
                abi: CryptoDevsDAOABI,
                address: CryptoDevsDAOAddress,
                functionName: "executeProposal",
                args: [proposalId],
            })

            await waitForTransaction(tx);
            

        } catch (error) {
            console.log(error);
            window.alert(error);
        }

        setLoading(false)
    }

    async function voteForProposal(proposalId:number, vote: string) {

        setLoading(true)

        try {

            const tx = await writeContract({
                abi: CryptoDevsDAOABI,
                address: CryptoDevsDAOAddress,
                functionName: "voteOnProposal",
                args: [proposalId, vote === "YAY" ? 0 : 1],
            })

            await waitForTransaction(tx);
            
        } catch (error) {
            console.log(error);
            window.alert(error);
        }

        setLoading(false)
        
    }

    async function withdrawDAOEther() {
        setLoading(true)

        try {

            const tx = await writeContract({
                abi: CryptoDevsDAOABI,
                address: CryptoDevsDAOAddress,
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


    //this will also work 
    // const {config} = usePrepareContractWrite({
    //     abi: CryptoDevsDAOABI,
    //     address: CryptoDevsDAOAddress,
    //     functionName: "createProposal",
    //     args: [fakeNftTokenId],
    // })

    // const { data, isLoading, isSuccess, write } = useContractWrite(config)

    //but you have use button like this:
    {/* <button onClick={() => write?.()}>
        Create
    </button> */}



    // async function fetchAllProposals() {
    //     try {
    //         const proposals: Proposal[] = [];

    //         for (let i = 0; i < numProposals; i++) {

    //             const proposal = await fetchProposalById(i)
    //             if (proposal) {
    //                 proposals.push(proposal);
    //             }
    //         }

    //         setProposals(proposals)
    //         return proposals

    //     } catch (error) {
    //         console.error(error);
    //         window.alert(error);
    //     }
    // }


    // async function fetchProposalById(id: number): Promise<Proposal> {
    //     try {
    //         const proposalResult = useContractRead({
    //             abi: CryptoDevsDAOABI,
    //             address:CryptoDevsDAOAddress,
    //             functionName: "proposals",
    //             args: [id],
    //         })

    //         if (proposalResult.error) {
    //             throw new Error(proposalResult.error.message);
    //         }

    //         const proposal = proposalResult.data; // Extract the data

    //         const [nftTokenId, deadline, yayVotes, nayVotes, executed] = proposal as any[];

    //         const parsedProposal: Proposal = {
    //             proposalId: id,
    //             nftTokenId: nftTokenId.toString(),
    //             deadline: new Date(parseInt(deadline.toString()) * 1000),
    //             yayVotes: yayVotes.toString(),
    //             nayVotes: nayVotes.toString(),
    //             executed: Boolean(executed),
    //         }

    //         return parsedProposal

    //     } catch (error) {
    //         console.error(error);
    //         window.alert(error);
    //         return Promise.reject(error); // Return a rejected promise in case of an error
    //     }
    // }



    async function fetchProposalById(id: number): Promise<Proposal | undefined> {
        try {
          const proposal: any[] = await readContract<any[], string>({
            address: CryptoDevsDAOAddress,
            abi: CryptoDevsDAOABI,
            functionName: "proposals",
            args: [id],
          });
      
          if (!proposal || proposal.length !== 5) {
            return undefined;
          }
      
          const [nftTokenId, deadline, yayVotes, nayVotes, executed] = proposal;
      
          const parsedProposal: Proposal = {
            proposalId: id,
            nftTokenId: nftTokenId.toString(),
            deadline: new Date(parseInt(deadline.toString()) * 1000),
            yayVotes: yayVotes.toString(),
            nayVotes: nayVotes.toString(),
            executed: Boolean(executed),
          };
      
          return parsedProposal;
        } catch (error) {
          console.error(error);
          window.alert(error);
          return undefined;
        }
      }
      
    async function fetchAllProposals() {
        setLoading(true);

        try {
        //   const numProposals: number = Number(numOfProposalsInDAO.data) || 0;
          const proposals: Proposal[] = [];
      
          for (let i = 0; i < numProposals; i++) {
            const proposal = await fetchProposalById(i);
            if (proposal) {
              proposals.push(proposal);
            }
          }
      
          setProposals(proposals);
          setLoading(false);
          return proposals;

        } catch (error) {
          console.error(error);
          window.alert(error);
        }

        setLoading(false);
      }
      


    function showAllProposals() {

        if(loading) {
            return <div>Loading...</div>
        }

        else if (proposals.length === 0) {
            return (
                <div className={styles.description}>No proposals have been created</div>
              );
        }

        else {

            return (
                <div>
                    {
                        proposals.map((p, index) => (
                            <div key={index} className={styles.card}>
                            <p>Proposal ID: {p.proposalId} </p>
                            <p>Fake NFT to Purchase: {p.nftTokenId}</p>
                            <p>Deadline: {p.deadline.toLocaleString()} </p>
                            <br />
                            <p>Yay Votes: {p.yayVotes} </p>
                            <p>Nay Votes: {p.nayVotes} </p>
                            <p>Executed?: {p.executed.toString()} </p>

                            {
                                p.deadline.getTime() > Date.now() && !p.executed ? (
                                    <div>
                                        <button 
                                            className={styles.cardButton}
                                            onClick={() => voteForProposal(p.proposalId, "YAY")}
                                        >
                                            Vote YAY
                                        </button>

                                        <button 
                                            className={styles.cardButton}
                                            onClick={() => voteForProposal(p.proposalId, "NAY")}
                                        >
                                            Vote NAY
                                        </button>
                                    </div>
                                ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                                        <div>
                                            <button 
                                                className={styles.cardButton}
                                                onClick={() => executeProposal(p.proposalId)} 
                                            >
                                                Execute Proposal{" "}
                                                {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                                            </button>

                                        </div>
                                    
                                    ) : (
                                        <h4>Proposal Executed</h4>
                                    )    
                            }
                           
                            </div>
                        ))
                    }
                </div>
            )
        }

        
    }
    


    useEffect(() => {
        if(viewProposals) {
            console.log("proposals:", proposals)
            fetchAllProposals();
        }
    }, [viewProposals]);



    if (isDisconnected) {
        return <div>Your are disconnected. Connect your wallet again.</div>
    }

    else if (isConnecting) {
        return <div>Loading...</div>
    }


    return (
        <>
            {/* <WalletInfo /> */}
            <div>
                {/* <div>Your CryptoDevs NFT Balance: {nftBalance.toString()}</div>
                { daoBalance && 
                    <>
                        Treasury Balance: {ethers.utils.formatEther(daoBalance.data.value).toString()} ETH
                    </>            
                } */}

                {nftBalanceOfUser.isLoading ? (
                <div>Loading NFT balance...</div>
                ) : nftBalanceOfUser.error ? (
                <div>Error loading NFT balance</div>
                ) : nftBalance !== undefined && (
                <div>Your CryptoDevs NFT Balance: {nftBalance.toString()}</div>
                )}

                {daoBalance.isLoading ? (
                <div>Loading DAO balance...</div>
                ) : daoBalance.error ? (
                <div>Error loading DAO balance</div>
                ) : daoBalance.data && daoBalance.data.value !== undefined && (
                <>
                    Treasury Balance: {ethers.utils.formatEther(daoBalance.data.value).toString()} ETH
                </>
                )}

                <div>Total Number of Proposals: {numProposals.toString()}</div>
            </div>

            <div className={styles.buttons_container}>
                <button
                    className={styles.button} 
                    onClick={handleClick}
                >
                    Create Proposal
                </button>
            
                <button
                    className={styles.button} 
                    onClick={handleView}
                >
                    View Proposal
                </button>
            </div>

            {showProposalForm &&(
                renderCreateProposal()
            )}



            {viewProposals &&(
                // console.log("numProposals:", numProposals)
                showAllProposals()
            )}

            {address && address.toLowerCase() === ownerOfDAO.toLowerCase() && (
                <div>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        
                        <div className={styles.buttons_container}>
                            <button
                                className={styles.withdrawETHButton} 
                                onClick={withdrawDAOEther}
                            >
                                Withdraw DAO ETH
                            </button>
                        </div>
                    )}
                </div>
            )}

        </>
    )
}

function WalletInfo() {
    const {address, isConnecting, isDisconnected} = useAccount()

    if (address) {
        return (
            <div>Your address is: {address}</div>
        )
    }

    if (isConnecting) {
        return (
            <div>Loading...</div>
        )
    }

    if (isDisconnected) {
        return (
            <div>Diconnected</div>
        )
    }

    return (
        <>Please Connect you wallet!</>
    )
}


export default Details