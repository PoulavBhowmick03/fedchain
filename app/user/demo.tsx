'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '@/app/idl.json';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import dynamic from 'next/dynamic';

const WalletContextProvider = dynamic(() => import('@/components/WaletContextProvider'), { ssr: false });

const programID = new web3.PublicKey("8nDcKiH4thwNKiH4rW12kVVqtYhWN7wzSrzANeLGp1dj");

const RegisterUser = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.publicKey) return;

    const provider = new AnchorProvider(connection, wallet as any, {});
    const program = new Program(idl as any, programID, provider);

    try {
      // Generate a PDA for the user account
      const [userAccountPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("user"), wallet.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods.registerUser()
        .accounts({
          userAccount: userAccountPDA,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      await connection.confirmTransaction(tx);
      setStatus("User registered successfully");
      console.log("User registered successfully", tx);
    } catch (error) {
      console.error("Error registering user:", error);
      setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <WalletMultiButton />
      {wallet.connected ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Register User</h2>
          <form onSubmit={handleSubmit}>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Register User
            </button>
          </form>
        </div>
      ) : (
        <p>Please connect your wallet to register as a user.</p>
      )}
      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
};

export default RegisterUser;
