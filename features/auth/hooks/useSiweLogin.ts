import { useCallback, useRef, useState } from "react";
import {
  useAccount,
  useChainId,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from "wagmi";
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
  const { disconnectAsync } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { setUser, loadProfile } = useAuthStore();

  /**
   * Primary login flow.
   * - If no wallet is connected in Wagmi → open RainbowKit modal and stop.
   *   The user picks a wallet, Wagmi connects it, and can call this again.
   * - If a wallet IS connected → request challenge, sign, verify with backend.
   */
  const loginWithWallet = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      // 1. No wallet connected → let the user pick one
      if (!isConnected || !address) {
        if (openConnectModal) {
          openConnectModal();
          return; // stop here — wait for user to connect via modal
        } else {
          throw new Error("Wallet connection modal is unavailable.");
        }
      }

      // 2. Ensure correct chain
      if (chainId !== SUPPORTED_CHAIN.id) {
        await switchChainAsync({ chainId: SUPPORTED_CHAIN.id });
      }

      // 3. Fetch the challenge message from the backend
      const message = await getSiweChallenge(address);

      // 4. Ask wallet to sign it
      const signature = await signMessageAsync({ message });

      // 5. Verify signature with backend → returns the user object
      const user = await verifySiweSignature({ address, signature });

      // 6. Persist in store and redirect (redirect handled by Web3Providers via useEffect)
      setUser(user);
      await loadProfile();
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

  /**
   * Disconnect the current Wagmi account, then immediately open the
   * RainbowKit connector picker so the user can choose a different wallet.
   *
   * Used by "Use a different wallet" and the "Other Wallets" button when a
   * wallet is already connected — prevents being silently locked into the
   * currently-connected account.
   */
  const disconnectAndReconnect = useCallback(async () => {
    try {
      await disconnectAsync();
    } catch {
      // Even if disconnect throws, we still want to open the modal
    }
    // Short delay so Wagmi state propagates before RainbowKit reads isConnected
    await new Promise<void>((r) => setTimeout(r, 80));
    if (openConnectModal) {
      openConnectModal();
    }
  }, [disconnectAsync, openConnectModal]);

  return {
    isLoading,
    error,
    loginWithWallet,
    disconnectAndReconnect,
    clearError: () => setError(null),
  };
}