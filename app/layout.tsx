import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AppStateProvider } from "@/shared/context/AppStateContext";
import Web3Provider from "@/shared/components/Web3Provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "RPS Arena | Real-Time Web3 Rock Paper Scissors",
    template: "%s | RPS Arena",
  },
  description:
    "Play real-time multiplayer Rock Paper Scissors, compete in ranked Web3 matches, join squads, earn achievements, and climb the global leaderboard.",
  applicationName: "RPS Arena",
  keywords: [
    "Rock Paper Scissors",
    "multiplayer game",
    "Web3 game",
    "blockchain gaming",
    "RPS Arena",
    "Base Sepolia",
    "online game",
  ],
  authors: [{ name: "RPS Arena" }],
  creator: "RPS Arena",
  publisher: "RPS Arena",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "RPS Arena",
    title: "RPS Arena | Play, Win, Earn, Own",
    description:
      "Battle players worldwide in real-time Web3 Rock Paper Scissors matches.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RPS Arena | Play, Win, Earn, Own",
    description:
      "Battle players worldwide in real-time Web3 Rock Paper Scissors matches.",
  },
  category: "gaming",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full`}
    >
      <body className="font-sans bg-[#090b11] text-slate-200 min-h-screen h-full w-full max-w-full relative overflow-x-clip antialiased">
        {/* Persistent Ambient Background Glows */}
        <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-150 w-150 rounded-full bg-slate-800/10 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-150 w-150 rounded-full bg-indigo-950/10 blur-[150px]" />

        {/* Outer Layout wrapper */}
        <div className="relative flex flex-col min-h-screen w-full">
          <Web3Provider>
            <AppStateProvider>{children}</AppStateProvider>
          </Web3Provider>
        </div>
      </body>
    </html>
  );
}
