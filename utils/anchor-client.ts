import { Program, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '@/app/idl.json';  // You'll need to generate this from your Rust program

const programID = new PublicKey("8nDcKiH4thwNKiH4rW12kVVqtYhWN7wzSrzANeLGp1dj");

export const getProgram = (connection: Connection, wallet: any) => {
  const provider = new AnchorProvider(connection, wallet, {});
  return new Program(idl as any, programID, provider);
};