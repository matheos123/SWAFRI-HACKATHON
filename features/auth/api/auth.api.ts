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
  const response = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );
  const authHeader =
    response.headers["authorization"] || response.headers["Authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    if (typeof window !== "undefined") {
      localStorage.setItem("rps_token", token);
    }
  }
  return response.data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);

  // Log all response headers in dev to find where the token is
  if (process.env.NODE_ENV === "development") {
    console.log("[auth] login response headers:", response.headers);
    console.log("[auth] login response data:", response.data);
  }

  // Check common token header locations
  const authHeader =
    response.headers["authorization"] ||
    response.headers["Authorization"] ||
    response.headers["x-access-token"] ||
    response.headers["x-auth-token"];

  if (authHeader) {
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;
    if (typeof window !== "undefined") {
      localStorage.setItem("rps_token", token);
    }
  }

  // Also check if token is nested in data
  const bodyToken =
    (response.data as any)?.data?.token || (response.data as any)?.token;
  if (bodyToken && typeof window !== "undefined") {
    localStorage.setItem("rps_token", bodyToken);
  }

  return response.data;
}

export async function fetchProfile(): Promise<AuthUser> {
  const { data } = await apiClient.get<ProfileResponse>("/auth/profile");
  return data.data;
}
