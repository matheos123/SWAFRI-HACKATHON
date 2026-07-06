export default function MatchHistory() {
  const matches = [
    { opponent: "SHADOWX", status: "VICTORY", score: "3-1", win: true },
    { opponent: "NOVABEAR", status: "DEFEAT", score: "2-3", win: false },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d111a]/80 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase font-mono">
          Match History
        </h3>
        <a
          href="#"
          className="text-[10px] text-indigo-400 font-bold uppercase hover:underline"
        >
          View All &gt;
        </a>
      </div>
      <div className="space-y-2.5">
        {matches.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-800/40 bg-[#121724]/20"
          >
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-slate-800 text-xs flex items-center justify-center">
                🎮
              </div>
              <span className="text-xs font-mono font-bold tracking-wide text-slate-300">
                vs {m.opponent}
              </span>
            </div>
            <div className="text-right">
              <span
                className={`text-[10px] font-black tracking-wider block ${m.win ? "text-emerald-400" : "text-rose-500"}`}
              >
                {m.status}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {m.score}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
