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

export interface PublicUserProfile {
  id: string;
  username: string;
  avatar: string | null;
  walletAddress: string | null;
  blockchainProfileId: string | null;
  wins: number;
  losses: number;
  totalMatches: number;
  points: number;
  currentStreak: number;
  longestStreak: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  deletedAt: string | null;
  avatar?: string | null;
  walletAddress?: string | null;
  wins: number;
  losses: number;
  totalMatches: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUsersFilters {
  page?: number;
  limit?: number;
  role?: "USER" | "ADMIN";
  isActive?: boolean;
  search?: string;
}

export interface AdminUsersResult {
  items: AdminUser[];
  page: number;
  limit: number;
  total: number | null;
  totalPages: number | null;
  hasNext: boolean | null;
  hasPrev: boolean | null;
}

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalItems?: number;
  };
  page?: number;
  limit?: number;
  total?: number;
  totalItems?: number;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseAdminUsersResponse(
  payload: unknown,
  fallbackPage: number,
  fallbackLimit: number,
): AdminUsersResult {
  if (Array.isArray(payload)) {
    return {
      items: payload as AdminUser[],
      page: fallbackPage,
      limit: fallbackLimit,
      total: payload.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: fallbackPage > 1,
    };
  }

  const envelope = isObject(payload) ? (payload as ApiEnvelope<unknown>) : null;
  const nested = envelope?.data;

  if (Array.isArray(nested)) {
    const page = envelope?.meta?.page ?? envelope?.page ?? fallbackPage;
    const limit = envelope?.meta?.limit ?? envelope?.limit ?? fallbackLimit;
    const total =
      envelope?.meta?.total ??
      envelope?.meta?.totalItems ??
      envelope?.total ??
      envelope?.totalItems ??
      nested.length;

    return {
      items: nested as AdminUser[],
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }

  if (isObject(nested)) {
    const nestedItems = nested.data;
    if (Array.isArray(nestedItems)) {
      const nestedMeta = isObject(nested.meta)
        ? (nested.meta as ApiEnvelope<unknown>["meta"])
        : undefined;
      const page =
        nestedMeta?.page ??
        (typeof nested.page === "number" ? nested.page : undefined) ??
        fallbackPage;
      const limit =
        nestedMeta?.limit ??
        (typeof nested.limit === "number" ? nested.limit : undefined) ??
        fallbackLimit;
      const total =
        nestedMeta?.total ??
        nestedMeta?.totalItems ??
        (typeof nested.total === "number" ? nested.total : null) ??
        (typeof nested.totalItems === "number" ? nested.totalItems : null) ??
        nestedItems.length;

      return {
        items: nestedItems as AdminUser[],
        page,
        limit,
        total,
        totalPages:
          typeof nested.totalPages === "number"
            ? nested.totalPages
            : total !== null
              ? Math.max(1, Math.ceil(total / limit))
              : null,
        hasNext:
          typeof nested.hasNext === "boolean"
            ? nested.hasNext
            : total !== null
              ? page * limit < total
              : null,
        hasPrev:
          typeof nested.hasPrev === "boolean"
            ? nested.hasPrev
            : page > 1,
      };
    }
  }

  return {
    items: [],
    page: fallbackPage,
    limit: fallbackLimit,
    total: null,
    totalPages: null,
    hasNext: null,
    hasPrev: null,
  };
}

export async function getPublicUserProfile(
  userId: string,
): Promise<PublicUserProfile> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: PublicUserProfile;
  }>(`/users/${userId}`);
  return data.data;
}

export async function getAdminUsers(
  filters: AdminUsersFilters = {},
): Promise<AdminUsersResult> {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;

  const { data } = await apiClient.get("/users", {
    params: {
      page,
      limit,
      role: filters.role,
      isActive: filters.isActive,
      search: filters.search || undefined,
    },
  });

  return parseAdminUsersResponse(data, page, limit);
}

export async function updateUserRole(
  userId: string,
  role: "USER" | "ADMIN",
): Promise<AdminUser> {
  const { data } = await apiClient.patch<{ data: AdminUser }>(
    `/users/${userId}/role`,
    { role },
  );
  return data.data;
}

export async function activateUser(userId: string): Promise<AdminUser> {
  const { data } = await apiClient.patch<{ data: AdminUser }>(
    `/users/${userId}/activate`,
  );
  return data.data;
}

export async function deactivateUser(userId: string): Promise<AdminUser> {
  const { data } = await apiClient.patch<{ data: AdminUser }>(
    `/users/${userId}/deactivate`,
  );
  return data.data;
}

export async function softDeleteUser(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`);
}

export async function restoreUser(userId: string): Promise<AdminUser> {
  const { data } = await apiClient.post<{ data: AdminUser }>(
    `/users/${userId}/restore`,
  );
  return data.data;
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
