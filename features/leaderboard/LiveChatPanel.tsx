"use client";

export default function LiveChatPanel() {
  return (
    <div className="flex-1 min-h-85 flex flex-col rounded-xl border border-slate-800 bg-[#0d111a]/80 p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase font-mono">
          Live Chat
        </h3>
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 space-y-3 overflow-y-auto text-xs pr-1 select-none">
        <p className="leading-relaxed">
          <span className="font-mono text-indigo-400 font-bold mr-1.5">
            ARCHER:07:
          </span>
          Nice game! Gearing up for the final round.
        </p>
        <p className="leading-relaxed">
          <span className="font-mono text-red-400 font-bold mr-1.5">
            SHADOWX:
          </span>
          Well played, but I see your pattern.
        </p>
      </div>

      {/* Input Field */}
      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full rounded-lg border border-slate-800 bg-[#07090e] py-2 px-4 pr-10 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-slate-700"
        />
        <button className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-indigo-400 transition-colors">
          ➔
        </button>
      </div>
    </div>
  );
}
