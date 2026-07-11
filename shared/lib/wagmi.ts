import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { SUPPORTED_CHAIN } from "@/shared/lib/chain";

export const wagmiConfig = getDefaultConfig({
  appName: "RPS Arena",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "rps-arena-dev",
  chains: [SUPPORTED_CHAIN],
  transports: {
    [SUPPORTED_CHAIN.id]: http("https://sepolia.base.org"),
  },
  ssr: true,
});
