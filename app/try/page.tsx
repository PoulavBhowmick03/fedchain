"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "../idl.json";
import * as anchor from "@project-serum/anchor"
import dynamic from 'next/dynamic';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const programID = new web3.PublicKey("D1sEXfGQqBB8ZtTqasjCV7RnLdWtBCyhDcoGQXnewEDE");

export default function RegisterUser() {
    const [program, setProgram] = useState<anchor.Program>()
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [registrationStatus, setRegistrationStatus] = useState('');

    useEffect(() => {
        if (wallet) {
            const provider = new AnchorProvider(connection, wallet, {});
            const program = new Program(idl as anchor.Idl, programID, provider);
            setProgram(program);
        }
    }, [connection, wallet]);

    const handleRegister = async () => {
        if (!program || !wallet) return;

        try {
            const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
                [Buffer.from("user"), wallet.publicKey.toBuffer()],
                programID
            );

            await program.methods.registerUser()
                .accounts({
                    userAccount: userAccountPDA,
                    user: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            setRegistrationStatus("User registered successfully!");
            console.log("User registered successfully!",wallet.publicKey.toString());
            
            await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walletAddress: wallet.publicKey.toString() }),
            });
        } catch (error) {
            console.error("Error registering user:", error);
            setRegistrationStatus("Error registering user. Please try again.");
        }
    };

    return (
        <div>
            <WalletMultiButtonDynamic />

            <h1>Register User</h1>
            <button onClick={handleRegister}>Register</button>
            {registrationStatus && <p>{registrationStatus}</p>}
        </div>
    );
};