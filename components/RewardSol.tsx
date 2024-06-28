'use client'
import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Program, AnchorProvider, web3,  } from '@project-serum/anchor'
import idl from '../app/idl.json'
import BN from 'bn.js'
import { PublicKey,SystemProgram } from '@solana/web3.js'


const programID = new web3.PublicKey("8nDcKiH4thwNKiH4rW12kVVqtYhWN7wzSrzANeLGp1dj")

export default function RewardUser() {
  const [rewardAmount, setRewardAmount] = useState('')
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [userAddress, setUserAddress] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) return

    const provider = new AnchorProvider(connection, window.solana, {})
    const program = new Program(idl as any, programID, provider)

    try {
      const userAccount = await program.account.userAccount.fetch(publicKey)
      const tx = await program.methods.rewardUser(new BN(parseFloat(rewardAmount) * web3.LAMPORTS_PER_SOL))
      .accounts({
        userAccount: new PublicKey(userAddress),
        platform: publicKey,
        user: new PublicKey(userAddress),
        systemProgram: SystemProgram.programId,
      })
.transaction()

      const txSignature = await sendTransaction(tx, connection)
      await connection.confirmTransaction(txSignature)
      console.log("User rewarded successfully")
    } catch (error) {
      console.error("Error rewarding user:", error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Reward User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={rewardAmount}
          onChange={(e) => setRewardAmount(e.target.value)}
          placeholder="Reward Amount in SOL"
          className="w-full p-2 mb-4 border rounded"
        />
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
          Reward User
        </button>
      </form>
    </div>
  )
}