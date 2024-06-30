'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHome, FaHistory, FaMoneyBill, FaRobot, FaUser } from "react-icons/fa";
import WalletContextProvider from '@/components/WaletContextProvider';
import dynamic from 'next/dynamic';

const WalletDisconnectButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
  { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Sidebar = () => {
  const wallet = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <WalletContextProvider>
      <div className="bg-gray-900 flex h-screen fixed w-16 sm:w-auto flex-col justify-between border-e-2">
        <div>
          <div className="inline-flex size-16 items-center justify-between px-4 py-3 md:mt-4 md:px-6 md:py-4">
            <button
              className="block md:hidden text-gray-500 focus:outline-none"
              onClick={toggleMenu}
            >
            
            </button>
          </div>
          <div className="border-t border-gray-500">
            <div
              className={`px-2 md:px-4 ${isMenuOpen
                ? 'absolute top-14 left-0 w-full   md:static md:border-none'
                : 'hidden md:block'
                }`}
            >
              <div className="py-4 md:py-6">
                <a
                  href="/"
                  className="group relative flex justify-center rounded bg-gray-900 px-2 py-1.5 hover:bg-gray-50 hover:text-blue-700 active:text-blue-700 md:justify-start"
                >
                  <FaHome className='h-6 w-6' />
                  <span className="absolute top-1/2 ms-10 -translate-y-1/2 rounded px-6 mx-10 py-1.5 text-xl font-medium text-white hover:text-gray-800">
                    General
                  </span>
                </a>
              </div>
              <ul className="space-y-1 border-t pt-4 md:border-none md:pt-6">
                <li>
                  <a
                    href="/organisation/dash/generate"
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-700 active:text-blue-700 md:justify-start"
                  >
                    <FaHistory className='h-6 w-6' />
                    <span className="absolute top-1/2 ms-10 -translate-y-1/2 rounded px-6 mx-10 py-1.5 text-xl font-medium text-white hover:text-gray-800">
                      Generate
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/organisation/dash/subscription"
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-700 active:text-blue-700 md:justify-start"
                  >
                    <FaMoneyBill className='h-6 w-6' />
                    <span className="absolute top-1/2 ms-10 -translate-y-1/2 rounded px-6 mx-10 py-1.5 text-xl font-medium text-white hover:text-gray-800">
                      Premium
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/organisation/upload"
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-700 active:text-blue-700 md:justify-start"
                  >
                    <FaRobot className='h-6 w-6' />
                    <span className="absolute top-1/2 ms-10 -translate-y-1/2 rounded px-6 mx-10 py-1.5 text-xl font-medium text-white hover:text-gray-800">
                      Upload
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/organisation/dash"
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-blue-700 active:text-blue-700 md:justify-start"
                  >
                    <FaUser className='h-6 w-6' />
                    <span className="absolute top-1/2 ms-10 -translate-y-1/2 rounded px-6 mx-10 py-1.5 text-xl font-medium text-white hover:text-gray-800">
                      Account
                    </span>
                  </a>
                </li>
              </ul>
              <br />
              <WalletMultiButtonDynamic />

            </div>
          </div>
        </div>
      </div>
    </WalletContextProvider>
  );
};

export default Sidebar;
