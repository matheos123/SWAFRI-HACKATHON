import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAuthStore } from "@/features/auth/store/auth.store";
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

  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { openConnectModal } = useConnectModal();
  const { setUser } = useAuthStore();

  const loginWithWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: If no wallet connected, open RainbowKit modal first
      if (!isConnected || !address) {
        openConnectModal?.();
        // loginWithWallet will be re-triggered by the UI after connection
        setIsLoading(false);
        return;
      }

      // Step 2: Get challenge message from backend
      const normalizedAddress = address;
      const message = await getSiweChallenge(normalizedAddress);

      // Step 3: Sign the challenge with wagmi
      const signature = await signMessageAsync({ message });

      // Step 4: Verify with backend → creates/logs in user, sets cookie
      const user = await verifySiweSignature({
        address: normalizedAddress,
        signature,
      });

      // Step 5: Store user and redirect
      setUser(user);
    } catch (err: any) {
      if (err?.code === 4001 || err?.name === "UserRejectedRequestError") {
        setError("Signature rejected. Please try again.");
      } else {
        setError(err?.message || "Wallet login failed.");
      }
    } finally {
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
