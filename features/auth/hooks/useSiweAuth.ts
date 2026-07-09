import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  getWalletChallenge,
  connectWallet,
} from "@/features/wallet/api/wallet.api";

interface UseSiweAuthReturn {
  isConnecting: boolean;
  error: string | null;
  verifyAndLink: () => Promise<void>;
  clearError: () => void;
}

export function useSiweAuth(): UseSiweAuthReturn {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { setUser } = useAuthStore();

  const verifyAndLink = async () => {
    if (!address) {
      setError("No wallet connected. Please connect your wallet first.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Step 1: Get the exact challenge message from the backend
      const { message } = await getWalletChallenge(address);

      // Step 2: Sign it with the connected wallet via wagmi
      const signature = await signMessageAsync({ message });

      // Step 3: Send to backend — links wallet to current account
      const result = await connectWallet({
        walletAddress: address,
        signature,
      });

      // Step 4: Update the user in the auth store with the new wallet info
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        setUser({
          ...currentUser,
          walletAddress: result.walletAddress,
          blockchainProfileId: result.blockchainProfileId,
          walletVerifiedAt: result.verifiedAt,
        });
      }
    } catch (err: any) {
      if (err?.code === 4001 || err?.name === "UserRejectedRequestError") {
        setError("Signature request rejected. Please try again.");
      } else {
        setError(err?.message || "Wallet verification failed.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    isConnecting,
    error,
    verifyAndLink,
    clearError: () => setError(null),
  };
}
