import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RPS Arena — Web3 Rock Paper Scissors",
    short_name: "RPS Arena",
    description:
      "Real-time multiplayer Web3 Rock Paper Scissors battles, squads, achievements, and ranked leaderboards.",
    start_url: "/",
    display: "standalone",
    background_color: "#070A13",
    theme_color: "#070A13",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
