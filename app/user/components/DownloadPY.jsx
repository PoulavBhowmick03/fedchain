// "use client"

// import React from 'react';
// import { useState } from 'react';
// import axios from 'axios'

// const CID = 'QmVKWgozBZ4rxYSwmBXzXbxizoXiSVcvYjpzN88FvHdXjr';

// const DownloadPage = () => {
//   const fileUrl = `https://gateway.pinata.cloud/ipfs/${CID}`;
//   const [client, setClient] = useState('')

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 sm:px-48 lg:px-28 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
//       <div className="text-center">
//         <h1 className="text-3xl font-bold mb-4">Download client.py</h1>
//         <p className="text-lg mb-10">
//           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
//         </p>
//         <button
//           // href={fileUrl}
//           onClick={() => {setClient('sdsd')}}
//           download="client.py"
//           className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700 mr-10"
//         >
//           Download
//         </button>
//         <button 
//           disabled={client === ''}
//           onClick={() => alert('Button clicked!')}
//           className={`bg-purple-500 text-white py-2 px-4 rounded mr-10 ${client === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
//       >Claim Rewards</button>
//       </div>
//     </div>
//   );
// };

// export default DownloadPage;
"use client"
import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const CID = 'QmVKWgozBZ4rxYSwmBXzXbxizoXiSVcvYjpzN88FvHdXjr';

const DownloadPage = () => {

  const [client, setClient] = useState('')
  const [downloaded, setDownloaded] = useState(false)
  const [user, setUser] = useState(null)

  const {publicKey} = useWallet()
  const wallet = useWallet()

  useEffect(() => {
    if (wallet.connected && publicKey) {
      setUser(publicKey.toBase58());
    }
  }, [publicKey, setUser, wallet.connected]);

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
      // setDownloaded(true)
      setTimeout(() => {
        setDownloaded(true)
      }, 1)
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file', error);
    }
  };

  const claimRewards = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/receive-list")
      console.log(res.data.value)
      setClient(res.data.value)
      console.log('user is ', user)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-16 px-4 sm:px-48 lg:px-28 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Download client.py</h1>
        <p className="text-lg mb-10">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
        </p>
        <button
          onClick={handleDownload}
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700 mr-10"
        >
          Download
        </button>
        <button 
          disabled={!downloaded}
          onClick={claimRewards}
          className={`bg-purple-500 text-white py-2 px-4 rounded mr-10 ${!downloaded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'}`}
      >Claim Rewards</button>
      </div>
    </div>
  );
};

export default DownloadPage;

