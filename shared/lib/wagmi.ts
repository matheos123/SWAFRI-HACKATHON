import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { createConfig, http } from "wagmi";
import { SUPPORTED_CHAIN } from "@/shared/lib/chain";

const transports = {
  [SUPPORTED_CHAIN.id]: http("https://sepolia.base.org"),
};

// WalletConnect uses IndexedDB and must never initialize in the Node.js SSR
// environment. The server receives a connector-free config; the browser gets
// RainbowKit's full connector set when it evaluates this client module.
export const wagmiConfig =
  typeof window === "undefined"
    ? createConfig({
        chains: [SUPPORTED_CHAIN],
        transports,
        ssr: true,
      })
    : getDefaultConfig({
        appName: "RPS Arena",
        projectId:
          process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "rps-arena-dev",
        chains: [SUPPORTED_CHAIN],
        transports,
        ssr: true,
      });
