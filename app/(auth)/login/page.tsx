import AuthCard from "@/features/auth/components/AuthCard";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-[#090b11] overflow-hidden font-sans antialiased selection:bg-indigo-500/30">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-slate-800/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-950/20 blur-[120px]" />

      {/* Decorative Sci-Fi Border Corners */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t border-l border-slate-800/60" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b border-r border-slate-800/60" />

      <div className="z-10 w-full max-w-[500px] px-4">
        {/* Header Branding */}
        <div className="mb-6 text-center space-y-1">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-slate-200 font-mono">
            RPS Arena
          </h1>
          <p className="text-[16px] tracking-[0.25em] text-slate-400 uppercase font-medium">
            Play Win Earn Own
          </p>
        </div>

        <AuthCard />
      </div>
    </main>
  );
}
