"use client"
import Head from "@/app/user/components/Head";
import Sidebar from "@/app/user/components/Sidebar";
import Train from "@/app/user/components/Train";
import WalletContextProvider from '@/components/WaletContextProvider'
import WalletNotConnected from "@/components/WalletNotConnected";
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useState } from "react";

const TrainModel = () => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const wallet = useWallet();
  const [status, setStatus] = useState('');
  let user;
  if (wallet.connected) {
    user: wallet.publicKey?.toBase58(),
      console.log(user);
  }
  return (

    <div className="">
                <Sidebar />

      {wallet.connected ? (
        <div>
          {/* Sidebar */}

          {/* Main Content */}
          <div className="flex-grow">
            {/* Head component */}
            <Head />
            <Train />
            {/* Other content for the main section */}
            {/* Add your content here */}
          </div>
        </div>

      ) : (
        <WalletNotConnected />
      )}
    </div>
  );
}

export default TrainModel;