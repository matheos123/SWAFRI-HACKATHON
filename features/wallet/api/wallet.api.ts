import apiClient from "@/shared/lib/axios";

// ─── Types

export interface WalletChallengeResponse {
  success: boolean;
  message: string; // the exact message to sign
  nonce?: string;
}

export interface SiweVerifyPayload {
  address: string;
  signature: string;
}

export interface SiweVerifyResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      username: string;
      avatar: string | null;
      walletAddress: string | null;
      role: string;
      isActive: boolean;
      wins: number;
      losses: number;
      totalMatches: number;
      currentStreak: number;
      longestStreak: number;
      points: number;
      blockchainProfileId: string | null;
      walletVerifiedAt: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface WalletConnectPayload {
  walletAddress: string;
  signature: string;
}

export interface WalletConnectResult {
  connected: boolean;
  walletAddress: string;
  blockchainProfileId: string;
  verifiedAt: string;
}

export interface WalletConnectResponse {
  success: boolean;
  data: WalletConnectResult;
}

export interface WalletStatusResponse {
  success: boolean;
  data: {
    connected: boolean;
    walletAddress: string | null;
    walletVerifiedAt: string | null;
    blockchainProfileId: string | null;
  };
}

// ─── SIWE (Sign-In With Ethereum)
// Used when the wallet IS the login method (no email/password)

/** Step 1: Get the challenge message for SIWE login */
export async function getSiweChallenge(address: string): Promise<string> {
  const { data } = await apiClient.get<WalletChallengeResponse>(
    `/auth/wallet/challenge`,
    { params: { address: address.toLowerCase() } },
  );
  // Backend returns { success, data: { message, nonce } }
  return (data as any).data?.message ?? (data as any).message;
}

/** Step 3: Verify signature → logs in or registers the user */
export async function verifySiweSignature(
  payload: SiweVerifyPayload,
): Promise<SiweVerifyResponse["data"]["user"]> {
  const { data } = await apiClient.post<SiweVerifyResponse>(
    "/auth/wallet/verify",
    { address: payload.address.toLowerCase(), signature: payload.signature },
  );
  return data.data.user;
}

// ─── Wallet Connect (link wallet to existing email account)
// Used when the user already has an email account and wants to link a wallet

/** Step 1: Get the challenge message for wallet linking */
export async function getWalletChallenge(address: string): Promise<string> {
  const { data } = await apiClient.get<WalletChallengeResponse>(
    `/wallet/challenge`,
    { params: { address: address.toLowerCase() } },
  );
  return (data as any).data?.message ?? (data as any).message;
}

/** Step 3: Connect wallet to existing account */
export async function connectWallet(
  payload: WalletConnectPayload,
): Promise<WalletConnectResult> {
  const { data } = await apiClient.post<WalletConnectResponse>(
    "/wallet/connect",
    payload,
  );
  return data.data;
}

/** Get current wallet connection status */
export async function getWalletStatus(): Promise<WalletStatusResponse["data"]> {
  const { data } = await apiClient.get<WalletStatusResponse>("/wallet/status");
  return data.data;
}

/** Disconnect wallet */
export async function disconnectWallet(): Promise<void> {
  await apiClient.post("/wallet/disconnect");
}
