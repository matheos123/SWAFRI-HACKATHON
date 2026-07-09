"use client";
import SettingsView from "@/features/settings/SettingsView";
import { useAppState } from "@/shared/context/AppStateContext";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function SettingsPage() {
  const { setIsWalletModalOpen, handleDisconnectWallet } = useAppState();
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <SettingsView
      profile={user}
      onUpdateProfileNameAndTitle={() => {}}
      onDisconnectWallet={handleDisconnectWallet}
      onOpenWallet={() => setIsWalletModalOpen(true)}
    />
  );
}
