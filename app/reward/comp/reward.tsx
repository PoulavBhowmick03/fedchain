"use client";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import styles from "@/app/reward/comp/button.module.css";
import dynamic from 'next/dynamic';
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);
const localRpcUrl = "http://localhost:8899";

export const SendSolButton: React.FC = () => {
    const { connection } = useConnection();
    const localConnection = new web3.Connection(localRpcUrl);

    const { publicKey, sendTransaction, connected, connect } = useWallet();
    const [receiverAddress, setReceiverAddress] = useState("");
    const [txSignature, setTxSignature] = useState("");

    const onClick = async () => {
        if (!connected) {
            await connect();
        }

        if (!localConnection || !publicKey) {
            alert("Please connect your wallet!");
            return;
        }

        if (!receiverAddress) {
            alert("Please enter a receiver address!");
            return;
        }

        try {
            const receiverPublicKey = new web3.PublicKey(receiverAddress);
            const transaction = new web3.Transaction();

            const instruction = web3.SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: receiverPublicKey,
                lamports: web3.LAMPORTS_PER_SOL * 1.5, // 1.5 SOL
            });

            transaction.add(instruction);

            const signature = await sendTransaction(transaction, localConnection);
            await localConnection.confirmTransaction(signature, 'confirmed');

            setTxSignature(signature);
            console.log("Transaction sent:", signature);
        } catch (error) {
            console.error("Error sending transaction:", error);
            alert("Failed to send transaction. Check console for details.");
        }
    };

    return (
        <div className={styles.buttonContainer}>
            <WalletMultiButtonDynamic/>
            <input
                type="text"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Enter receiver's wallet address"
                className={styles.input}
            />
            <button onClick={onClick} className={styles.button}>
                Send 1.5 SOL
            </button>
            {txSignature && (
                <div className={styles.signature}>
                    Transaction sent! Signature: {txSignature}
                </div>
            )}
        </div>
    );
};
