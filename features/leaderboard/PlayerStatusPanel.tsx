export default function PlayerStatsPanel() {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d111a]/80 p-5 shadow-xl space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <h3 className="text-xs font-mono font-bold tracking-wider text-slate-200">
            ARCHER:07 ⚙️
          </h3>
          <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest">
            Diamond I
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2 text-center border-y border-slate-800/40 py-3">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Wins
          </span>
          <span className="text-sm font-mono font-bold text-slate-200">
            1,247
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Matches
          </span>
          <span className="text-sm font-mono font-bold text-slate-200">
            2,318
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Win Rate
          </span>
          <span className="text-sm font-mono font-bold text-emerald-400">
            53.8%
          </span>
        </div>
      </div>

      {/* Achievements Subsegment */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-mono">
            Achievements
          </span>
          <a
            href="#"
            className="text-[9px] text-indigo-400 uppercase font-bold"
          >
            View All
          </a>
        </div>
        <div className="flex items-center gap-2">
          {["💧", "🔥", "🏆", "👁️"].map((badge, idx) => (
            <div
              key={idx}
              className={`h-8 w-10 rounded border flex items-center justify-center text-xs ${idx === 2 ? "border-amber-500/40 bg-amber-500/5 text-amber-400" : "border-slate-800 bg-[#121724]/40"}`}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
