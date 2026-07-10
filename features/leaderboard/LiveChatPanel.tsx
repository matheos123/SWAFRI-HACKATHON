"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useLobbyChat } from "@/features/chat/hooks/useLobbyChat";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useSquadStore } from "@/features/friends/store/squad.store";

export default function LiveChatPanel() {
  const { user } = useAuthStore();
  const { squad } = useSquadStore();
  const [chatRoom, setChatRoom] = useState("lobby");

  // Dynamically hook into the selected chat room
  const { messages, sendMessage } = useLobbyChat(chatRoom);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const squadRoomId = squad ? `squad-${squad.name}` : null;

  // Switch chat room back to lobby if squad is disbanded while SQUAD tab is active
  useEffect(() => {
    if (!squad && chatRoom !== "lobby") {
      setChatRoom("lobby");
    }
  }, [squad, chatRoom]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex-1 min-h-85 flex flex-col rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase font-mono">
            Communications
          </h3>
        </div>

        {/* Tab selection */}
        {squad && (
          <div className="flex bg-[#07090e] p-0.5 rounded border border-slate-800/80">
            <button
              onClick={() => setChatRoom("lobby")}
              className={`px-2 py-1 rounded text-[9px] font-bold font-mono uppercase tracking-wider transition-colors ${
                chatRoom === "lobby"
                  ? "bg-[#1D2B4D] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              GLOBAL
            </button>
            <button
              onClick={() => setChatRoom(`squad-${squad.name}`)}
              className={`px-2 py-1 rounded text-[9px] font-bold font-mono uppercase tracking-wider transition-colors ${
                chatRoom === `squad-${squad.name}`
                  ? "bg-[#1D2B4D] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              SQUAD
            </button>
          </div>
        )}
      </div>

      {/* Scrollable messages */}
      <div className="flex-1 space-y-2.5 overflow-y-auto text-xs pr-1 max-h-64 min-h-[180px]">
        {messages.length === 0 ? (
          <p className="text-[10px] text-slate-600 font-mono text-center mt-4">
            No messages yet in {chatRoom === "lobby" ? "Global Lobby" : "Squad Chat"}. Say something!
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
          placeholder={`Type a message to ${chatRoom === "lobby" ? "Lobby" : "Squad"}...`}
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
