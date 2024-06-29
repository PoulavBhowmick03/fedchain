"use client"
import React, { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '@/app/idl.json';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import WalletContextProvider from '@/components/WaletContextProvider';
import RegisterButton from './RegisterUserButton';
import 'react-toastify/dist/ReactToastify.css';

const programID = new PublicKey("8nDcKiH4thwNKiH4rW12kVVqtYhWN7wzSrzANeLGp1dj");

const UserRegistrationPage = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.connected && publicKey) {
      setUser(publicKey.toBase58());
    }
  }, [wallet.connected, publicKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey) return;

    const provider = new AnchorProvider(connection, window.solana as any, {});
    const program = new Program(idl as any, programID, provider);

    try {
      const userAccount = web3.Keypair.generate();
      const tx = await program.methods.registerUser()
        .accounts({
          userAccount: userAccount.publicKey,
          user: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([userAccount])
        .transaction();

      const txSignature = await sendTransaction(tx, connection, { signers: [userAccount] });
      await connection.confirmTransaction(txSignature);
      console.log("User registered successfully");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleSuccess = (walletAddress: any) => {
    console.log(`User registered with wallet address: ${walletAddress}`);
  };

  const handleError = (error: any) => {
    console.error("Registration error:", error);
  };

  return (
    <WalletContextProvider>
      <header className="dark:bg-gray-900 sm:ml-24">
        <div className="max-w-screen-xl mx-40 py-8 sm:px-2 sm:py-12 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-300 sm:text-3xl">
                Welcome Back, {user}
              </h1>
              <p className="mt-1.5 text-sm text-gray-500">Lets train the model you want! 🎉</p>
            </div>

            <RegisterButton onSuccess={handleSuccess} onError={handleError} />
          </div>
        </div>
      </header>
    </WalletContextProvider>
  );
};

export default UserRegistrationPage;
