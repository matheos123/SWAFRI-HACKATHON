export default function LeaderboardPanel() {
  const leaders = [
    { rank: 4, name: "CYBERNINJA", score: "1,980" },
    { rank: 5, name: "IRONFIST", score: "1,875" },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d111a]/80 p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase font-mono">
          Leaderboard
        </h3>
        <a
          href="#"
          className="text-[10px] text-indigo-400 font-bold uppercase hover:underline"
        >
          View All &gt;
        </a>
      </div>

      {/* Top Podiums Grid placeholder */}
      <div className="flex justify-center items-end gap-3 border-b border-slate-800/40 pb-4 mb-3 text-center">
        <div className="p-2 space-y-1">
          <div className="text-xs">🥈</div>
          <p className="text-[9px] text-slate-400 font-mono font-bold">2nd</p>
        </div>
        <div className="p-2 space-y-1 bg-amber-500/5 rounded border border-amber-500/20 px-4">
          <div className="text-sm">👑</div>
          <p className="text-[10px] text-amber-400 font-mono font-bold">1st</p>
        </div>
        <div className="p-2 space-y-1">
          <div className="text-xs">🥉</div>
          <p className="text-[9px] text-slate-400 font-mono font-bold">3rd</p>
        </div>
      </div>

      {/* Lower Ranks List */}
      <div className="space-y-1.5">
        {leaders.map((leader) => (
          <div
            key={leader.rank}
            className="flex items-center justify-between py-1.5 px-2 text-xs font-mono"
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-[11px] font-bold">
                {leader.rank}
              </span>
              <span className="text-slate-300 font-bold">{leader.name}</span>
            </div>
            <span className="text-slate-400 font-semibold">{leader.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
