import { useCallback, useRef, useState } from "react";
import { useAccount, useChainId, useSignMessage, useSwitchChain } from "wagmi";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { SUPPORTED_CHAIN } from "@/shared/lib/chain";
import {
  getWalletChallenge,
  connectWallet,
} from "@/features/wallet/api/wallet.api";

//Hook: link wallet to existing email account

interface UseSiweAuthReturn {
  isConnecting: boolean;
  error: string | null;
  verifyAndLink: () => Promise<void>;
  clearError: () => void;
}

function getErrorDetails(error: unknown): {
  code?: number;
  name?: string;
  message?: string;
} {
  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    return {
      code: typeof record.code === "number" ? record.code : undefined,
      name: typeof record.name === "string" ? record.name : undefined,
      message: typeof record.message === "string" ? record.message : undefined,
    };
  }

  return {};
}

export function useSiweAuth(): UseSiweAuthReturn {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRef = useRef(false);

  const { address } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { switchChainAsync } = useSwitchChain();
  const { setUser } = useAuthStore();

  const verifyAndLink = useCallback(async () => {
    if (inFlightRef.current) return;

    if (!address) {
      setError("No wallet connected. Please connect your wallet first.");
      return;
    }

    inFlightRef.current = true;
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
    } catch (err: unknown) {
      const details = getErrorDetails(err);
      if (details.code === 4001 || details.name === "UserRejectedRequestError") {
        setError("Signature request rejected. Please try again.");
      } else if (details.name === "SwitchChainError") {
        setError("Please switch to Base Sepolia in your wallet and try again.");
      } else {
        setError(details.message || "Wallet verification failed.");
      }
    } finally {
      inFlightRef.current = false;
      setIsConnecting(false);
    }
  }, [address, chainId, setUser, signMessageAsync, switchChainAsync]);

  return {
    isConnecting,
    error,
    verifyAndLink,
    clearError: () => setError(null),
  };
}
