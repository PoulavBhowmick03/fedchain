'use client';

import { useState } from 'react';
import { useDiamante } from '@/context/DiamanteContext';
import { useRouter } from 'next/navigation';

export default function CreateGig() {
  const [gigName, setGigName] = useState('');
  const [details, setDetails] = useState('');
  const [totalBounty, setTotalBounty] = useState('');
  const [deadline, setDeadline] = useState('');
  const { storeDiam, publicAdd } = useDiamante();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicAdd) {
      alert('Please create a Diamante address first');
      return;
    }
    try {
      const response = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gigName, details, totalBounty, deadline, creatorAddress: publicAdd }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Gig created:', result);
        await storeDiam();
        router.push('/diam/gigs');
      } else {
        const errorData = await response.json();
        console.error('Failed to create gig:', errorData.message);
      }
    } catch (error) {
      console.error('Error creating gig:', error);
    }
  };


  return (
    <div className="text-black min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create a New Gig</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="gigName" className="block text-sm font-medium text-gray-700">Gig Name</label>
            <input
              type="text"
              id="gigName"
              value={gigName}
              onChange={(e) => setGigName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={3}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="totalBounty" className="block text-sm font-medium text-gray-700">Total Bounty (DIAM)</label>
            <input
              type="number"
              id="totalBounty"
              value={totalBounty}
              onChange={(e) => setTotalBounty(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Create Gig
          </button>
        </form>
      </div>
    </div>
  );
}