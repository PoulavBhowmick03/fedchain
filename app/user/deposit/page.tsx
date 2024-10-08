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

// const programID = new web3.PublicKey("DdHkmXxYZeew2QpFFdPvtyne1FPTopgyvGipvozwBRk9");

// const DepositSol = () => {
//     const [program, setProgram] = useState<anchor.Program | null>(null);
//     const { connection } = useConnection();
//     const wallet = useAnchorWallet();
//     const [amount, setAmount] = useState<number>(0);
//     const [orgOwner, setOrgOwner] = useState("");

//     useEffect(() => {
//         if (wallet) {
//             const provider = new AnchorProvider(connection, wallet, {});
//             const program = new Program(idl as anchor.Idl, programID, provider);
//             setProgram(program);
//         }
//     }, [connection, wallet]);

//     const handleDeposit = async () => {
//         if (!program || !wallet || amount <= 0 || !orgOwner) return;

//         try {
//             const [userAccountPDA] = await web3.PublicKey.findProgramAddress(
//                 [Buffer.from("user"), wallet.publicKey.toBuffer()],
//                 programID
//             );

//             const [orgAccountPDA] = await web3.PublicKey.findProgramAddress(
//                 [Buffer.from("org"), new web3.PublicKey(orgOwner).toBuffer()],
//                 programID
//             );

//             // Check if user account exists
//             const userAccountInfo = await connection.getAccountInfo(userAccountPDA);
            
//             if (!userAccountInfo) {
//                 // If user account doesn't exist, create it
//                 await program.methods.registerUser()
//                     .accounts({
//                         userAccount: userAccountPDA,
//                         user: wallet.publicKey,
//                         systemProgram: web3.SystemProgram.programId,
//                     })
//                     .rpc();
//                 console.log("User account created");
//             }

//             // Proceed with deposit
//             await program.methods.depositSol(new BN(amount * web3.LAMPORTS_PER_SOL))
//                 .accounts({
//                     userAccount: userAccountPDA,
//                     user: wallet.publicKey,
//                     orgAccount: orgAccountPDA,
//                     systemProgram: web3.SystemProgram.programId,
//                 })
//                 .rpc();

//             console.log("Deposit successful!");
//         } catch (error) {
//             console.error("Error during deposit:", error);
//         }
//     };

//     return (
//         <div>
//             <WalletMultiButtonDynamic />

//             <h1>Deposit SOL</h1>
//             <input 
//                 type="number" 
//                 value={amount} 
//                 onChange={(e) => setAmount(Number(e.target.value))} 
//                 placeholder="Amount to deposit" 
//             />
//             <input 
//                 type="text" 
//                 value={orgOwner} 
//                 onChange={(e) => setOrgOwner(e.target.value)} 
//                 placeholder="Organization Owner Public Key" 
//             />
//             <button onClick={handleDeposit} disabled={!wallet || amount <= 0 || !orgOwner}>Deposit</button>
//         </div>
//     );
// };

// export default DepositSol;
import DepositSol from "@/components/DepositSol";

const DepositSolana = () => {
    return ( 
        <div>
            Hehe
        </div>
     );
}
 
export default DepositSolana;