/* eslint-disable react/no-unescaped-entities */
// components/GigDetails.tsx
"use client"
import React from 'react';
import { useParams } from 'react-router-dom';

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

const GigDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const gig = gigs.find((g) => g.id === parseInt(id ?? ""));

  if (!gig) {
    return <div>Gig not found</div>;
  }

  return (
    <div className="container mx-auto p-10 bg-gradient-to-r from-slate-900 to-slate-700 text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
        <p className="mb-4">{gig.description}</p>
        <div className="mb-4">
          <strong>Owner's Wallet:</strong> {gig.owner}
        </div>
        <div className="mb-4">
          <strong>Proposals:</strong> {gig.proposals}
        </div>
        <div className="mb-4">
          <strong>Location:</strong> {gig.location}
        </div>
        <div className="mb-4">
          <strong>Experience Level:</strong> {gig.experienceLevel}
        </div>
        <div className="mb-4">
          <strong>Job Type:</strong> {gig.jobType}
        </div>
        <div className="mb-4">
          <strong>Amount Spent:</strong> {gig.amountSpent}
        </div>
        <div className="mb-4">
          <strong>Tags:</strong>
          <div className="flex flex-wrap mt-2">
            {gig.tags.map((tag, index) => (
              <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2 mb-2">{tag}</span>
            ))}
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Apply Now</button>
      </div>
    </div>
  );
};

export default GigDetails;
