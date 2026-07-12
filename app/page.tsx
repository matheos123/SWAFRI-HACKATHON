import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Radio,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const features = [
  {
    title: "Real-time battles",
    description:
      "Queue instantly, face live opponents, and resolve every round with synchronized gameplay.",
    icon: Radio,
  },
  {
    title: "Wallet-backed competition",
    description:
      "Link your wallet to verify your profile, preserve ranked progress, and unlock Web3 identity.",
    icon: ShieldCheck,
  },
  {
    title: "Leaderboards and progression",
    description:
      "Climb global rankings, build win streaks, and track your competitive growth match by match.",
    icon: Trophy,
  },
  {
    title: "Squads and community play",
    description:
      "Create squads, add friends, coordinate in shared chat, and play alongside your team.",
    icon: Users,
  },
];

const highlights = [
  {
    title: "Fast to start",
    description:
      "Sign up with email or wallet and jump into matches without a heavy setup flow.",
    icon: Zap,
  },
  {
    title: "Competitive by design",
    description:
      "Ranked play, match history, achievements, and live status keep the experience meaningful.",
    icon: Swords,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070A13] text-slate-200">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#070A13]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-[0.25em] text-white"
          >
            RPS Arena
          </Link>

          <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-400 md:flex">
            <a href="#home" className="transition-colors hover:text-white">
              Home
            </a>
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-white sm:px-5"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#A5C3F9] px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-[#0A0F1D] transition-colors hover:bg-[#B7D2FC] sm:px-5"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <section
        id="home"
        className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pt-28"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-24 h-72 w-72 rounded-full bg-cyan-900/10 blur-[120px]" />

        <div className="relative mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
              Play · Win · Earn · Own
            </p>
            <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-7xl">
              Rock Paper Scissors
              <span className="mt-2 block text-indigo-300">for modern competitive play</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              RPS Arena turns a familiar game into a live multiplayer experience
              with ranked matches, squads, achievements, wallet identity, and a
              leaderboard built for players who want more than a casual round.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A5C3F9] px-7 py-3.5 text-xs font-black uppercase tracking-widest text-[#0A0F1D] transition-colors hover:bg-[#B7D2FC]"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-indigo-400/60 hover:text-white"
              >
                Sign in to play
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0C1220]/80 p-5 shadow-2xl shadow-black/20">
            <div className="rounded-2xl border border-slate-800/80 bg-[#050812] p-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
                    Live arena
                  </p>
                  <h2 className="mt-2 text-lg font-black uppercase tracking-wider text-white">
                    Competitive snapshot
                  </h2>
                </div>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                  Online
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-[#090E1B] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    Match flow
                  </p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white">
                    Queue, duel, rematch
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#090E1B] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    Identity
                  </p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white">
                    Email + wallet support
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#090E1B] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    Team play
                  </p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white">
                    Squads with shared chat
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-[#090E1B] p-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    Progress
                  </p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wide text-white">
                    Rankings and achievements
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-[#0C1220]/70 p-6 sm:p-8">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-cyan-400">
              About
            </p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              A familiar game with a sharper edge
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#0C1220]/40 p-6 sm:p-8">
            <p className="text-sm leading-7 text-slate-400">
              RPS Arena is built for public users who want a clean way to join,
              compete, and grow inside one experience. Instead of a static mini
              game, it becomes a connected platform where your profile, match
              history, squad membership, and leaderboard progress all matter.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {highlights.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-800 bg-[#090E1B] p-5"
                >
                  <Icon className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                  <h3 className="mt-3 text-sm font-bold uppercase tracking-wide text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" aria-labelledby="features-heading" className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-cyan-400">
              Features
            </p>
            <h2
              id="features-heading"
              className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl"
            >
              Everything public users need to get started
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Whether someone joins casually or wants to compete seriously, the
              homepage should make it clear what the platform offers from day one.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-800 bg-[#0C1220]/70 p-5"
              >
                <Icon className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-white">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-slate-500">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-4 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 rounded-3xl border border-slate-800 bg-linear-to-r from-[#0C1220] to-[#10172A] p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-cyan-400">
              Ready to play?
            </p>
            <h2 className="mt-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Join the arena and start your first match
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Create a profile, invite friends, or queue into live competition.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-[#A5C3F9] px-6 py-3 text-xs font-black uppercase tracking-widest text-[#0A0F1D] transition-colors hover:bg-[#B7D2FC]"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-xs font-bold uppercase tracking-widest text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800/80 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black uppercase tracking-[0.25em] text-slate-300">
              RPS Arena
            </p>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              Real-time multiplayer Rock Paper Scissors with ranked play,
              squads, and Web3 identity.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-widest">
            <a href="#home" className="transition-colors hover:text-white">
              Home
            </a>
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <Link href="/login" className="transition-colors hover:text-white">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
