import apiClient from "@/shared/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WalletChallengeResponse {
  success: boolean;
  data: {
    message: string; // exact message to sign
    nonce: string;
  };
}

export interface ConnectWalletPayload {
  walletAddress: string;
  signature: string;
}

export interface WalletConnectResult {
  connected: boolean;
  walletAddress: string;
  blockchainProfileId: string;
  verifiedAt: string;
}

export interface ConnectWalletResponse {
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

// ─── Endpoints ────────────────────────────────────────────────────────────────

/** Step 1: Get the challenge message the user must sign */
export async function getWalletChallenge(
  address: string,
): Promise<{ message: string; nonce: string }> {
  const { data } = await apiClient.get<WalletChallengeResponse>(
    `/wallet/challenge`,
    { params: { address } },
  );
  return data.data;
}

/** Step 3: Submit wallet address + signature to link wallet */
export async function connectWallet(
  payload: ConnectWalletPayload,
): Promise<WalletConnectResult> {
  const { data } = await apiClient.post<ConnectWalletResponse>(
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
