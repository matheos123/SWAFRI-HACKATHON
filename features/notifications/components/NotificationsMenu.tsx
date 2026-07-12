"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import {
  countUnreadNotifications,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  NotificationItem,
} from "@/features/notifications/api/notifications.api";

interface NotificationsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export default function NotificationsMenu({
  isOpen,
  onClose,
}: NotificationsMenuProps) {
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(20, 0),
    enabled: isOpen,
  });

  const items = notificationsQuery.data?.items ?? [];
  const unreadCount = countUnreadNotifications(items);

  const updateCachedItems = (
    updater: (current: NotificationItem[]) => NotificationItem[],
  ) => {
    queryClient.setQueryData(
      ["notifications"],
      (current: { items: NotificationItem[]; unreadCount: number } | undefined) => {
        const currentItems = current?.items ?? [];
        const nextItems = updater(currentItems);
        return {
          items: nextItems,
          unreadCount: countUnreadNotifications(nextItems),
        };
      },
    );
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id) => {
      updateCachedItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, isRead: true } : item,
        ),
      );
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      updateCachedItems((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full z-50 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-800 bg-[#0D1324]/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-800 px-2 pb-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            Notifications
          </h3>
          <p className="mt-1 text-[11px] text-slate-500">
            {unreadCount ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>

        <button
          onClick={() => markAllMutation.mutate()}
          disabled={!items.length || !unreadCount || markAllMutation.isPending}
          className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/20 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-950/20 disabled:opacity-50"
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Read all
        </button>
      </div>

      <div className="mt-3 max-h-96 space-y-2 overflow-y-auto pr-1">
        {notificationsQuery.isLoading ? (
          <div className="flex h-24 items-center justify-center text-cyan-300">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : notificationsQuery.error instanceof Error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3 text-xs text-rose-300">
            {notificationsQuery.error.message}
          </div>
        ) : items.length ? (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (!item.isRead) {
                  markReadMutation.mutate(item.id);
                }
              }}
              className={`w-full rounded-xl border p-3 text-left transition ${
                item.isRead
                  ? "border-slate-800 bg-slate-950/30"
                  : "border-cyan-500/20 bg-cyan-950/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 rounded-full p-1.5 ${
                    item.isRead
                      ? "bg-slate-800 text-slate-500"
                      : "bg-cyan-500/10 text-cyan-300"
                  }`}
                >
                  <Bell className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      {item.type.replaceAll("_", " ")}
                    </span>
                    {!item.isRead ? (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-white">
                    {item.message}
                  </p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {formatTimestamp(item.createdAt)}
                  </p>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-5 text-center">
            <p className="text-sm text-slate-400">No notifications yet.</p>
          </div>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={onClose}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
