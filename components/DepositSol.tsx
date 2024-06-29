/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import idl from "@/app/idl.json";
import * as anchor from "@project-serum/anchor";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");
const localRpcUrl = "http://localhost:8899";
interface DepositSolModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelName: string;
}

const DepositSol: React.FC<DepositSolModalProps> = ({ isOpen, onClose, modelName }) => {
  const [program, setProgram] = useState<anchor.Program | null>(null);
  const localConnection = new web3.Connection(localRpcUrl);
  const wallet = useAnchorWallet();
  const [amount, setAmount] = useState<number>(0);
  const [orgOwner, setOrgOwner] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(localConnection, wallet, {
        preflightCommitment: "processed"
      });
      const program = new Program(idl as anchor.Idl, programID, provider);
      setProgram(program);
    }
  }, [wallet]);

  const handleDeposit = async () => {
    if (!program || !wallet || amount <= 0 || !orgOwner) return;

    try {
      const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("user"), wallet.publicKey.toBuffer()],
        programID
      );

      const [orgAccountPDA] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("org"), new web3.PublicKey(orgOwner).toBuffer()],
        programID
      );

      // Check if user account exists
      const userAccountInfo = await localConnection.getAccountInfo(userAccountPDA);

      if (!userAccountInfo) {
        // If user account doesn't exist, create it
        await program.methods.registerUser()
          .accounts({
            userAccount: userAccountPDA,
            user: wallet.publicKey,
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();
        console.log("User account created");
      }

      // Proceed with deposit
      await program.methods.depositSol(new BN(amount * web3.LAMPORTS_PER_SOL))
        .accounts({
          userAccount: userAccountPDA,
          user: wallet.publicKey,
          orgAccount: orgAccountPDA,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Deposit successful!");

      // Update user's solDeposited in the database
      const response = await fetch('/api/depositSol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: wallet.publicKey.toString(),
          amount: amount * web3.LAMPORTS_PER_SOL,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Database updated:", data);
      } else {
        console.error("Failed to update database:", data);
      }
    } catch (error) {
      console.error("Error during deposit:", error);
    }
    setTimeout(() =>{router.push('/user/download');}, 3000);
    
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h2 className="text-3xl font-bold mb-6 text-white">Deposit SOL for {modelName}</h2>
        <p className="mb-6 text-purple-200">Your wallet: {wallet?.publicKey.toString()}</p>
        <input
          className='w-full p-3 mb-6 bg-purple-800 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Amount to deposit"
        />
        <input
          className='w-full p-3 mb-6 bg-purple-800 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500'
          type="text"
          value={orgOwner}
          onChange={(e) => setOrgOwner(e.target.value)}
          placeholder="Organization Owner Public Key"
        />
        <div className="flex justify-between">
          <button
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeposit}
            disabled={!wallet || amount <= 0 || !orgOwner}
          >
            Deposit
          </button>
          <button
            className="bg-purple-800 text-purple-200 px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositSol;
