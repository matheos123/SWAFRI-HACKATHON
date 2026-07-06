import RegisterCard from "@/features/auth/components/RegisterCard";

export default function RegisterPage() {
  return (
    <div className="relative w-full max-w-5xl aspect-[4/3] sm:aspect-video rounded-md   p-4 sm:p-8 flex items-center justify-center  backdrop-blur-sm overflow-hidden">
      {/* Sci-Fi Frame Accents */}
      <div className="absolute top-6 left-6 w-10 h-10 border-t border-1 border-slate-700/40 pointer-events-none" />
      <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-slate-700/40 pointer-events-none" />

      <div className="z-10 w-full max-w-[460px] flex flex-col items-center">
        {/* Registration Header Branding */}
        <div className="mb-5 text-center space-y-1 select-none">
          <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-slate-200 font-mono">
            RPS Arena
          </h1>
          <p className="text-[9px] tracking-[0.2em] text-slate-400 uppercase font-semibold">
            Enlist for the New Era of Tactical Combat
          </p>
        </div>

        {/* The Card Component */}
        <RegisterCard />
      </div>
    </div>
  );
}
