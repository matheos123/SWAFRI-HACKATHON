"use client";
import ProfileView from "@/features/profile/ProfileView";
import { useAppState } from "@/shared/context/AppStateContext";

export default function ProfilePage() {
  const { profile, badges, matches, handleOpenTxDetail, setIsWalletModalOpen } =
    useAppState();

  return (
    <ProfileView
      profile={profile}
      badges={badges}
      matches={matches}
      onOpenTxDetail={handleOpenTxDetail}
      onOpenWallet={() => setIsWalletModalOpen(true)}
    />
  );
}
