// RewardSol.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import idl from "@/app/idl.json";
import dynamic from 'next/dynamic';
import * as anchor from "@project-serum/anchor";

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");
const localRpcUrl = "http://localhost:8899";

const RewardSol = () => {
    const [program, setProgram] = useState<anchor.Program | null>(null);
    const { connection } = useConnection();
    const localConnection = new web3.Connection(localRpcUrl);

    const wallet = useAnchorWallet();
    const [rewardAmount, setRewardAmount] = useState<number>(0);
    const [userToReward, setUserToReward] = useState("");

    useEffect(() => {
        if (wallet) {
            const provider = new AnchorProvider(localConnection, wallet, {
                preflightCommitment: "processed"
            });
            const program = new Program(idl as anchor.Idl, programID, provider);
            setProgram(program);
        }
    }, [connection, wallet]);

    const handleReward = async () => {
        if (!program || !wallet || rewardAmount <= 0 || !userToReward) return;

        try {
            const [orgAccountPDA] = await web3.PublicKey.findProgramAddress(
                [Buffer.from("org"), wallet.publicKey.toBuffer()],
                programID
            );

            const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
                [Buffer.from("user"), new web3.PublicKey(userToReward).toBuffer()],
                programID
            );

            // Proceed with reward
            await program.methods.rewardUser(new BN(rewardAmount * web3.LAMPORTS_PER_SOL))
                .accounts({
                    userAccount: userAccountPDA,
                    orgAccount: orgAccountPDA,
                    user: new web3.PublicKey(userToReward),
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            console.log("Reward successful!");

            // Update user's solRewarded in the database
            const response = await fetch('/api/rewardSol', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orgWalletAddress: wallet.publicKey.toString(),
                    userWalletAddress: userToReward,
                    amount: rewardAmount * web3.LAMPORTS_PER_SOL,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log("Database updated:", data);
            } else {
                console.error("Failed to update database:", data);
            }
        } catch (error) {
            console.error("Error during reward:", error);
        }
    };

    return (
        <div>
            <WalletMultiButtonDynamic />

            <h1>Reward SOL</h1>
            <h1>Organization wallet: {`${wallet?.publicKey}`}</h1>
            <input
                className='text-black'
                type="number"
                value={rewardAmount}
                onChange={(e) => setRewardAmount(Number(e.target.value))}
                placeholder="Amount to reward"
            />
            <input
                className='text-black'
                type="text"
                value={userToReward}
                onChange={(e) => setUserToReward(e.target.value)}
                placeholder="User Public Key to Reward"
            />
            <button onClick={handleReward} disabled={!wallet || rewardAmount <= 0 || !userToReward}>Reward</button>
        </div>
    );
};

export default RewardSol;