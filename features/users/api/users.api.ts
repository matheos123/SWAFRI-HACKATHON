import apiClient from "@/shared/lib/axios";
import { AuthUser } from "@/features/auth/api/auth.api";

export interface UpdateProfilePayload {
  username?: string;
  avatar?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  data: AuthUser;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<AuthUser> {
  const { data } = await apiClient.patch<UpdateProfileResponse>(
    "/users/me",
    payload,
  );
  return data.data;
}
