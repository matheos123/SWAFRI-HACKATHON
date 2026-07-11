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
  title: "RPS Arena | Play, Win, Earn, Own",
  description:
    "A real-time multiplayer Web3 Rock-Paper-Scissors gaming platform.",
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
      <body className="font-sans bg-[#090b11] text-slate-200 min-h-screen h-full w-full relative overflow-x-hidden antialiased">
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
