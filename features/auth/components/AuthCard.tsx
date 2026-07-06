import LoginForm from "./LoginForm";
import Web3Providers from "./Web3Providers";

export default function AuthCard() {
  return (
    <div className="w-full rounded-xl border border-slate-800/80 bg-[#0d111a]/90 p-8 shadow-2xl backdrop-blur-md">
      {/* Traditional Login Section */}
      <LoginForm />

      {/* Divider */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-800/60"></div>
        </div>
        <span className="relative bg-[#0d111a] px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
          Or Connect Via Web3
        </span>
      </div>

      {/* Web3 Providers Section */}
      <Web3Providers />

      {/* Bottom Footer Call to Action */}
      <div className="mt-8 text-center text-xs text-slate-400">
        New combatant?{" "}
        <a
          href="/register"
          className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline underline-offset-4 decoration-indigo-500/40"
        >
          Register for Service
        </a>
      </div>
    </div>
  );
}
