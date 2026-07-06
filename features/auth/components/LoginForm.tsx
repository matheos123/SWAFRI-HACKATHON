"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/shared/schemas";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Form data:", data);
    // Traditional login logic goes here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Operator Identity
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm">
            @
          </span>
          <input
            {...register("email")}
            type="email"
            placeholder="email@address.net"
            className="w-full rounded-md border border-slate-800/80 bg-[#0d111a] py-2.5 pl-9 pr-4 text-sm text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
        {errors.email && (
          <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Access Key
          </label>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">
            <svg width="12" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </span>
          <input
            {...register("password")}
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-slate-800/80 bg-[#0d111a] py-2.5 pl-9 pr-4 text-sm text-slate-300 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
          />
        </div>
        {errors.password && (
          <p className="text-[10px] text-red-400 mt-1">{errors.password.message}</p>
        )}
        <div className="text-left pt-1">
          <a
            href="#"
            className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors"
          >
            Forgot Access Key?
          </a>
        </div>
      </div>

      {/* Action Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full rounded-md bg-gradient-to-r from-blue-300 via-indigo-300 to-blue-300 py-3 text-xs font-bold tracking-widest text-[#090b11] uppercase shadow-[0_0_15px_rgba(165,180,252,0.4)] hover:shadow-[0_0_25px_rgba(165,180,252,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          Initialize Login
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        </button>
      </div>
    </form>
  );
}
