"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, RegisterSchema } from "@/shared/schemas";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function RegisterCard() {
  const router = useRouter();
  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    await registerUser({
      username: data.username,
      email: data.email,
      password: data.password,
    });
    const { error: storeError, user } = useAuthStore.getState();
    if (!storeError && user) {
      router.push("/lobby");
    }
  };

  return (
    <div className="w-full rounded-xl border border-slate-800/80 bg-[#0d111a]/95 p-7 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Title */}
      <div className="mb-6 space-y-1">
        <h2 className="text-sm font-semibold tracking-wide text-slate-200 font-mono">
          Create Operator Account
        </h2>
        <p className="text-xs text-slate-500">
          Fill in your tactical credentials to begin your ascent.
        </p>
      </div>

      {/* API error banner */}
      {error && (
        <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-xs text-rose-400 font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm">
              👤
            </span>
            <input
              {...register("username")}
              type="text"
              placeholder="Callsign_01"
              className="w-full rounded-lg border border-slate-800/80 bg-[#0d111a] py-2.5 pl-9 pr-4 text-sm text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>
          {errors.username && (
            <p className="text-[10px] text-red-400 mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm">
              @
            </span>
            <input
              {...register("email")}
              type="email"
              placeholder="commander@rps-arena.io"
              className="w-full rounded-lg border border-slate-800/80 bg-[#0d111a] py-2.5 pl-9 pr-4 text-sm text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
            />
          </div>
          {errors.email && (
            <p className="text-[10px] text-red-400 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">
                🔒
              </span>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-800/80 bg-[#0d111a] py-2.5 pl-9 pr-4 text-sm text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Confirm
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">
                🛡️
              </span>
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-800/80 bg-[#0d111a] py-2.5 pl-9 pr-4 text-sm text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 w-full rounded-md bg-[#b4c6ff] py-3 text-xs font-bold tracking-widest text-[#090b11] uppercase shadow-lg shadow-indigo-400/20 hover:bg-[#c5d5ff] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "Initializing..." : "Initialize Register"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Login
          </Link>
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest text-slate-500 uppercase pt-2 border-t border-slate-800/40">
          <a href="#" className="hover:text-slate-400 transition-colors">
            Terms
          </a>
          <span>•</span>
          <a href="#" className="hover:text-slate-400 transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </div>
  );
}
