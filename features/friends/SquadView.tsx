"use client";
import { useState } from "react";
import {
  UserMinus,
  Mic,
  MicOff,
  UserPlus,
  Edit2,
} from "lucide-react";
import { Squad, SquadMember } from "@/shared/types";
import { Friendship } from "@/features/friends/api/friends.api";
import CreateGroupView from "@/features/friends/components/CreateGroup";
import InviteModal from "@/features/friends/components/InviteModal";

interface SquadViewProps {
  squad: Squad | null;
  squads: Squad[];
  activeSquadName: string | null;
  squadMembers: SquadMember[];
  availableFriends: Friendship[];
  onSelectSquad: (name: string) => void;
  onUpdateSquadName: (name: string) => void;
  onAddMember: (friend: Friendship) => void;
  onKickMember: (id: string) => void;
  onToggleMute: (id: string) => void;
  onInitializeSquad: (name: string, privacy: "Public" | "Encrypted") => void;
}

export default function SquadView({
  squad,
  squads,
  activeSquadName,
  squadMembers,
  availableFriends,
  onSelectSquad,
  onUpdateSquadName,
  onAddMember,
  onKickMember,
  onToggleMute,
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
      {squads.length > 1 && (
        <div className="rounded-2xl border border-slate-800/80 bg-[#090E1B] p-4">
          <label
            htmlFor="active-squad"
            className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500"
          >
            Active squad
          </label>
          <select
            id="active-squad"
            value={activeSquadName ?? squad.name}
            onChange={(event) => onSelectSquad(event.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-[#050812] px-4 py-3 text-xs font-bold uppercase tracking-wider text-cyan-300 outline-none focus:border-cyan-500/50"
          >
            {squads.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name} · {item.membersCount}/{item.maxMembers} members
              </option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-slate-500">
            Chat and squad battle controls follow the selected squad.
          </p>
        </div>
      )}

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
                    title="Squad name"
                    placeholder="Enter new squad name"
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
          <div className="rounded-2xl border border-slate-800/80 bg-[#090E1B] p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                  Squad roster management
                </h2>
                <p className="mt-1 text-[11px] text-slate-400">
                  Add accepted friends into {squad.name}. Squad chat and squad matches use this roster.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                Capacity {squadMembers.length}/{squad.maxMembers}
              </span>
            </div>

            {availableFriends.length === 0 ? (
              <div className="mt-4 rounded-xl border border-dashed border-slate-700 bg-[#050812] px-4 py-3 text-[11px] text-slate-400">
                {squadMembers.length >= squad.maxMembers
                  ? "This squad is full. Remove a member before adding another."
                  : "No eligible friends to add yet. First accept a friend request, then add them to this squad here."}
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {availableFriends.map((friend, index) => (
                  <div
                    key={`${friend.friendId}-${index}`}
                    className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#050812] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold uppercase tracking-wider text-white">
                        {friend.username}
                      </p>
                      <p className="mt-1 truncate text-[10px] font-mono text-slate-500">
                        {friend.friendId}
                      </p>
                    </div>
                    <button
                      onClick={() => onAddMember(friend)}
                      disabled={squadMembers.length >= squad.maxMembers}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-cyan-300 transition-colors hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-900 disabled:text-slate-500"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Add to squad
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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
                  {squadMembers.map((member, index) => (
                    <tr
                      key={`${member.id}-${member.role}-${index}`}
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
                                className={`w-1.5 h-1.5 rounded-full ${member.status === "online"
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
                          className={`text-[10px] font-mono uppercase tracking-wider font-bold ${member.role === "LEADER"
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
                              className={`p-2 rounded-xl border transition-all ${member.micMuted
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
