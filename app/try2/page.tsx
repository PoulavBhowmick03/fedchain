/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "../idl.json";
import * as anchor from "@project-serum/anchor"
import dynamic from 'next/dynamic';

const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");
const localRpcUrl = "http://localhost:8899";
export default function RegisterOrg() {
    const [program, setProgram] = useState<anchor.Program>()
    const { connection } = useConnection();
    const localConnection = new web3.Connection(localRpcUrl);
    const wallet = useAnchorWallet();
    const [orgName, setOrgName] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');
    const WalletMultiButtonDynamic = dynamic(
        async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
        { ssr: false }
    );

    useEffect(() => {
        if (wallet) {
            const provider = new AnchorProvider(localConnection, wallet, {
                preflightCommitment: "processed"
            }); 
            const program = new Program(idl as anchor.Idl, programID, provider);
            setProgram(program);
        }
    }, [connection, wallet, localConnection]);

    const handleRegister = async () => {
        if (!program || !wallet || !orgName) return;

        try {
            const [orgAccountPDA] = await web3.PublicKey.findProgramAddress(
                [Buffer.from("org"), wallet.publicKey.toBuffer()],
                programID
            );

            await program.methods.registerOrg(orgName)
                .accounts({
                    orgAccount: orgAccountPDA,
                    user: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            setRegistrationStatus("Organization registered successfully!");

            // Call backend 
            await fetch('/api/org', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: orgName, walletAddress: wallet.publicKey.toString() }),
            });
        } catch (error) {
            console.error("Error registering organization:", error);
            setRegistrationStatus("Error registering organization. Please try again.");
        }
    };

    return (
        <div>
            <h1>Register Organization</h1>
            <WalletMultiButtonDynamic />

            <input
                className='text-black'
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Organization Name"
            />
            <button onClick={handleRegister}>Register</button>
            {registrationStatus && <p>{registrationStatus}</p>}
        </div>
    );
};