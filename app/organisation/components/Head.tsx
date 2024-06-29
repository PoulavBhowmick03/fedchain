/* eslint-disable react/no-unescaped-entities */
'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '@/app/idl.json';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect } from 'react';
import WalletContextProvider from '@/components/WaletContextProvider';
import RegisterOrgModal from '@/app/organisation/components/RegisterOrg'; // Import the modal component

const programID = new PublicKey("8nDcKiH4thwNKiH4rW12kVVqtYhWN7wzSrzANeLGp1dj");

const Head = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const wallet = useWallet();
  const [status, setStatus] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleRegisterOrgClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRegisterOrgSuccess = (publicKey: string) => {
    console.log("Organization registered with public key:", publicKey);
    // Handle success (e.g., update UI, show a message)
  };

  const handleRegisterOrgError = (error: any) => {
    console.error("Error registering organization:", error);
    // Handle error (e.g., show error message)
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
              <p className="mt-1.5 text-sm text-gray-500">Let's train the model you want! 🎉</p>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-center">
              <button
                className="block rounded-lg bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring"
                type="button"
                onClick={handleRegisterOrgClick}
              >
                Register as Org
              </button>
            </div>
          </div>
        </div>
      </header>

      <RegisterOrgModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleRegisterOrgSuccess}
        onError={handleRegisterOrgError}
      />
    </WalletContextProvider>
  );
};

export default Head;