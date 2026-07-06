"use client";
import React from "react";
import Navbar from "@/shared/components/Navbar";
import Sidebar from "@/shared/components/Sidebar";
import TxModal from "@/shared/components/TXModal";
import WalletModal from "@/shared/components/WalletModal";
import { useAppState } from "@/shared/context/AppStateContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const {
    mobileSidebarOpen,
    setMobileSidebarOpen,
    profile,
    isWalletModalOpen,
    setIsWalletModalOpen,
    isTxModalOpen,
    setIsTxModalOpen,
    selectedTxMatch,
    isQueueActive,
    handleConnectWallet,
    handleDisconnectWallet,
    handleTriggerFindMatch,
    handleLogout,
  } = useAppState();

  return (
    <div
      id="rps-arena-root"
      className="min-h-screen bg-[#070A13] text-[#F3F4F6] flex flex-col overflow-x-hidden antialiased"
    >
      <Navbar
        profile={profile}
        onOpenWallet={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={handleDisconnectWallet}
        onTriggerFindMatch={handleTriggerFindMatch}
        isQueueActive={isQueueActive}
      />

      <div className="flex flex-1 w-full">
        <Sidebar
          profile={profile}
          isOpenMobile={mobileSidebarOpen}
          setIsOpenMobile={setMobileSidebarOpen}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      <footer className="border-t border-[#141C2F]/80 bg-[#050810] py-6 px-4 sm:px-8 text-xs text-gray-500">
        <div className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h5 className="font-sans font-bold text-gray-400 uppercase tracking-widest text-[10px]">
              RPS Arena
            </h5>
            <p className="mt-1">
              © 2026 RPS Arena. Secured by Decentralized Blockchain Networks.
            </p>
          </div>
          <div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-wider">
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-cyan-400"
            >
              Terms of Service
            </a>
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-cyan-400"
            >
              Privacy Policy
            </a>
            <a
              href="#discord"
              onClick={(e) => e.preventDefault()}
              className="hover:text-cyan-400"
            >
              Discord
            </a>
            <a
              href="#docs"
              onClick={(e) => e.preventDefault()}
              className="hover:text-cyan-400"
            >
              Docs
            </a>
          </div>
        </div>
      </footer>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnectWallet}
      />
      <TxModal
        isOpen={isTxModalOpen}
        match={selectedTxMatch}
        onClose={() => setIsTxModalOpen(false)}
        walletAddress={profile.walletAddress || "0x0000...0000"}
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
