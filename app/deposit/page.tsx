"use client"
import React, { useState } from 'react';
import DepositSol from "@/components/DepositSol";

const DepositSolana = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('');

    const openModal = (modelName: React.SetStateAction<string>) => {
        setSelectedModel(modelName);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return ( 
        <div>
            <button onClick={() => openModal('Example Model')}>Open Deposit Modal</button>
            <DepositSol
                isOpen={isModalOpen}
                onClose={closeModal}
                modelName={selectedModel}
            />
        </div>
     );
}
 
export default DepositSolana;