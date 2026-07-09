"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, UserPlus, Loader2, CheckCircle } from "lucide-react";
import { getUserById, sendFriendRequest, FriendUser } from "../api/friends.api";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [userId, setUserId] = useState("");
  const [preview, setPreview] = useState<FriendUser | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [invited, setInvited] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  const handleLookup = async () => {
    if (!userId.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    setPreview(null);
    setInvited(false);
    try {
      const user = await getUserById(userId.trim());
      setPreview(user);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : "User not found");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!preview) return;
    setInviteLoading(true);
    try {
      await sendFriendRequest(preview.id);
      setInvited(true);
    } catch (err) {
      setLookupError(
        err instanceof Error ? err.message : "Failed to send request",
      );
    } finally {
      setInviteLoading(false);
    }
  };

  const handleClose = () => {
    setUserId("");
    setPreview(null);
    setLookupError(null);
    setInvited(false);
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
            className="relative w-full max-w-md rounded-2xl border border-[#141C2F]/80 bg-[#090E1B] p-6 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-black text-white font-sans tracking-widest uppercase">
                Invite Operator
              </h3>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-gray-500 font-mono mb-4">
              Paste the operator's User ID to send a friend request.
            </p>

            {/* ID input + lookup */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                placeholder="e.g. d79cf718-45e7-4014-..."
                className="flex-1 h-10 px-3 rounded-xl border border-gray-800 bg-[#050812] text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-600"
              />
              <button
                onClick={handleLookup}
                disabled={lookupLoading || !userId.trim()}
                className="h-10 px-4 rounded-xl bg-[#1A253F] border border-gray-700 text-xs font-bold text-gray-300 hover:text-white hover:border-cyan-500/40 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {lookupLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Search className="w-3.5 h-3.5" />
                )}
                Look up
              </button>
            </div>

            {/* Error */}
            {lookupError && (
              <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-400 font-mono">
                {lookupError}
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div className="rounded-xl border border-[#141C2F] bg-[#050812] p-4 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-sm font-mono font-bold text-cyan-300 uppercase">
                    {preview.avatar ? (
                      <img
                        src={preview.avatar}
                        alt={preview.username}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      preview.username[0]
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      {preview.username}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {preview.points.toLocaleString()} pts · {preview.wins}W{" "}
                      {preview.losses}L
                    </p>
                  </div>
                </div>

                {invited ? (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono">
                    <CheckCircle className="w-4 h-4" />
                    Sent
                  </div>
                ) : (
                  <button
                    onClick={handleInvite}
                    disabled={inviteLoading}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A5C3F9] text-[#0A0F1D] text-xs font-black uppercase tracking-widest hover:bg-[#B7D2FC] transition-colors disabled:opacity-60"
                  >
                    {inviteLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5" />
                    )}
                    Add
                  </button>
                )}
              </div>
            )}

            <p className="text-[10px] text-gray-600 font-mono text-center">
              Share your ID from your profile page so others can find you.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
