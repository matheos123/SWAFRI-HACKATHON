"use client";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { wagmiConfig } from "@/shared/lib/wagmi";
import { SUPPORTED_CHAIN } from "@/shared/lib/chain";
import "@rainbow-me/rainbowkit/styles.css";

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useState ensures one QueryClient per component mount, not re-created on render
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={SUPPORTED_CHAIN}
          theme={darkTheme({
            accentColor: "#22d3ee",
            accentColorForeground: "#070A13",
            borderRadius: "medium",
            fontStack: "system",
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
