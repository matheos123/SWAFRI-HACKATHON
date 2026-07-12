import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create an RPS Arena account and start playing real-time multiplayer Rock Paper Scissors battles.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
