"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  requestPasswordResetOtp,
  resetPassword,
  verifyPasswordResetOtp,
} from "@/features/auth/api/auth.api";

type ResetStep = "email" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runRequest = async (request: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await request();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmail = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;
    if (await runRequest(() => requestPasswordResetOtp(normalizedEmail))) {
      setEmail(normalizedEmail);
      setStep("otp");
    }
  };

  const handleOtp = async (event: FormEvent) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }
    if (await runRequest(() => verifyPasswordResetOtp(otp))) {
      setStep("password");
    }
  };

  const handlePassword = async (event: FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError("Password must be at least 8 characters and contain letters and numbers.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    if (await runRequest(() => resetPassword(newPassword))) {
      setStep("success");
    }
  };

  const resendOtp = async () => {
    if (await runRequest(() => requestPasswordResetOtp(email))) {
      setOtp("");
    }
  };

  return (
    <main className="relative flex min-h-dvh w-full items-center justify-center overflow-x-hidden bg-[#090b11] px-3 py-5 sm:px-4 sm:py-10">
      <div className="pointer-events-none absolute left-[-30%] top-[-15%] h-80 w-80 rounded-full bg-slate-800/20 blur-[100px] sm:left-[-10%] sm:h-125 sm:w-125" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-30%] h-80 w-80 rounded-full bg-indigo-950/20 blur-[100px] sm:right-[-10%] sm:h-125 sm:w-125" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-4 text-center sm:mb-5">
          <h1 className="font-mono text-2xl font-bold uppercase tracking-widest text-slate-100 sm:text-3xl">
            Recover Access
          </h1>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            Secure password reset protocol
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-[#0d111a]/95 p-4 shadow-2xl backdrop-blur-md sm:p-8">
          {step !== "success" && (
            <div className="mb-6 grid grid-cols-3 gap-2">
              {["email", "otp", "password"].map((item, index) => {
                const currentIndex = ["email", "otp", "password"].indexOf(step);
                return (
                  <div key={item} className="space-y-1.5">
                    <div
                      className={`h-1 rounded-full ${index <= currentIndex ? "bg-indigo-400" : "bg-slate-800"}`}
                    />
                    <p className="text-center font-mono text-[8px] uppercase tracking-wider text-slate-600">
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-xs text-rose-400">
              {error}
            </div>
          )}

          {step === "email" && (
            <form onSubmit={handleEmail} className="space-y-5">
              <div className="text-center">
                <Mail className="mx-auto h-8 w-8 text-indigo-300" />
                <h2 className="mt-3 text-sm font-bold uppercase tracking-widest text-white">
                  Find your account
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Enter your account email and we’ll send a six-digit verification code.
                </p>
              </div>
              <label className="block space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  placeholder="email@address.net"
                  className="w-full rounded-lg border border-slate-800 bg-[#090b11] px-4 py-3 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
                />
              </label>
              <SubmitButton isLoading={isLoading} label="Send verification code" />
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleOtp} className="space-y-5">
              <div className="text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-cyan-300" />
                <h2 className="mt-3 text-sm font-bold uppercase tracking-widest text-white">Verify code</h2>
                <p className="mt-2 break-words text-xs text-slate-500">Code sent to {email}</p>
              </div>
              <label className="block space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Six-digit code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  maxLength={6}
                  placeholder="000000"
                  className="w-full rounded-lg border border-slate-800 bg-[#090b11] px-4 py-3 text-center font-mono text-xl tracking-[0.45em] text-white outline-none focus:border-cyan-500/60"
                />
              </label>
              <SubmitButton isLoading={isLoading} label="Verify code" />
              <button
                type="button"
                onClick={resendOtp}
                disabled={isLoading}
                className="w-full text-[11px] text-slate-500 transition-colors hover:text-indigo-300 disabled:opacity-50"
              >
                Didn’t receive it? Resend code
              </button>
            </form>
          )}

          {step === "password" && (
            <form onSubmit={handlePassword} className="space-y-5">
              <div className="text-center">
                <KeyRound className="mx-auto h-8 w-8 text-indigo-300" />
                <h2 className="mt-3 text-sm font-bold uppercase tracking-widest text-white">Create new password</h2>
                <p className="mt-2 text-xs text-slate-500">Use at least 8 characters with letters and numbers.</p>
              </div>
              <PasswordInput
                label="New password"
                value={newPassword}
                onChange={setNewPassword}
                visible={showNewPassword}
                onToggle={() => setShowNewPassword((value) => !value)}
                autoComplete="new-password"
              />
              <PasswordInput
                label="Confirm new password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((value) => !value)}
                autoComplete="new-password"
              />
              <SubmitButton isLoading={isLoading} label="Reset password" />
            </form>
          )}

          {step === "success" && (
            <div className="py-3 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
              <h2 className="mt-4 text-lg font-bold uppercase tracking-widest text-white">Password updated</h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">Your password has been reset successfully. You can now sign in.</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-6 w-full rounded-lg bg-linear-to-r from-blue-300 via-indigo-300 to-blue-300 py-3 text-xs font-bold uppercase tracking-widest text-[#090b11]"
              >
                Return to login
              </button>
            </div>
          )}

          {step !== "success" && (
            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-2 border-t border-slate-800/60 pt-5 text-[11px] text-slate-500 transition-colors hover:text-indigo-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to login
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

function SubmitButton({ isLoading, label }: { isLoading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-300 via-indigo-300 to-blue-300 py-3 text-xs font-bold uppercase tracking-widest text-[#090b11] transition-all hover:shadow-[0_0_20px_rgba(165,180,252,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {isLoading ? "Processing..." : label}
    </button>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  autoComplete: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          minLength={8}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className="w-full rounded-lg border border-slate-800 bg-[#090b11] px-4 py-3 pr-12 text-sm text-slate-200 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-500 transition-colors hover:text-indigo-300"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </label>
  );
}
