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

//     const fetchUserDepositAmount = async () => {
//         if (!program || !wallet) return;

//         try {
//             const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
//                 [Buffer.from("user"), wallet.publicKey.toBuffer()],
//                 programID
//             );

//             const userAccount = await program.account.userAccount.fetch(userAccountPDA);
//             setUserDepositAmount(userAccount.depositAmount.toNumber());
//         } catch (error) {
//             console.error("Error fetching user deposit amount:", error);
//         }
//     };

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
//     }, [program, wallet]);

//     useEffect(() => {
//         checkOrgExists();
//     }, [program, orgOwner]);

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
const RewardUser = () => {
    return ( 
        <div>Hi</div>
     );
}
 
export default RewardUser;