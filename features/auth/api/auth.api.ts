import apiClient from "@/shared/lib/axios";

//Types

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
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
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
  timestamp: string;
}

export interface ProfileResponse {
  success: boolean;
  data: AuthUser; // profile endpoint returns user directly under data
  timestamp: string;
}

//Endpoints

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );
  return data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function logoutUser(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function fetchProfile(): Promise<AuthUser> {
  const { data } = await apiClient.get<ProfileResponse>("/auth/profile");
  return data.data;
}
