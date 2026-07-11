import { useState } from "react";
import { useAccount, useChainId, useSignMessage, useSwitchChain } from "wagmi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SUPPORTED_CHAIN } from "@/shared/lib/chain";
import {
  getWalletChallenge,
  connectWallet,
} from "@/features/wallet/api/wallet.api";

// ─── Hook: link wallet to existing email account

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
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const { setUser } = useAuthStore();

  const verifyAndLink = async () => {
    if (!address) {
      setError("No wallet connected. Please connect your wallet first.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    // Use original checksummed address — backend validator requires valid checksum
    const normalizedAddress = address;

    try {
      // Step 1: Ensure wallet is on Base Sepolia
      if (chainId !== SUPPORTED_CHAIN.id) {
        await switchChainAsync({ chainId: SUPPORTED_CHAIN.id });
      }

      // Step 2: Get challenge message from backend
      const message = await getWalletChallenge(normalizedAddress);

      // Step 3: Sign with connected wallet
      const signature = await signMessageAsync({ message });

      // Step 4: Send to backend to link wallet to account
      const result = await connectWallet({
        walletAddress: normalizedAddress,
        signature,
      });

      // Step 5: Update store with new wallet info
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
      } else if (err?.name === "SwitchChainError") {
        setError("Please switch to Base Sepolia in your wallet and try again.");
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
