import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "RPS Arena",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "rps-arena-dev",
  chains: [mainnet, polygon, sepolia],
  ssr: true,
});
