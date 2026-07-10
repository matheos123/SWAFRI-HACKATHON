"use client";
import { useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  Shield,
  UserMinus,
  Mic,
  MicOff,
  UserPlus,
  Check,
  Edit2,
  Lock,
  Unlock,
  TrendingUp,
  Trophy,
  Hash,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Squad, SquadMember } from "@/shared/types";
import CreateGroupView from "@/features/friends/components/CreateGroup";
import InviteModal from "@/features/friends/components/InviteModal";

interface SquadViewProps {
  squad: Squad | null;
  squadMembers: SquadMember[];
  onUpdateSquadName: (name: string) => void;
  onUpdateSquadPrivacy: (privacy: "Public" | "Encrypted" | "Cloaked") => void;
  onKickMember: (id: string) => void;
  onToggleMute: (id: string) => void;
  onDisbandSquad: () => void;
  onInitializeSquad: (name: string, privacy: "Public" | "Encrypted") => void;
}

export default function SquadView({
  squad,
  squadMembers,
  onUpdateSquadName,
  onUpdateSquadPrivacy,
  onKickMember,
  onToggleMute,
  onDisbandSquad,
  onInitializeSquad,
}: SquadViewProps) {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState("");

  // Handle renaming action
  const startRename = () => {
    if (squad) {
      setTempName(squad.name);
      setIsRenaming(true);
    }
  };

  const saveRename = () => {
    if (tempName.trim()) {
      onUpdateSquadName(tempName.trim().toUpperCase());
      setIsRenaming(false);
    }
  };

  // Cycle privacy levels: Public -> Encrypted -> Cloaked -> Public
  const handleCyclePrivacy = () => {
    if (!squad) return;
    const privacyCycle: Record<string, "Public" | "Encrypted" | "Cloaked"> = {
      Public: "Encrypted",
      Encrypted: "Cloaked",
      Cloaked: "Public",
    };
    const nextPrivacy = privacyCycle[squad.privacy] || "Public";
    onUpdateSquadPrivacy(nextPrivacy);
  };

  // If there is no active squad, display the Create/Initialize Group protocol screen
  if (!squad) {
    return (
      <CreateGroupView
        onInitialize={onInitializeSquad}
        onCancel={() => {
          alert(
            "Combat group deployment canceled. Connecting back to standard Battle Lobby channels.",
          );
        }}
      />
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Upper Grid Layout: Left Column (Group Protocol Sidebox) & Right Column (Operators Table) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: GROUP PROTOCOL controls panel */}
        <div className="col-span-1 lg:col-span-4 xl:col-span-3 bg-[#090E1B] border border-[#141C2F]/80 rounded-2xl p-5 space-y-6">
          <div className="border-b border-[#141C2F] pb-3">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
              GROUP PROTOCOL
            </h3>
          </div>

          <div className="space-y-5">
            {/* Control: Rename Squad */}
            <div className="space-y-1">
              <button
                onClick={startRename}
                className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider hover:text-cyan-400 transition-colors w-full text-left cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-cyan-500/80" />
                <span>Rename Squad</span>
              </button>
              <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                Modify squad designation in the global registry.
              </p>

              {isRenaming && (
                <div className="mt-2.5 flex gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-[#050812] border border-[#141C2F] text-xs font-mono px-2 py-1 rounded focus:outline-none focus:border-cyan-500 text-cyan-100 uppercase tracking-wider w-full"
                    maxLength={20}
                  />
                  <button
                    onClick={saveRename}
                    className="bg-cyan-500 text-[#070A13] text-[9px] font-black uppercase px-2.5 rounded hover:bg-cyan-400 font-mono"
                  >
                    SAVE
                  </button>
                </div>
              )}
            </div>

            {/* Control: Privacy Level Toggle */}
            {/* <div className="space-y-1">
              <button
                onClick={handleCyclePrivacy}
                className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider hover:text-cyan-400 transition-colors w-full text-left"
              >
                {squad.privacy === "Public" ? (
                  <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                ) : squad.privacy === "Encrypted" ? (
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                )}
                <span>
                  Privacy Level:{" "}
                  <span className="text-cyan-400 font-mono font-bold">
                    {squad.privacy}
                  </span>
                </span>
              </button>
              <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                Toggle squad visibility: Public, Private, or Cloaked.
              </p>
            </div> */}

            {/* Control: Relinquish Command / Disband Squad */}
            {/* <div className="space-y-1">
              <button
                onClick={() => {
                  if (
                    confirm(
                      "Are you absolutely sure you want to RELINQUISH COMMAND and disband the combat squad? This will return you to group registration protocol.",
                    )
                  ) {
                    onDisbandSquad();
                  }
                }}
                className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider hover:text-rose-400 transition-colors w-full text-left"
              >
                <span className="text-base">→</span>
                <span>Relinquish Command</span>
              </button>
              <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                Transfer tactical leadership or dismantle current combat unit
                designation.
              </p>
            </div> */}
          </div>

          {/* Current Squad status summary widget */}
          <div className="pt-4 border-t border-[#141C2F] space-y-2">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
              CURRENT SQUAD
            </span>
            <div className="bg-[#10172A] border border-[#141C2F] rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-mono font-black tracking-widest text-white uppercase">
                {squad.name}
              </span>
              <span className="text-lg">{squad.insigniaUrl || "🛡️"}</span>
            </div>
          </div>
        </div>

        {/* Right Side: COMMAND CENTER Main space */}
        <div className="col-span-1 lg:col-span-8 xl:col-span-9 space-y-6">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-sans font-black text-2xl text-white tracking-[0.2em] uppercase flex items-center gap-2">
                SQUAD COMMAND CENTER
              </h1>
              <p className="text-xs font-mono text-gray-400 mt-1">
                Operational Status:{" "}
                <span className="text-emerald-400 font-bold">Optimal</span>{" "}
                <span className="mx-1.5">|</span> Members:{" "}
                <span className="text-cyan-300 font-bold">
                  {squadMembers.length}/{squad.maxMembers}
                </span>
              </p>
            </div>

            {/* Invite button matching custom periwinkle design */}
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-[#A5C3F9] text-[#0A0F1D] font-black text-xs uppercase tracking-widest py-3 px-5 rounded-xl flex items-center gap-2.5 hover:bg-[#B7D2FC] shadow-[0_0_20px_rgba(165,195,249,0.2)] active:scale-95 transition-all w-full sm:w-auto justify-center font-mono select-none"
            >
              <UserPlus className="w-4 h-4 text-[#0A0F1D]" />
              <span>Invite More</span>
            </button>
          </div>

          {/* Table Container for Operators */}
          <div className="bg-[#090E1B] border border-[#141C2F]/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                {/* Table Head */}
                <thead>
                  <tr className="border-b border-[#141C2F] bg-[#050812]/50">
                    <th className="px-6 py-4.5 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-black">
                      OPERATOR
                    </th>
                    <th className="px-6 py-4.5 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-black">
                      RANK
                    </th>
                    <th className="px-6 py-4.5 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-black">
                      ROLE
                    </th>
                    <th className="px-6 py-4.5 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400 font-black text-right">
                      TACTICAL ACTIONS
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-[#141C2F]/50">
                  {squadMembers.map((member) => (
                    <tr
                      key={member.id}
                      className="hover:bg-[#101726]/10 transition-colors group"
                    >
                      {/* OPERATOR COL */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-3.5">
                          {/* Avatar icon badge style */}
                          <div className="relative w-11 h-11 rounded-xl bg-linear-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 flex items-center justify-center shrink-0">
                            <span className="text-xs font-mono font-bold text-cyan-300">
                              {member.username.substring(0, 2).toUpperCase()}
                            </span>
                            <div className="absolute inset-0 rounded-xl border border-cyan-500/5 group-hover:scale-105 transition-transform" />
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                              {member.username}
                            </h4>
                            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                              {/* Glowing dot status indicator */}
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  member.status === "online"
                                    ? "bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
                                    : member.status === "ingame"
                                      ? "bg-amber-400 shadow-[0_0_6px_#fbbf24]"
                                      : "bg-rose-500"
                                }`}
                              />
                              <span>{member.statusText || member.status}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* RANK COL */}
                      <td className="px-6 py-4.5">
                        <span className="inline-block px-3 py-1 bg-cyan-950/20 border border-cyan-500/20 rounded-lg text-[9px] font-black font-mono tracking-widest text-cyan-400">
                          {member.rank}
                        </span>
                      </td>

                      {/* ROLE COL */}
                      <td className="px-6 py-4.5">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                            member.role === "LEADER"
                              ? "text-indigo-300"
                              : "text-gray-500"
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>

                      {/* TACTICAL ACTIONS COL */}
                      <td className="px-6 py-4.5 text-right">
                        {member.role === "LEADER" ? (
                          <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest italic pr-2">
                            You (Commanding)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Audio Comms (Mute button) */}
                            <button
                              onClick={() => {
                                onToggleMute(member.id);
                                alert(
                                  `Tactical node channels updated: Operator audio communications ${member.micMuted ? "ENABLED" : "MUTED"} for ${member.username}`,
                                );
                              }}
                              title={
                                member.micMuted
                                  ? "Unmute Operative"
                                  : "Mute Operative"
                              }
                              className={`p-2 rounded-xl border transition-all ${
                                member.micMuted
                                  ? "bg-rose-950/20 border-rose-500/30 text-rose-400 hover:bg-rose-950/40"
                                  : "bg-[#101726]/40 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
                              }`}
                            >
                              {member.micMuted ? (
                                <MicOff className="w-3.5 h-3.5" />
                              ) : (
                                <Mic className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Kick Operative button */}
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `ARE YOU SURE YOU WANT TO DISCHARGE OPERATIVE ${member.username} FROM YOUR SQUAD FORCE?`,
                                  )
                                ) {
                                  onKickMember(member.id);
                                }
                              }}
                              title="Kick Operative"
                              className="p-2 rounded-xl border border-gray-800 bg-[#101726]/40 text-gray-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-950/10 transition-all"
                            >
                              <UserMinus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Bento row displays (Win Rate, On Chain Wins, Global Standing) as in Image 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bento 1: Squad Win Rate */}
            <div className="bg-[#090E1B] border border-cyan-500/15 rounded-2xl p-5 shadow-[inset_0_0_15px_rgba(6,182,212,0.03)] flex flex-col justify-between h-[104px]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                SQUAD WIN RATE
              </span>
              <div className="flex items-baseline gap-2.5 mt-2">
                <span className="text-2xl font-black text-white font-mono">
                  {squad.winRate}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {squad.winRateTrend}
                </span>
              </div>
            </div>

            {/* Bento 2: Total On-Chain Wins */}
            <div className="bg-[#090E1B] border border-amber-500/15 rounded-2xl p-5 shadow-[inset_0_0_15px_rgba(245,158,11,0.03)] flex flex-col justify-between h-[104px]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                TOTAL ON-CHAIN WINS
              </span>
              <div className="mt-2">
                <span className="text-2xl font-black text-white font-mono">
                  {squad.totalOnChainWins.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bento 3: Global Standing */}
            <div className="bg-[#090E1B] border border-rose-500/15 rounded-2xl p-5 shadow-[inset_0_0_15px_rgba(244,63,94,0.03)] flex flex-col justify-between h-[104px]">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-rose-400" />
                GLOBAL STANDING
              </span>
              <div className="mt-2">
                <span className="text-2xl font-black text-rose-400 font-mono">
                  {squad.globalStanding}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recruitment Modal popup overlay */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
