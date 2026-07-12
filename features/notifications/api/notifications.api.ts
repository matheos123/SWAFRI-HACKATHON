import apiClient from "@/shared/lib/axios";

type UnknownRecord = Record<string, unknown>;

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown> | null;
}

export interface NotificationsResult {
  items: NotificationItem[];
  unreadCount: number;
}

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function pickString(record: UnknownRecord | null, keys: string[]): string | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function pickBoolean(record: UnknownRecord | null, keys: string[]): boolean | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "boolean") return value;
  }
  return null;
}

function normalizeNotification(raw: unknown): NotificationItem {
  const record = asRecord(raw);
  const nestedData = asRecord(record?.data) ?? null;

  return {
    id:
      pickString(record, ["id", "notificationId"]) ??
      `notification-${pickString(record, ["createdAt"]) ?? Date.now()}`,
    type: pickString(record, ["type"]) ?? "info",
    message: pickString(record, ["message", "content"]) ?? "New notification",
    isRead:
      pickBoolean(record, ["isRead", "read", "opened"]) ??
      pickBoolean(nestedData, ["isRead", "read", "opened"]) ??
      false,
    createdAt:
      pickString(record, ["createdAt", "timestamp", "updatedAt"]) ??
      new Date().toISOString(),
    data: nestedData,
  };
}

function unwrapList(payload: unknown): NotificationItem[] {
  if (Array.isArray(payload)) {
    return payload.map(normalizeNotification);
  }

  const record = asRecord(payload);
  if (!record) return [];

  if (Array.isArray(record.data)) {
    return record.data.map(normalizeNotification);
  }

  const nested = asRecord(record.data);
  if (nested && Array.isArray(nested.data)) {
    return nested.data.map(normalizeNotification);
  }

  if (nested && Array.isArray(nested.items)) {
    return nested.items.map(normalizeNotification);
  }

  if (Array.isArray(record.items)) {
    return record.items.map(normalizeNotification);
  }

  return [];
}

export function countUnreadNotifications(items: NotificationItem[]): number {
  return items.reduce((count, item) => count + (item.isRead ? 0 : 1), 0);
}

export async function getNotifications(
  limit = 20,
  offset = 0,
): Promise<NotificationsResult> {
  const { data } = await apiClient.get("/notifications", {
    params: { limit, offset },
  });
  const items = unwrapList(data);
  return {
    items,
    unreadCount: countUnreadNotifications(items),
  };
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch("/notifications/read-all");
}
