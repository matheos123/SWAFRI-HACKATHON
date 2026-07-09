"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  Users,
  UserCheck,
  UserX,
  UserMinus,
  Loader2,
  UserPlus,
  Clock,
  Shield,
} from "lucide-react";
import { useFriendsStore } from "@/features/friends/store/friends.store";
import InviteModal from "@/features/friends/components/InviteModal";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function FriendsPage() {
  const { user } = useAuthStore();
  const {
    friends,
    requests,
    isLoading,
    loadFriends,
    loadRequests,
    acceptRequest,
    blockRequest,
    removeFriend,
  } = useFriendsStore();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");

  useEffect(() => {
    loadFriends();
    loadRequests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white font-sans tracking-widest uppercase">
            Squad Command
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Manage your allies and incoming requests
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#A5C3F9] text-[#0A0F1D] font-black text-xs uppercase tracking-widest hover:bg-[#B7D2FC] transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Friend
        </button>
      </div>

      {/* Your User ID (so others can find you) */}
      <div className="rounded-xl border border-slate-800/80 bg-[#0C1220]/50 p-4 flex items-center gap-3">
        <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            Your User ID
          </p>
          <p className="text-xs font-mono text-gray-200 truncate mt-0.5">
            {user.id}
          </p>
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(user.id)}
          className="shrink-0 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 uppercase tracking-wider border border-cyan-500/30 px-2 py-1 rounded-lg transition-colors"
        >
          Copy
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#111A2E] p-1 rounded-lg border border-gray-800 w-fit">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-2 px-4 py-2 rounded text-[11px] font-bold font-mono uppercase tracking-wider transition-colors ${
            activeTab === "friends"
              ? "bg-[#1D2B4D] text-white shadow"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-4 py-2 rounded text-[11px] font-bold font-mono uppercase tracking-wider transition-colors ${
            activeTab === "requests"
              ? "bg-[#1D2B4D] text-white shadow"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Requests
          {requests.length > 0 && (
            <span className="ml-1 w-4 h-4 rounded-full bg-cyan-500 text-black text-[9px] font-black flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
        </div>
      ) : (
        <>
          {/* Friends list */}
          {activeTab === "friends" && (
            <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 overflow-hidden">
              {friends.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-mono">
                    No allies yet. Add friends to build your squad.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-900/40">
                  {friends.map((f) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between px-5 py-4 hover:bg-[#101726]/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm font-mono font-bold text-cyan-300 uppercase">
                          {f.avatar ? (
                            <img
                              src={f.avatar}
                              alt={f.username}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            f.username[0]
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">
                            {f.username}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate max-w-[140px]">
                            {f.friendId}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFriend(f.friendId)}
                        className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-950/20 hover:border-rose-500/40 transition-colors"
                        title="Remove friend"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Requests list */}
          {activeTab === "requests" && (
            <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 overflow-hidden">
              {requests.length === 0 ? (
                <div className="p-12 text-center">
                  <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-mono">
                    No pending requests.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-900/40">
                  {requests.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm font-mono font-bold text-indigo-300 uppercase">
                          {r.avatar ? (
                            <img
                              src={r.avatar}
                              alt={r.username}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            r.username[0]
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wider">
                            {r.username}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                            wants to join your squad
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => acceptRequest(r.id)}
                          className="p-2 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20 transition-colors"
                          title="Accept"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => blockRequest(r.id)}
                          className="p-2 rounded-xl border border-gray-700 text-gray-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                          title="Block"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}
