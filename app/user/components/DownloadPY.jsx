"use client"
import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { sha256 } from 'js-sha256';

const CID = 'Qma3k61CcvxEZAL8ENVQmMfihnPeEbh7K35fzfaKM45tko';

// Dynamically import the SendSolButton component
const SendSolButton = dynamic(
  () => import('@/app/reward/comp/reward').then((mod) => mod.SendSolButton),
  { ssr: false }
);

const DownloadPage = () => {
  const [downloaded, setDownloaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  const { publicKey } = useWallet();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected && publicKey) {
      console.log('Wallet connected:', publicKey.toBase58());
    }
  }, [publicKey, wallet.connected]);

  const handleDownload = async () => {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${CID}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'client.py');
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDownloaded(true);
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  const openRewardsModal = async () => {
    if (!publicKey) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const response = await axios.get('/api/receive-list');
      const storedValue = response.data.value;
      
      const walletAddressHash = sha256(publicKey.toBase58());
      
      if (storedValue === walletAddressHash) {
        setIsEligible(true);
        setIsModalOpen(true);
      } else {
        alert('You are not eligible for rewards at this time.');
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      alert('Error checking eligibility. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 sm:px-48 lg:px-28 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Download client.py</h1>
        <p className="text-lg mb-10">
          Download the client side of the program to train with your own data and automatically update the parameters
          <br />
          earning your incentive on the way
        
        </p>
        <button
          onClick={handleDownload}
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700 mr-10"
        >
          Download
        </button>
        <button 
          disabled={!downloaded}
          onClick={openRewardsModal}
          className={`bg-purple-500 text-white py-2 px-4 rounded mr-10 ${!downloaded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
        >
          Claim Rewards
        </button>
      </div>

      {isModalOpen && isEligible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Claim Your Rewards</h2>
            <SendSolButton />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadPage;