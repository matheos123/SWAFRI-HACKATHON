"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, UserPlus, Check, SlidersHorizontal } from "lucide-react";
import { InviteSquad } from "@/shared/types";


interface RecruitSquadModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: InviteSquad[];
  onInvite: (id: string) => void;
}

export default function InviteModal({
  isOpen,
  onClose,
  candidates,
  onInvite,
}: RecruitSquadModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"recent" | "all">("recent");

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Blur Background Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg bg-[#0A0F1D] border border-cyan-500/20 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden z-10 font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#141C2F]">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                  RECRUIT_SQUAD
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-6 border-b border-[#141C2F]/50 bg-[#070A13]">
              <button
                onClick={() => setActiveTab("recent")}
                className={`py-3 px-1 font-mono text-[10px] uppercase tracking-widest relative ${
                  activeTab === "recent"
                    ? "text-cyan-400 font-bold"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                RECENT_OPS
                {activeTab === "recent" && (
                  <motion.div
                    layoutId="modal-active-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400"
                  />
                )}
              </button>
            </div>

            {/* Main Interactive Panel */}
            <div className="p-6 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="FILTER BY OPERATOR TAG..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#050812] border border-[#141C2F] rounded-xl pl-11 pr-4 py-3 text-xs font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all uppercase tracking-wider"
                />
              </div>

              {/* Recruits List */}
              <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredCandidates.length > 0 ? (
                  filteredCandidates.map((candidate) => {
                    const isOffline = candidate.status === "OFFLINE";
                    return (
                      <div
                        key={candidate.id}
                        className="flex items-center justify-between p-3.5 bg-[#080D1A]/80 border border-[#141C2F]/60 rounded-xl hover:border-cyan-500/25 transition-all group"
                      >
                        {/* Avatar + Meta details */}
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={candidate.avatarUrl}
                              alt={candidate.username}
                              referrerPolicy="no-referrer"
                              className={`w-10 h-10 rounded-lg object-cover border border-gray-800 group-hover:border-cyan-500/30 transition-colors ${
                                isOffline ? "grayscale opacity-50" : ""
                              }`}
                            />
                            {/* Connection Indicator status dot */}
                            <div
                              className={`absolute bottom-[-2px] right-[-2px] w-3 h-3 rounded-full border-2 border-[#0A0F1D] ${
                                isOffline
                                  ? "bg-gray-600"
                                  : candidate.status === "READY"
                                    ? "bg-emerald-500"
                                    : candidate.status === "IN_LOBBY"
                                      ? "bg-cyan-400"
                                      : "bg-amber-400"
                              }`}
                            />
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                              {candidate.username}
                            </h4>
                            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">
                              {isOffline ? (
                                "OFFLINE"
                              ) : (
                                <>
                                  LVL {candidate.level}{" "}
                                  <span className="mx-1">•</span>{" "}
                                  <span className="text-cyan-400/80">
                                    {candidate.status}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Invite / Status Button */}
                        <div>
                          {isOffline ? (
                            <span className="text-[10px] font-mono text-gray-600 font-bold uppercase tracking-widest px-3 py-1.5 bg-gray-950/40 rounded-lg border border-transparent">
                              OFFLINE
                            </span>
                          ) : candidate.invited ? (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest px-3 py-1.5 bg-emerald-950/20 rounded-lg border border-emerald-500/25">
                              <Check className="w-3.5 h-3.5" />
                              INVITED
                            </span>
                          ) : (
                            <button
                              onClick={() => onInvite(candidate.id)}
                              className="text-[10px] font-mono text-cyan-400 hover:text-white font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-lg border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 active:scale-95 transition-all"
                            >
                              INVITE
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 bg-[#050812]/50 border border-dashed border-[#141C2F] rounded-xl">
                    <p className="text-xs font-mono text-gray-600">
                      NO MATCHING TACTICAL OPERATIVES FOUND
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer decoration */}
            <div className="px-6 py-3 bg-[#050812] border-t border-[#141C2F]/50 flex justify-between items-center text-[9px] font-mono text-gray-600 uppercase tracking-widest">
              <span>ACTIVE REGISTRY CODES</span>
              <span>RNG_SEED: AF923</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
