"use client"

import React from 'react';

const CID = 'QmVKWgozBZ4rxYSwmBXzXbxizoXiSVcvYjpzN88FvHdXjr';

const DownloadPage = () => {
  const fileUrl = `https://gateway.pinata.cloud/ipfs/${CID}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 sm:px-48 lg:px-28 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Download client.py</h1>
        <p className="text-lg mb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
        </p>
        <a
          href={fileUrl}
          download="client.py"
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700"
        >
          Download
        </a>
      </div>
    </div>
  );
};

export default DownloadPage;
