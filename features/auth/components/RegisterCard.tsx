"use client";

import Link from "next/link";
import { RegisterFormData, RegisterSchema } from "@/shared/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterCard() {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<RegisterFormData>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    }); 
  
    const onSubmit = (data: RegisterFormData) => {
      console.log("Form data:", data);
      // Traditional login logic goes here
    };

  return (
    <div className="w-full rounded-xl border border-slate-800/80 bg-[#0d111a]/95 p-7 sm:p-8 shadow-2xl backdrop-blur-md">
      {/* Title Section inside the card */}
      <div className="mb-6 space-y-1">
        <h2 className="text-sm font-semibold tracking-wide text-slate-200 font-mono">
          Create Operator Account
        </h2>
        <p className="text-xs text-slate-500">
          Fill in your tactical credentials to begin your ascent.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Operator Name Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
             Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm">
              👤
            </span>
            <input
            {...register("name")}
              type="text"
              placeholder="Callsign_01"
              className="w-full rounded-lg border border-slate-200/20 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
              required
            />
            {errors.name && (
              <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Neural Link Email Field */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Link Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-sm">
              @
            </span>
            <input
            {...register("email")}
              type="email"
              placeholder="commander@rps-arena.io"
              className="w-full rounded-lg border border-slate-200/20 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
              required
            />
            {errors.email && (
              <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Access Keys Side-by-Side Split Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Access Key */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              Your Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">
                🔒
              </span>
              <input
              {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200/20 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
                required
              />
              {errors.password && (
                <p className="text-[10px] text-red-400 mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Verify Key */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
             Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 text-xs">
                🛡️
              </span>
              <input
              {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200/20 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
                required
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-red-400 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-[#b4c6ff] py-3 text-xs font-bold tracking-widest text-[#090b11] uppercase shadow-lg shadow-indigo-400/20 hover:bg-[#c5d5ff] active:scale-[0.99] transition-all"
        >
          Initialize Register
        </button>
      </form>

      {/* Card Footer Options */}
      <div className="mt-6 text-center space-y-3">
        <p className="text-xs text-slate-400">
          Already have an account?{" "}
          <Link
            href="/"
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
