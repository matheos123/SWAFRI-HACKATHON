"use client";
import RegisterCard from "@/features/auth/components/RegisterCard";

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-[#090b11] overflow-x-hidden py-12 font-sans antialiased selection:bg-indigo-500/30">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-slate-800/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-950/20 blur-[120px]" />

      {/* Decorative Sci-Fi Border Corners */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-slate-800/60" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-slate-800/60" />

      <div className="z-10 w-full max-w-md px-4">
        {/* Header Branding */}
        <div className="mb-5 text-center space-y-1 select-none">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-slate-200 font-mono">
            RPS Arena
          </h1>
          <p className="text-[11px] tracking-[0.2em] text-slate-400 uppercase font-semibold">
            Enlist for the New Era of Tactical Combat
          </p>
        </div>

        <RegisterCard />
      </div>
    </main>
  );
}
