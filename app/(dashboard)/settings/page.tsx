"use client";
import SettingsView from "@/features/settings/SettingsView";
import { useAppState } from "@/shared/context/AppStateContext";

export default function SettingsPage() {
  const {
    profile,
    handleUpdateProfileNameAndTitle,
    handleDisconnectWallet,
    setIsWalletModalOpen,
  } = useAppState();

  return (
    <SettingsView
      profile={profile}
      onUpdateProfileNameAndTitle={handleUpdateProfileNameAndTitle}
      onDisconnectWallet={handleDisconnectWallet}
      onOpenWallet={() => setIsWalletModalOpen(true)}
    />
  );
}
