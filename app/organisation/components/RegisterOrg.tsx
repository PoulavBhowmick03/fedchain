/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from "@/app/idl.json";
import * as anchor from "@project-serum/anchor"
import dynamic from 'next/dynamic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");
const localRpcUrl = "http://localhost:8899";

type RegisterOrgModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (publicKey: string) => void;
    onError: (error: any) => void;
};

export default function RegisterOrgModal({ isOpen, onClose, onSuccess, onError }: RegisterOrgModalProps) {
    const [program, setProgram] = useState<anchor.Program>()
    const { connection } = useConnection();
    const localConnection = new web3.Connection(localRpcUrl);
    const wallet = useAnchorWallet();
    const [orgName, setOrgName] = useState('');
    const [registrationStatus, setRegistrationStatus] = useState('');

    useEffect(() => {
        if (wallet && connection) {
            const provider = new AnchorProvider(
                connection,
                wallet as any,
                { preflightCommitment: "processed" }
            );
            const program = new Program(idl as anchor.Idl, programID, provider);
            setProgram(program);
        }
    }, [wallet, connection]);
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
            toast.success("Organization registered successfully!");

            setRegistrationStatus("Organization registered successfully!");
            onSuccess(wallet.publicKey.toString());

            // Call backend 
            await fetch('/api/org', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: orgName, walletAddress: wallet.publicKey.toString() }),
            });

            onClose();
        } catch (error) {
            console.error("Error registering organization:", error);
            toast.error("Error registering organization. Please try again.");
            setRegistrationStatus("Error registering organization. Please try again.");
            onError(error);
        }
    };

    if (!isOpen) return null;

    return (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 p-20 flex justify-center items-center">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-white">Register Organization</h2>
                    <input
                        className='text-black border rounded p-2 mb-4 w-full'
                        type="text"
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="Organization Name"
                    />
                    <div className="flex justify-between">
                        <button
                            className="bg-white text-purple-700 px-4 py-2 rounded shadow hover:bg-gray-200 transition-all"
                            onClick={handleRegister}
                        >
                            Register
                        </button>
                        <button
                            className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400 transition-all"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                    {registrationStatus && <p className="mt-4 text-white">{registrationStatus}</p>}
                </div>
                <ToastContainer />
            </div>
    
    );
}