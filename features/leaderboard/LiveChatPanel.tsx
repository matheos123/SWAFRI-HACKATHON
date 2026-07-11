"use client";

import { useEffect, useRef, useState } from "react";
import { Lock, Send } from "lucide-react";
import { useChat } from "@/features/chat/hooks/useChat";  
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getSquadRoomId, useSquadStore } from "@/features/friends/store/squad.store";

interface LiveChatPanelProps {
  roomId?: string;
  title?: string;
}

export default function LiveChatPanel({ roomId, title = "Squad Chat" }: LiveChatPanelProps) {
  const { user } = useAuthStore();
  const { squad, squads, activeSquadName, setActiveSquad } = useSquadStore();

  const activeRoomId = roomId ?? (squad ? getSquadRoomId(squad.name) : "");
  const { messages, sendMessage, joinRoom, error } = useChat(activeRoomId);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRoomId) joinRoom(activeRoomId);
  }, [activeRoomId, joinRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeRoomId) return;
    sendMessage(input);
    setInput("");
  };

  if (!activeRoomId) {
    return (
      <div className="flex-1 min-h-100 flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#0d111a]/80 p-6 text-center shadow-xl">
        <Lock className="w-8 h-8 text-slate-600 mb-3" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
          Squad Chat Locked
        </p>
        <p className="mt-2 text-[10px] text-slate-600 font-mono max-w-56">
          Create or join a squad to open a squad channel.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-100 flex flex-col rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[11px] font-bold tracking-widest text-slate-300 uppercase font-mono truncate">
            {title}
          </h3>
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wider truncate">
            {squad ? `${squad.name} Channel` : activeRoomId}
          </p>
        </div>
        {squads.length > 1 && (
          <select
            value={activeSquadName ?? squad?.name ?? ""}
            onChange={(event) => setActiveSquad(event.target.value)}
            className="max-w-28 rounded-lg border border-slate-800 bg-[#07090e] px-2 py-1 text-[9px] font-mono uppercase text-slate-300 outline-none focus:border-cyan-500/50"
            title="Switch squad chat"
          >
            {squads.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="mb-3 rounded-lg border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-[10px] text-rose-300 font-mono">
          {error}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 space-y-2.5 overflow-y-auto text-xs pr-1 custom-scrollbar">
        {messages.length === 0 ? (
          <p className="text-[10px] text-slate-600 font-mono text-center mt-8">
            No messages yet. Be the first to speak!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === user?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <span className={`text-[9px] font-mono font-bold mb-0.5 ${isMe ? "text-cyan-400" : "text-indigo-400"}`}>
                  {isMe ? "You" : msg.username}
                </span>
                <div className={`max-w-[85%] px-3 py-1.5 rounded-xl text-[11px] leading-relaxed ${
                  isMe 
                    ? "bg-cyan-950/30 border border-cyan-500/20 text-cyan-100" 
                    : "bg-slate-800/60 border border-slate-700/40 text-slate-300"
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-3 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          disabled={!user}
          className="flex-1 rounded-lg border border-slate-800 bg-[#07090e] py-2 px-3 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-slate-700 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || !user}
          className="px-3 py-2 rounded-lg bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/50 transition-colors disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
