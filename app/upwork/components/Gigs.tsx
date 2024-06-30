/* eslint-disable react/no-unescaped-entities */
// components/Gigs.tsx
import React from 'react';

interface Gig {
  id: number;
  title: string;
  description: string;
  owner: string;
  proposals: string;
  location: string;
  experienceLevel: string;
  jobType: string;
  amountSpent: string;
  tags: string[];
}

const gigs: Gig[] = [
  {
    id: 1,
    title: "App Development Request",
    description: "Our business, ......app, is poised to revolutionize the way people experience wellness, dining, and nightlife. We are developing an aesthetically pleasing app that serves as a comprehensive directory for restaurants, lounges, wellness spas, and nightclubs, providing users with access to menus and the...",
    owner: "5q3kR85LGxmmXuUMbcG5N3bazZpbAAsNGJoCmoV9Kszs",
    proposals: "10 to 15",
    location: "United States",
    experienceLevel: "Intermediate",
    jobType: "Hourly",
    amountSpent: "$0 spent",
    tags: ["App Development", "Smart Contract", "Web Development", "Blockchain", "Web Application"]
  },
  {
    id: 2,
    title: "Ethereum Bundle Transaction",
    description: "We are currently looking for Web3 Developer who can create a bundling bot in ERC-20.",
    owner: "4h3kG85LGrnmHuUMbcH5N4bazZpbACsNGJrDmoV9Jszs",
    proposals: "5 to 10",
    location: "Indonesia",
    experienceLevel: "Intermediate",
    jobType: "Hourly",
    amountSpent: "$0 spent",
    tags: ["Blockchain Development", "Smart Contract Development", "web3.js", "Back-End Development", "Bot Development"]
  }
];

const Gigs: React.FC = () => {
  return (
    <div className="container p-10 ml-36 bg-gradient-to-r from-slate-900 to-slate-700">
      <div className="grid grid-cols-1 gap-6">
        {gigs.map((gig) => (
          <div key={gig.id} className="shadow-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{gig.title}</h2>
            <p className="text-gray-700 mb-4">{gig.description}</p>
            <p className="text-gray-600 mb-2"><strong>Owner's Wallet:</strong> {gig.owner}</p>
            <p className="text-gray-600 mb-2"><strong>Proposals:</strong> {gig.proposals}</p>
            <p className="text-gray-600 mb-2"><strong>Location:</strong> {gig.location}</p>
            <p className="text-gray-600 mb-2"><strong>Experience Level:</strong> {gig.experienceLevel}</p>
            <p className="text-gray-600 mb-2"><strong>Job Type:</strong> {gig.jobType}</p>
            <p className="text-gray-600 mb-4"><strong>Amount Spent:</strong> {gig.amountSpent}</p>
            <div className="flex flex-wrap mb-4">
              {gig.tags.map((tag, index) => (
                <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2 mb-2">{tag}</span>
              ))}
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gigs;
