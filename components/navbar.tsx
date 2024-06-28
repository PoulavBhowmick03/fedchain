"use client";
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar";
import { cn } from "@/utils/cn";
import { WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Connection } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />

    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const wallet= useWallet();
  const walletModal = useWalletModal();
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <div>
          <a href="/">Home</a>
        </div>
        <MenuItem setActive={setActive} active={active} item="Products">
        <HoveredLink href="/dash">Dashboard</HoveredLink>
        </MenuItem>
        <div>
        <HoveredLink href="/auth">Login</HoveredLink>
        </div>
        
      </Menu>
      
    </div>
  );
}
