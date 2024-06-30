import React from 'react';
import Gigs from '@/app/upwork/components/Gigs'
import Sidebar from '@/app/upwork/components/Sidebargig'

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-wrap">
      <Sidebar />
      <div className="flex-grow p-6 ">
        <Gigs />
      </div>
    </div>
  );
};

export default Home;
