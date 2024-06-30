'use client';

import { useState, useEffect } from 'react';
import { useDiamante } from '@/context/DiamanteContext';

interface Gig {
  id: number;
  gigName: string;
  details: string;
  totalBounty: string;
  deadline: string;
  creatorAddress: string;
}

export default function Gigs() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const { giveDiam, publicAdd } = useDiamante();

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      const response = await fetch('/api/gigs');
      if (response.ok) {
        const data = await response.json();
        setGigs(data);
      } else {
        console.error('Failed to fetch gigs');
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
    }
  };

  const handleAcceptGig = async (gigId: number) => {
    if (!publicAdd) {
      alert('Please create a Diamante address first');
      return;
    }
    await giveDiam();
    alert('Gig accepted! DIAM transferred.');
    // Here you would typically update the gig status in your backend
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Available Gigs</h1>
        <div className="space-y-6">
          {gigs.map((gig) => (
            <div key={gig.id} className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{gig.gigName}</h2>
              <p className="text-gray-600 mb-4">{gig.details}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold">{gig.totalBounty} DIAM</span>
                <span className="text-gray-500">Deadline: {new Date(gig.deadline).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">Creator: {gig.creatorAddress}</p>
              {gig.creatorAddress !== publicAdd && (
                <button
                  onClick={() => handleAcceptGig(gig.id)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Accept Gig
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}