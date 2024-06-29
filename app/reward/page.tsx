"use client"
import { useState } from "react";
import {SendSolButton} from "./comp/reward";



const RewardSol = () => {
    const [depositedAmount, setDepositedAmount] = useState(0);

    return (
        <div>
            <SendSolButton />
            </div>
    );
}

export default RewardSol;