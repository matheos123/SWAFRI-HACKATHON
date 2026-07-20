"use client";
import { useEffect, useMemo, useState } from "react";
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
  Swords,
} from "lucide-react";
import { useFriendsStore } from "@/features/friends/store/friends.store";
import type { GameInvite } from "@/features/friends/store/friends.store";
import InviteModal from "@/features/friends/components/InviteModal";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useSocketStore } from "@/features/game/store/socket.store";
import { useRouter } from "next/navigation";
import SquadView from "@/features/friends/SquadView";
import { useSquadStore } from "@/features/friends/store/squad.store";

export default function FriendsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    friends,
    requests,
    gameInvites,
    isLoading,
    loadFriends,
    loadRequests,
    acceptRequest,
    blockRequest,
    removeFriend,
    declineGameInvite,
    sendGameChallenge,
    loadOutgoingRequests,
    outgoingRequests,
  } = useFriendsStore();
  const { setMatchData } = useSocketStore();

  const {
    squad,
    squads,
    activeSquadName,
    squadMembers,
    setActiveSquad,
    initializeSquad,
    updateSquadName,
    addMember,
    kickMember,
    toggleMute,
  } = useSquadStore();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"friends" | "requests" | "squad">(
    "squad",
  );
  const [challengingId, setChallengingId] = useState<string | null>(null);
  const [challengeMessage, setChallengeMessage] = useState<string | null>(null);

  useEffect(() => {
    loadFriends();
    loadRequests();
    loadOutgoingRequests();
    // Use the new API-backed loadSquads from the store
    if ((useSquadStore.getState() as any).loadSquads) {
      (useSquadStore.getState() as any).loadSquads();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSendChallenge = async (friendId: string, username: string) => {
    setChallengingId(friendId);
    setChallengeMessage(null);
    try {
      await sendGameChallenge(friendId);
      setChallengeMessage(`⚔️ Match invitation sent to ${username}!`);
      setTimeout(() => setChallengeMessage(null), 4000);
    } catch (err: any) {
      setChallengeMessage(`Failed to send challenge: ${err?.message || "Friend is offline"}`);
      setTimeout(() => setChallengeMessage(null), 4000);
    } finally {
      setChallengingId(null);
    }
  };

  const handleAcceptInvite = (invite: GameInvite) => {
    setMatchData({
      roomId: invite.roomId,
      matchId: invite.matchId,
      isRanked: invite.isRanked ?? false,
      opponent: { userId: invite.senderId, username: invite.username },
    });
    declineGameInvite(invite.id);
    router.push(`/match/${invite.matchId}`);
  };

  const handleInitializeSquad = (
    name: string,
    privacy: "Public" | "Encrypted",
  ) => {
    if (!user) return;

    initializeSquad(name, privacy, {
      id: user.id,
      username: user.username,
    });
  };

  const uniqueFriends = useMemo(() => {
    const seen = new Set<string>();

    return friends.filter((friend) => {
      const key = friend.friendId || friend.id;
      if (!key || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }, [friends]);

  const availableFriends = useMemo(
    () =>
      uniqueFriends.filter(
        (friend) => !squadMembers.some((member) => member.id === friend.friendId),
      ),
    [uniqueFriends, squadMembers],
  );

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

      {/* Challenge Toast Banner */}
      {challengeMessage && (
        <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/20 px-4 py-3 text-xs font-mono text-cyan-300 flex items-center justify-between shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <span>{challengeMessage}</span>
          <button
            onClick={() => setChallengeMessage(null)}
            className="text-cyan-500 hover:text-cyan-300 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-[#111A2E] p-1 rounded-lg border border-gray-800 w-fit">
        <button
          onClick={() => setActiveTab("squad")}
          className={`flex items-center gap-2 px-4 py-2 rounded text-[11px] font-bold font-mono uppercase tracking-wider transition-colors ${
            activeTab === "squad"
              ? "bg-[#1D2B4D] text-white shadow"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-cyan-500/80" />
          Squad Command
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-2 px-4 py-2 rounded text-[11px] font-bold font-mono uppercase tracking-wider transition-colors ${
            activeTab === "friends"
              ? "bg-[#1D2B4D] text-white shadow"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Friends ({uniqueFriends.length})
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
          {requests.length + gameInvites.length > 0 && (
            <span className="ml-1 w-4 h-4 rounded-full bg-cyan-500 text-black text-[9px] font-black flex items-center justify-center">
              {requests.length + gameInvites.length}
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
          {/* Squad view */}
          {activeTab === "squad" && (
            <SquadView
              squad={squad}
              squads={squads}
              activeSquadName={activeSquadName}
              squadMembers={squadMembers}
              availableFriends={availableFriends}
              onSelectSquad={setActiveSquad}
              onUpdateSquadName={updateSquadName}
              onAddMember={(friend) =>
                addMember({
                  id: friend.friendId,
                  username: friend.username,
                  avatarUrl: friend.avatar ?? undefined,
                })
              }
              onKickMember={kickMember}
              onToggleMute={toggleMute}
              onInitializeSquad={handleInitializeSquad}
            />
          )}

          {/* Friends list */}
          {activeTab === "friends" && (
            <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 overflow-hidden">
              {uniqueFriends.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-mono">
                    No allies yet. Add friends to build your squad.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-900/40">
                  {uniqueFriends.map((f, index) => (
                    <motion.div
                      key={`${f.friendId}-${index}`}
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendChallenge(f.friendId, f.username)}
                          disabled={challengingId === f.friendId}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-500/50 transition-colors text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50"
                          title="Challenge friend to a Rock Paper Scissors match"
                        >
                          {challengingId === f.friendId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Swords className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                          <span>Challenge</span>
                        </button>
                        <button
                          onClick={() => removeFriend(f.friendId)}
                          className="p-2 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-950/20 hover:border-rose-500/40 transition-colors"
                          title="Remove friend"
                        >
                          <UserMinus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Requests list */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              {requests.length === 0 && gameInvites.length === 0 ? (
                <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-12 text-center">
                  <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-mono">
                    No pending requests or invitations.
                  </p>
                </div>
              ) : (
                <>
                  {/* Game Invites */}
                  {gameInvites.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest px-2">
                        Battle Arena Invitations
                      </h3>
                      <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 overflow-hidden divide-y divide-gray-900/40">
                        {gameInvites.map((invite) => (
                          <motion.div
                            key={invite.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center justify-between px-5 py-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm font-mono font-bold text-cyan-300 uppercase">
                                {invite.avatar ? (
                                  <img
                                    src={invite.avatar}
                                    alt={invite.username}
                                    className="w-full h-full object-cover rounded-xl"
                                  />
                                ) : (
                                  invite.username[0]
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-white uppercase tracking-wider">
                                  {invite.username}
                                </p>
                                <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
                                  invited you to a battle match{" "}
                                  {invite.isRanked ? " (Ranked)" : ""}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAcceptInvite(invite)}
                                className="p-2 rounded-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-950/20 transition-colors"
                                title="Accept Match"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => declineGameInvite(invite.id)}
                                className="p-2 rounded-xl border border-gray-700 text-gray-500 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                                title="Decline"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Friend Requests */}
                  {/* Requests tab */}
                  {activeTab === "requests" && (
                    <div className="space-y-8">
                      {/* Incoming Friend Requests */}
                      {requests.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            INCOMING REQUESTS
                          </h3>
                          <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 overflow-hidden divide-y divide-gray-900/40">
                            {requests.map((r) => (
                              <motion.div
                                key={r.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-between px-5 py-4 hover:bg-[#101726]/30"
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
                                    <p className="text-[10px] text-gray-500 font-mono">
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
                        </div>
                      )}

                      {/* Outgoing Friend Requests */}
                      {outgoingRequests.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <UserPlus className="w-3.5 h-3.5" />
                            OUTGOING REQUESTS
                          </h3>
                          <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 overflow-hidden divide-y divide-gray-900/40">
                            {outgoingRequests.map((r) => (
                              <motion.div
                                key={r.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-between px-5 py-4 hover:bg-[#101726]/30"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-mono font-bold text-emerald-300 uppercase">
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
                                    <p className="text-[10px] text-gray-500 font-mono">
                                      Request sent • Pending
                                    </p>
                                  </div>
                                </div>

                                <span className="text-xs px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
                                  Pending
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty State */}
                      {requests.length === 0 &&
                        outgoingRequests.length === 0 &&
                        gameInvites.length === 0 && (
                          <div className="rounded-2xl border border-slate-800/80 bg-[#0C1220]/50 p-12 text-center">
                            <Clock className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                            <p className="text-sm text-gray-500 font-mono">
                              No pending requests or invitations.
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </>
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
