import { useState, useRef } from "react";
import { useAccount, useChainId, useSignMessage, useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SUPPORTED_CHAIN } from "@/shared/lib/chain";
import {
  getSiweChallenge,
  verifySiweSignature,
} from "@/features/wallet/api/wallet.api";

interface UseSiweLoginReturn {
  isLoading: boolean;
  error: string | null;
  loginWithWallet: () => Promise<void>;
  clearError: () => void;
}

export function useSiweLogin(): UseSiweLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Ref guard: prevents two concurrent loginWithWallet calls from producing
  // duplicate challenge fetches. If both a button click and the auto-effect
  // fire at the same time, the second one bails out before requesting a nonce.
  const inFlightRef = useRef(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const { openConnectModal } = useConnectModal();
  const { setUser } = useAuthStore();

  const loginWithWallet = async () => {
    // Bail if already in progress
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: If no wallet connected, open RainbowKit modal first
      if (!isConnected || !address) {
        if (!openConnectModal) {
          throw new Error("Wallet connection is unavailable. Refresh and try again.");
        }
        openConnectModal();
        // loginWithWallet will be re-triggered by the auto-effect after connection
        return;
      }

      // Step 2: Ensure wallet is on Base Sepolia (backend SIWE chain)
      if (chainId !== SUPPORTED_CHAIN.id) {
        await switchChainAsync({ chainId: SUPPORTED_CHAIN.id });
      }

      // Step 3: Get challenge message from backend
      const normalizedAddress = address;
      const message = await getSiweChallenge(normalizedAddress);

      // Step 4: Sign the challenge with wagmi
      const signature = await signMessageAsync({ message });

      // Step 5: Verify with backend → creates/logs in user, sets cookie
      const user = await verifySiweSignature({
        address: normalizedAddress,
        signature,
      });

      // Step 6: Store user and redirect
      setUser(user);
    } catch (err: any) {
      if (err?.code === 4001 || err?.name === "UserRejectedRequestError") {
        setError("Signature rejected. Please try again.");
      } else if (err?.name === "SwitchChainError") {
        setError("Please switch to Base Sepolia in your wallet and try again.");
      } else {
        setError(err?.message || "Wallet login failed.");
      }
    } finally {
      inFlightRef.current = false;
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    loginWithWallet,
    clearError: () => setError(null),
  };
}
