import { useCallback, useRef, useState } from "react";
import { useAccount, useChainId, useSignMessage, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SUPPORTED_CHAIN } from "@/shared/lib/chain";
import {
  getSiweChallenge,
  verifySiweSignature,
} from "@/features/wallet/api/wallet.api";

export function useSiweLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { setUser, loadProfile } = useAuthStore();

  const loginWithWallet = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // 1. If no wallet is connected → open RainbowKit modal
      if (!isConnected || !address) {
        if (openConnectModal) {
          openConnectModal();
          // Do NOT continue — wait for user to connect via modal
          return;
        } else {
          throw new Error("Wallet connection modal is unavailable.");
        }
      }

      // 2. Switch chain if needed
      if (chainId !== SUPPORTED_CHAIN.id) {
        await switchChainAsync({ chainId: SUPPORTED_CHAIN.id });
      }

      // 3. Get challenge
      const message = await getSiweChallenge(address);

      // 4. Sign
      const signature = await signMessageAsync({ message });

      // 5. Verify with backend
      const user = await verifySiweSignature({
        address,
        signature,
      });

      // 6. Update store
      setUser(user);
      await loadProfile(); // optional: refresh full profile
    } catch (err: any) {
      const msg = err?.message || "Wallet login failed.";
      setError(msg);
      console.error(err);
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  }, [
    address,
    isConnected,
    chainId,
    openConnectModal,
    setUser,
    loadProfile,
    signMessageAsync,
    switchChainAsync,
  ]);

  return {
    isLoading,
    error,
    loginWithWallet,
    clearError: () => setError(null),
  };
}