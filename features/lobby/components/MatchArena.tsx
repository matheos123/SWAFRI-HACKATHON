"use client";

import Image from "next/image";
import { useState } from "react";

export default function MatchArena() {
  const [selectedMove, setSelectedMove] = useState<string | null>(null);

  // Map your choice names directly to the paths in your public folder
  const actions = [
    { name: "Rock", src: "/rock-icon.png" },
    { name: "Paper", src: "/paper-icon.png" },
    { name: "Scissors", src: "/scissors-icon.png" },
  ];

  return (
    <div className="w-full rounded-xl border border-slate-800 bg-[#0d111a]/80 p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />

      <h2 className="text-center text-xs font-bold tracking-[0.3em] uppercase text-slate-400 font-mono mb-8">
        Live Match
      </h2>

      {/* Player Versus Section */}
      <div className="flex items-center justify-around mb-12 select-none">
        <div className="text-center space-y-2">
          <div className="h-20 w-20 rounded-xl bg-slate-900 border border-indigo-500/40 flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-500/5">
            {/* Example Avatar */}
            <div className="text-3xl">🤖</div>
          </div>
          <div className="font-mono text-xs font-bold text-slate-300">
            ARCHER:07
          </div>
          <div className="text-[10px] text-slate-500 font-bold tracking-wider">
            RATING 1987
          </div>
        </div>

        <div className="text-center space-y-1">
          <span className="text-2xl font-black italic tracking-widest text-slate-500 font-mono">
            VS
          </span>
          <div className="rounded-full bg-slate-900 border border-slate-800 px-3 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Round 3
          </div>
          <div className="text-xs font-mono font-medium text-amber-400/90 pt-1">
            ⏱️ 00:15
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="h-20 w-20 rounded-xl bg-slate-900 border border-red-500/40 flex items-center justify-center overflow-hidden shadow-lg shadow-red-500/5">
            {/* Example Enemy Avatar */}
            <div className="text-3xl">🥷</div>
          </div>
          <div className="font-mono text-xs font-bold text-slate-300">
            SHADOWX
          </div>
          <div className="text-[10px] text-slate-500 font-bold tracking-wider">
            RATING 1932
          </div>
        </div>
      </div>

      {/* Weapon Control Pad using your Public Folder Images */}
      <div className="max-w-md mx-auto grid grid-cols-3 gap-4">
        {actions.map((act) => {
          const isSelected = selectedMove === act.name;

          return (
            <button
              key={act.name}
              onClick={() => setSelectedMove(act.name)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl  transition-all group active:scale-95 ${
                isSelected
                  ? "bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/10"
                  : " hover:bg-indigo-950/20 hover:border-indigo-500/60"
              }`}
            >
              {/* Next.js Optimized Image wrapper */}
              <div className="relative w-24 h-24 mb-3 transform group-hover:scale-110 transition-transform">
                <Image
                  src={act.src}
                  alt={`${act.name} tactical option`}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <span
                className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  isSelected
                    ? "text-indigo-400"
                    : "text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {act.name}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-6">
        {selectedMove ? `Selected: ${selectedMove}` : "Choose Your Move"}
      </p>
    </div>
  );
}
