"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, UserPlus, Loader2, CheckCircle } from "lucide-react";
import { getUserById, getLeaderboardUsers, sendFriendRequest, FriendUser } from "../api/friends.api";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [leaderboardUsers, setLeaderboardUsers] = useState<FriendUser[]>([]);
  const [displayedUsers, setDisplayedUsers] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitedIds, setInvitedIds] = useState<Set<string>>(new Set());
  const [inviteLoadingId, setInviteLoadingId] = useState<string | null>(null);

  // Fetch leaderboard users when modal opens to populate initial list
  useEffect(() => {
    if (!isOpen) return;

    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const lb = await getLeaderboardUsers(50, 0);
        const mapped: FriendUser[] = lb.map((u) => ({
          id: u.userId,
          username: u.username,
          avatar: u.avatar,
          walletAddress: u.walletAddress,
          wins: u.wins,
          losses: u.losses,
          totalMatches: u.totalMatches,
          points: u.points,
        }));
        setLeaderboardUsers(mapped);
        setDisplayedUsers(mapped);
      } catch (err) {
        // It's okay if it fails, maybe show an error
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [isOpen]);

  // Handle search (client-side filter + exact ID lookup via API)
  useEffect(() => {
    if (!isOpen) return;

    const query = searchQuery.trim();
    if (!query) {
      setDisplayedUsers(leaderboardUsers);
      setError(null);
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const executeSearch = async () => {
      let results = leaderboardUsers.filter((u) =>
        u.username.toLowerCase().includes(query.toLowerCase())
      );

      // If it looks like a User ID, try to fetch it directly
      if (uuidRegex.test(query)) {
        setLoading(true);
        try {
          const user = await getUserById(query);
          // Prepend if not already in the list
          if (!results.find((u) => u.id === user.id)) {
            results = [user, ...results];
          }
          setError(null);
        } catch (err) {
          if (results.length === 0) {
            setError("No user found with that exact ID.");
          }
        } finally {
          setLoading(false);
        }
      }

      setDisplayedUsers(results);
    };

    const delayDebounceFn = setTimeout(() => {
      executeSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, leaderboardUsers, isOpen]);

  const handleInvite = async (userId: string) => {
    setInviteLoadingId(userId);
    try {
      await sendFriendRequest(userId);
      setInvitedIds((prev) => new Set(prev).add(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request");
    } finally {
      setInviteLoadingId(null);
    }
  };

  const handleClose = () => {
    setSearchQuery("");
    setLeaderboardUsers([]);
    setDisplayedUsers([]);
    setError(null);
    setInvitedIds(new Set());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md rounded-2xl border border-[#141C2F]/80 bg-[#090E1B] p-6 shadow-2xl flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <h3 className="text-sm font-black text-white font-sans tracking-widest uppercase">
                Invite Operator
              </h3>
              <button
              aria-label="Close modal"
                onClick={handleClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 font-mono mb-4 shrink-0">
              Search by username or paste an exact User ID.
            </p>

            {/* Search Input */}
            <div className="flex gap-2 mb-4 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search username or UUID..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-800 bg-[#050812] text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-600"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-400 font-mono shrink-0">
                {error}
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0 pr-1 custom-scrollbar">
              {loading && displayedUsers.length === 0 ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-500/50" />
                </div>
              ) : displayedUsers.length === 0 ? (
                <div className="text-center p-8 text-xs text-gray-500 font-mono">
                  No users found.
                </div>
              ) : (
                displayedUsers.map((user) => {
                  const isInvited = invitedIds.has(user.id);
                  const isInviting = inviteLoadingId === user.id;

                  return (
                    <div
                      key={user.id}
                      className="rounded-xl border border-[#141C2F] bg-[#050812] p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm font-mono font-bold text-cyan-300 uppercase shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            user.username[0]
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white uppercase tracking-wider truncate">
                            {user.username}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                            {user.points?.toLocaleString() ?? 0} pts · {user.wins ?? 0}W {user.losses ?? 0}L
                          </p>
                        </div>
                      </div>

                      {isInvited ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono shrink-0 px-2">
                          <CheckCircle className="w-4 h-4" />
                          Sent
                        </div>
                      ) : (
                        <button
                          onClick={() => handleInvite(user.id)}
                          disabled={isInviting || !!inviteLoadingId}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A5C3F9] text-[#0A0F1D] text-xs font-black uppercase tracking-widest hover:bg-[#B7D2FC] transition-colors disabled:opacity-60"
                        >
                          {isInviting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <UserPlus className="w-3.5 h-3.5" />
                          )}
                          Add
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
