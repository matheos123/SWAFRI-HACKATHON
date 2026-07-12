"use client";
import RegisterCard from "@/features/auth/components/RegisterCard";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden bg-[#090b11] px-3 py-6 font-sans antialiased selection:bg-indigo-500/30 sm:px-4 sm:py-10">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-slate-800/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-950/20 blur-[120px]" />

      {/* Decorative Sci-Fi Border Corners */}
      <div className="absolute left-4 top-4 h-8 w-8 border-l border-t border-slate-800/60 sm:left-8 sm:top-8 sm:h-12 sm:w-12" />
      <div className="absolute bottom-4 right-4 h-8 w-8 border-b border-r border-slate-800/60 sm:bottom-8 sm:right-8 sm:h-12 sm:w-12" />

      <div className="z-10 w-full max-w-md">
        {/* Header Branding */}
        <div className="mb-4 space-y-1 text-center select-none sm:mb-5">
          <h1 className="font-mono text-2xl font-bold uppercase tracking-[0.22em] text-slate-200 sm:text-3xl sm:tracking-widest">
            RPS Arena
          </h1>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:text-[11px] sm:tracking-[0.2em]">
            Enlist for the New Era of Tactical Combat
          </p>
        </div>

        <RegisterCard />
      </div>
    </main>
  );
}
