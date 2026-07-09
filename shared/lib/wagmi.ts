import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, polygon, sepolia } from "wagmi/chains";
import { http } from "wagmi";

export const wagmiConfig = getDefaultConfig({
  appName: "RPS Arena",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "rps-arena-dev",
  chains: [mainnet, polygon, sepolia],
  transports: {
    // Use public RPC endpoints that allow CORS from any origin
    [mainnet.id]: http("https://cloudflare-eth.com"),
    [polygon.id]: http("https://polygon-rpc.com"),
    [sepolia.id]: http("https://rpc.sepolia.org"),
  },
  ssr: true,
});
