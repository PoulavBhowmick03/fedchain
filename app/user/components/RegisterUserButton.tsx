/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "@/app/idl.json";
import * as anchor from "@project-serum/anchor";
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");
const localRpcUrl = "http://localhost:8899";

type RegisterButtonProps = {
  onSuccess: (publicKey: string) => void;
  onError: (error: any) => void;
};

const RegisterButton = ({ onSuccess, onError }: RegisterButtonProps) => {
    const [program, setProgram] = useState<anchor.Program>();
    const { connection } = useConnection();
    const localConnection = new web3.Connection(localRpcUrl);
    const wallet = useAnchorWallet();

    useEffect(() => {
        if (wallet) {
            const provider = new AnchorProvider(localConnection, wallet, {
                preflightCommitment: "processed"
            }); 
            const program = new Program(idl as anchor.Idl, programID, provider);
            setProgram(program);
        }
    }, [connection, wallet]); // Include localConnection in the dependency array
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

            toast.success("User registered successfully!");
            if (onSuccess) onSuccess(wallet.publicKey.toString());

            await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ walletAddress: wallet.publicKey.toString() }),
            });
        } catch (error) {
            console.error("Error registering user:", error);
            toast.error("Error registering user. Please try again.");
            if (onError) onError(error);
        }
    };

    return (
        <button
            onClick={handleRegister}
            className=" mt-2 flex flex-col sm:mt-0 sm:flex-row sm:items-center bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-700 transition duration-300"
        >
            Register
        </button>
    );
};

export default RegisterButton;
