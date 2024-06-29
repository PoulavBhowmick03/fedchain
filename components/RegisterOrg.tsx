// "use client"
// import React, { useState, useEffect } from 'react';
// import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
// import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
// import idl from '@/app/idl.json';
// import * as anchor from "@project-serum/anchor";
// import dynamic from 'next/dynamic';

// const programID = new web3.PublicKey("DdHkmXxYZeew2QpFFdPvtyne1FPTopgyvGipvozwBRk9");
// const WalletMultiButtonDynamic = dynamic(
//   async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
//   { ssr: false }
// );

// export const RegisterOrg = () => {
//   const [program, setProgram] = useState<anchor.Program | null>(null);
//   const { connection } = useConnection();
//   const wallet = useAnchorWallet();
//   const [orgName, setOrgName] = useState("");

//   useEffect(() => {
//     if (wallet) {
//       const provider = new AnchorProvider(connection, wallet, {});
//       const program = new Program(idl as anchor.Idl, programID, provider);
//       setProgram(program);
//     }
//   }, [connection, wallet]);

//   const handleRegister = async () => {
//     if (!program || !wallet || !orgName) return;

//     try {
//       const orgAccount = web3.Keypair.generate();
//       await program.methods.registerOrg(orgName)
//         .accounts({
//           orgAccount: orgAccount.publicKey,
//           user: wallet.publicKey,
//           systemProgram: web3.SystemProgram.programId,
//         })
//         .signers([orgAccount])
//         .rpc();

//       console.log("Organization registered successfully!");
//     } catch (error) {
//       console.error("Error registering organization:", error);
//     }
//   };

//   return (
//     <div>
//       <WalletMultiButtonDynamic/>
//       <h1>Register Organization</h1>
//       <input 
//         type="text" 
//         value={orgName} 
//         onChange={(e) => setOrgName(e.target.value)} 
//         placeholder="Organization Name" 
//       />
//       <button onClick={handleRegister} disabled={!wallet}>Register</button>
//     </div>
//   );
// };
"use client"
import React, { useState, useEffect } from 'react';
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import idl from '@/app/idl.json';
import * as anchor from "@project-serum/anchor";

const programID = new web3.PublicKey("8iCZiBVfJEw2kQk4FSLcxoJiUJCgDUdX6pgAGFUuz2eE");
export default function RegisterOrg() {
  const [program, setProgram] = useState<anchor.Program | null>(null);
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [orgName, setOrgName] = useState("");

  useEffect(() => {
    if (wallet) {
      const provider = new AnchorProvider(connection, wallet, {});
      const program = new Program(idl as anchor.Idl, programID, provider);
      setProgram(program);
    }
  }, [connection, wallet]);

  const handleRegister = async () => {
    if (!program || !wallet || !orgName) return;

    try {
      const [orgAccountPDA] = await web3.PublicKey.findProgramAddress(
        [Buffer.from("org"), wallet.publicKey.toBuffer()],
        programID
      );

      await program.methods.registerOrg(orgName)
        .accounts({
          orgAccount: orgAccountPDA,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      console.log("Organization registered successfully!");
    } catch (error) {
      console.error("Error registering organization:", error);
    }
  };

  return (
    <div>
      <h1>Register Organization</h1>
      <input
        type="text"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        placeholder="Organization Name"
      />
      <button onClick={handleRegister} disabled={!wallet}>Register</button>
    </div>
  );
};