"use client";
import { useState } from "react";
import { Squad, SquadMember, InviteSquad } from "@/shared/types";
import {
  initialSquad,
  initialSquadMembers,
  initialRecruitCandidates,
} from "@/constants";
import SquadView from "@/features/friends/SquadView";

export default function FriendsPage() {
  const [squad, setSquad] = useState<Squad | null>(initialSquad);
  const [squadMembers, setSquadMembers] =
    useState<SquadMember[]>(initialSquadMembers);
  const [recruitCandidates, setRecruitCandidates] = useState<InviteSquad[]>(
    initialRecruitCandidates,
  );

  const handleUpdateSquadName = (name: string) => {
    setSquad((prev) => (prev ? { ...prev, name } : null));
  };

  const handleUpdateSquadPrivacy = (
    privacy: "Public" | "Encrypted" | "Cloaked",
  ) => {
    setSquad((prev) => (prev ? { ...prev, privacy } : null));
  };

  const handleKickMember = (id: string) => {
    setSquadMembers((prev) => prev.filter((m) => m.id !== id));
    setSquad((prev) =>
      prev ? { ...prev, membersCount: prev.membersCount - 1 } : null,
    );
  };

  const handleToggleMute = (id: string) => {
    setSquadMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, micMuted: !m.micMuted } : m)),
    );
  };

  const handleDisbandSquad = () => {
    setSquad(null);
    setSquadMembers([]);
  };

  const handleInitializeSquad = (
    name: string,
    privacy: "Public" | "Encrypted",
  ) => {
    setSquad({
      name: name.toUpperCase(),
      membersCount: 1,
      maxMembers: 10,
      status: "Operational Status: Optimal",
      privacy,
      winRate: "0%",
      winRateTrend: "—",
      totalOnChainWins: 0,
      globalStanding: "—",
      insigniaUrl: "🛡️",
    });
  };

  const handleInviteCandidate = (id: string) => {
    setRecruitCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, invited: true } : c)),
    );
  };

  return (
    <SquadView
      squad={squad}
      squadMembers={squadMembers}
      recruitCandidates={recruitCandidates}
      onUpdateSquadName={handleUpdateSquadName}
      onUpdateSquadPrivacy={handleUpdateSquadPrivacy}
      onKickMember={handleKickMember}
      onToggleMute={handleToggleMute}
      onDisbandSquad={handleDisbandSquad}
      onInitializeSquad={handleInitializeSquad}
      onInviteCandidate={handleInviteCandidate}
    />
  );
}
