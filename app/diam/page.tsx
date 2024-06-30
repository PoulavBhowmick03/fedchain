'use client';

import Link from 'next/link';
import { useDiamante } from '@/context/DiamanteContext';

export default function Home() {
  const { createAddress, balance, publicAdd } = useDiamante();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome to Diamante Gigs</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-black text-xl font-semibold mb-4">Your Diamante Account</h2>
          {publicAdd ? (
            <div className='text-black'>
              <p className="mb-2">Public Address: {publicAdd}</p>
              <p className="mb-4">Balance: {balance} DIAM</p>
            </div>
          ) : (
            <button
              onClick={createAddress}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Create Diamante Address
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/diam/create-gig" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-center">
            Create a Gig
          </Link>
          <Link href="/diam/gigs" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded text-center">
            View Gigs
          </Link>
        </div>
      </div>
    </div>
  );
}