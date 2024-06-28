"use client"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">FL Platform</h1>
        <WalletMultiButton />
      </div>
    </header>
  )
}