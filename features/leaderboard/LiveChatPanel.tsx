"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Shield } from "lucide-react";
import { useLobbyChat } from "@/features/chat/hooks/useLobbyChat";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useSquadStore } from "@/features/friends/store/squad.store";

export default function LiveChatPanel() {
  const { user } = useAuthStore();
  const { squad } = useSquadStore();
  const squadRoomId = squad ? `squad-${squad.name}` : null;

  const { messages, sendMessage } = useLobbyChat(squadRoomId ?? "");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !squadRoomId) return;
    sendMessage(input);
    setInput("");
  };

  // No squad — show placeholder
  if (!squad) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-[#0d111a]/80 p-6 shadow-xl min-h-55 text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
          <Shield className="w-5 h-5 text-cyan-500/60" />
        </div>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
          No active squad
        </p>
        <p className="text-[9px] font-mono text-slate-600 max-w-45">
          Create or join a squad to access squad chat
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-85 flex flex-col rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3 shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <div className="flex-1 min-w-0">
          <h3 className="text-[11px] font-bold tracking-widest text-slate-300 uppercase font-mono truncate">
            Squad Chat
          </h3>
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-wider truncate">
            {squad.name}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded border border-cyan-500/20 bg-cyan-500/5">
          <Shield className="w-2.5 h-2.5 text-cyan-500/60" />
          <span className="text-[8px] font-mono text-cyan-500/60 uppercase tracking-wider">
            Private
          </span>
        </div>
      </div>

      {/* Scrollable messages */}
      <div className="flex-1 space-y-2.5 overflow-y-auto text-xs pr-1 max-h-64 min-h-45">
        {messages.length === 0 ? (
          <p className="text-[10px] text-slate-600 font-mono text-center mt-6">
            No messages yet. Say something to your squad!
          </p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <span
                  className={`text-[9px] font-mono font-bold mb-0.5 ${isMe ? "text-cyan-400" : "text-indigo-400"}`}
                >
                  {isMe ? "You" : msg.username}
                </span>
                <div
                  className={`max-w-[85%] px-3 py-1.5 rounded-xl text-[11px] leading-relaxed ${
                    isMe
                      ? "bg-cyan-950/30 border border-cyan-500/20 text-cyan-100"
                      : "bg-slate-800/60 border border-slate-700/40 text-slate-300"
                  }`}
                >
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
          placeholder={`Message ${squad.name}...`}
          className="flex-1 rounded-lg border border-slate-800 bg-[#07090e] py-2 px-3 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-slate-700 transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="px-3 py-2 rounded-lg bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/50 transition-colors disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
