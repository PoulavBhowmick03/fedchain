"use client"

import Head from "../../components/Head";
import Sidebar from "../../components/Sidebar";
import Train from "../../components/Train";
import WalletNotConnected from "../../../../components/WalletNotConnected";
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import React, { useState } from "react";

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