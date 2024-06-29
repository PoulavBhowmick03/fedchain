"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import idl from "@/app/idl.json";
import dynamic from 'next/dynamic';
import * as anchor from "@project-serum/anchor";

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");
const localRpcUrl = "http://localhost:8899";

const RewardUser = () => {
    const [program, setProgram] = useState<anchor.Program | null>(null);
    const { connection } = useConnection();
    const localConnection = new web3.Connection(localRpcUrl);

    const wallet = useAnchorWallet();
    const [rewardAmount, setRewardAmount] = useState<number>(0);
    const [userAddress, setUserAddress] = useState<string>("");

    useEffect(() => {
        if (wallet) {
            const provider = new AnchorProvider(localConnection, wallet, {
                preflightCommitment: "processed"
            }); 
            const program = new Program(idl as anchor.Idl, programID, provider);
            setProgram(program);
        }
    }, [connection, wallet]);

    const handleReward = async () => {
        if (!program || !wallet || rewardAmount <= 0 || !userAddress) return;

        try {
            const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
                [Buffer.from("user"), new web3.PublicKey(userAddress).toBuffer()],
                programID
            );

            const [orgAccountPDA] = await web3.PublicKey.findProgramAddress(
                [Buffer.from("org"), wallet.publicKey.toBuffer()],
                programID
            );

            // Fetch user's deposit amount to calculate the reward
            const userAccount = await program.account.userAccount.fetch(userAccountPDA);
            const depositAmount = userAccount.depositAmount.toNumber();

            const rewardAmount = depositAmount * 1.5;

            await program.methods.rewardUser(new BN(rewardAmount))
                .accounts({
                    userAccount: userAccountPDA,
                    user: new web3.PublicKey(userAddress),
                    orgAccount: orgAccountPDA,
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            console.log("Reward sent successfully!");
        } catch (error) {
            console.error("Error during reward:", error);
        }
    };

    return (
        <div>
            <WalletMultiButtonDynamic />

            <h1>Reward User</h1>
            <input
                className='text-black'
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="User Public Key"
            />
            <button onClick={handleReward} disabled={!wallet || rewardAmount <= 0 || !userAddress}>Reward</button>
        </div>
    );
};

export default RewardUser;

// "use client"
// import React, { useState, useEffect } from 'react';
// import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
// import idl from "@/app/idl.json";
// import dynamic from 'next/dynamic';
// import * as anchor from "@project-serum/anchor";

// const WalletMultiButtonDynamic = dynamic(
//     async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
//     { ssr: false }
// );

// const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");

// const RewardUser = () => {
//     const [program, setProgram] = useState<anchor.Program | null>(null);
//     const { connection } = useConnection();
//     const wallet = useAnchorWallet();
//     const [orgOwner, setOrgOwner] = useState("");
//     const [userDepositAmount, setUserDepositAmount] = useState<number | null>(null);
//     const [orgExists, setOrgExists] = useState(false);

//     useEffect(() => {
//         if (wallet) {
//             const provider = new AnchorProvider(connection, wallet, {});
//             const program = new Program(idl as anchor.Idl, programID, provider);
//             setProgram(program);
//         }
//     }, [connection, wallet]);

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     const fetchUserDepositAmount = async () => {
//         if (!program || !wallet) return;

//         try {
//             const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
//                 [Buffer.from("user"), wallet.publicKey.toBuffer()],
//                 programID
//             );

//             const userAccount = await program.account.userAccount.fetch(userAccountPDA);
//             setUserDepositAmount(userAccount.depositAmount as number);
//             // setUserDepositAmount(userAccount.depositAmount.toNumber());
//         } catch (error) {
//             console.error("Error fetching user deposit amount:", error);
//         }
//     };

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     const checkOrgExists = async () => {
//         if (!program || !orgOwner) return;

//         try {
//             const [orgAccountPDA] = await web3.PublicKey.findProgramAddress(
//                 [Buffer.from("org"), new web3.PublicKey(orgOwner).toBuffer()],
//                 programID
//             );

//             await program.account.orgAccount.fetch(orgAccountPDA);
//             setOrgExists(true);
//         } catch (error) {
//             console.error("Organization does not exist:", error);
//             setOrgExists(false);
//         }
//     };

//     useEffect(() => {
//         fetchUserDepositAmount();
//     }, [fetchUserDepositAmount, program, wallet]);

//     useEffect(() => {
//         checkOrgExists();
//     }, [program, orgOwner, checkOrgExists]);

//     const handleReward = async () => {
//         if (!program || !wallet || !orgOwner || userDepositAmount === null || !orgExists) return;

//         try {
//             const [userAccountPDA] = await web3.PublicKey.findProgramAddressSync(
//                 [Buffer.from("user"), wallet.publicKey.toBuffer()],
//                 programID
//             );

//             const [orgAccountPDA] = await web3.PublicKey.findProgramAddressSync(
//                 [Buffer.from("org"), new web3.PublicKey(orgOwner).toBuffer()],
//                 programID
//             );

//             const rewardAmount = userDepositAmount * 10; // 10 times the deposit amount

//             await program.methods.rewardUser(new BN(rewardAmount))
//                 .accounts({
//                     userAccount: userAccountPDA,
//                     orgAccount: orgAccountPDA,
//                     user: wallet.publicKey,
//                     systemProgram: web3.SystemProgram.programId,
//                 })
//                 .rpc();

//             console.log("Reward successful!");
//             setUserDepositAmount(0); // Reset deposit amount after reward
//         } catch (error) {
//             console.error("Error during reward:", error);
//         }
//     };

//     return (
//         <div>
//             <WalletMultiButtonDynamic />

//             <h1>Reward User</h1>
//             <p>Current Deposit Amount: {userDepositAmount !== null ? userDepositAmount / web3.LAMPORTS_PER_SOL : 'Loading...'} SOL</p>
//             <input 
//                 type="text" 
//                 value={orgOwner} 
//                 onChange={(e) => setOrgOwner(e.target.value)} 
//                 placeholder="Organization Owner Public Key" 
//             />
//             <button onClick={handleReward} disabled={!wallet || !orgOwner || userDepositAmount === null || userDepositAmount === 0 || !orgExists}>
//                 Reward User
//             </button>
//             {!orgExists && orgOwner && <p>Organization does not exist. Please register the organization first.</p>}
//         </div>
//     );
// };

// export default RewardUser;

// "use client"
// import React, { useState, useEffect } from 'react';
// import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
// import idl from "@/app/idl.json"; // Make sure this path is correct
// import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
// import * as anchor from "@project-serum/anchor";

// const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");

// const RewardUser = () => {
//     const [program, setProgram] = useState<anchor.Program | null>(null);
//     const { connection } = useConnection();
//     const wallet = useAnchorWallet();
//     const [userToReward, setUserToReward] = useState("");
//     const [rewardAmount, setRewardAmount] = useState<number>(0);

//     useEffect(() => {
//         if (wallet) {
//             const provider = new AnchorProvider(connection, wallet, {});
//             const program = new Program(idl as anchor.Idl, programID, provider);
//             setProgram(program);
//         }
//     }, [connection, wallet]);

//     const handleReward = async () => {
//         if (!program || !wallet || !userToReward || rewardAmount <= 0) return;

//         try {
//             const rewardAmountLamports = new BN(rewardAmount * web3.LAMPORTS_PER_SOL);

//             await program.methods.rewardUser(rewardAmountLamports)
//                 .accounts({
//                     userAccount: new web3.PublicKey(userToReward),
//                     orgAccount: wallet.publicKey,
//                     user: new web3.PublicKey(userToReward),
//                     systemProgram: web3.SystemProgram.programId,
//                 })
//                 .rpc();

//             console.log("Reward successful!");
//             setRewardAmount(0);
//             setUserToReward("");
//         } catch (error) {
//             console.error("Error during reward:", error);
//         }
//     };

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-4">Reward User</h1>
//             <WalletMultiButton className="mb-4" />

//             <div className='text-black'>
//                 <input 
//                     type="text" 
//                     value={userToReward} 
//                     onChange={(e) => setUserToReward(e.target.value)} 
//                     placeholder="User Public Key to Reward" 
//                     className="w-full p-2 mb-2 border rounded"
//                 />
//                 <input 
//                     type="number" 
//                     value={rewardAmount} 
//                     onChange={(e) => setRewardAmount(parseFloat(e.target.value))} 
//                     placeholder="Reward Amount in SOL" 
//                     className="w-full p-2 mb-2 border rounded"
//                 />
//                 <button 
//                     onClick={handleReward} 
//                     disabled={!wallet || !userToReward || rewardAmount <= 0}
//                     className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
//                 >
//                     Reward User
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default RewardUser;