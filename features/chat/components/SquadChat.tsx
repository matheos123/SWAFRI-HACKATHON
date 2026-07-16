"use client";

import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, Users } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useSquadStore } from "@/features/friends/store/squad.store";

export default function SquadChat() {
  const activeSquad = useSquadStore((state) => state.squad);
  const getActiveSquadRoomId = useSquadStore((state) => state.getActiveSquadRoomId);
  const roomId = getActiveSquadRoomId();
  
  const { messages, sendMessage, error } = useChat(roomId || "");
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  if (!activeSquad) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-900/50 rounded-xl p-6 border border-slate-800">
        <Users className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm font-mono text-center">Join or select a squad to access chat</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0d111a] rounded-xl border border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-slate-900/80 border-b border-slate-800">
        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse" />
        <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
          Squad Comms: {activeSquad.name}
        </h3>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-950/50 text-red-400 text-xs font-mono border-b border-red-900/50">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500 italic">
            No messages yet. Say hello to your squad!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={msg.id || idx} className="flex flex-col">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-xs text-cyan-400">{msg.username}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm text-slate-200">{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 bg-slate-900/80 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Transmit message..."
            disabled={!!error}
            className="w-full bg-[#090b11] border border-slate-700 rounded-lg pl-4 pr-10 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !!error}
            className="absolute right-2 p-1.5 text-cyan-500 hover:text-cyan-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
