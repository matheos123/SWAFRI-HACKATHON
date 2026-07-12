"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCcw, ShieldAlert, Trash2, UserCog } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  activateUser,
  AdminUser,
  deactivateUser,
  getAdminUsers,
  restoreUser,
  softDeleteUser,
  updateUserRole,
} from "@/features/users/api/users.api";

function getUserStatus(user: AdminUser): "ACTIVE" | "INACTIVE" | "ARCHIVED" {
  if (user.deletedAt) return "ARCHIVED";
  return user.isActive ? "ACTIVE" : "INACTIVE";
}

export default function AdminPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;

  const usersQuery = useQuery({
    queryKey: ["admin", "users", { page, limit }],
    queryFn: () => getAdminUsers({ page, limit }),
    enabled: user?.role === "ADMIN",
  });

  const summaryQuery = useQuery({
    queryKey: ["admin", "users", "summary"],
    queryFn: async () => {
      const [all, active, inactive] = await Promise.all([
        getAdminUsers({ page: 1, limit: 1 }),
        getAdminUsers({ page: 1, limit: 1, isActive: true }),
        getAdminUsers({ page: 1, limit: 1, isActive: false }),
      ]);

      return {
        total: all.total,
        active: active.total,
        inactive: inactive.total,
      };
    },
    enabled: user?.role === "ADMIN",
  });

  const refreshAdminQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] }),
      queryClient.invalidateQueries({ queryKey: ["admin", "users", "summary"] }),
    ]);
  };

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "USER" | "ADMIN" }) =>
      updateUserRole(userId, role),
    onSuccess: refreshAdminQueries,
  });

  const activateMutation = useMutation({
    mutationFn: activateUser,
    onSuccess: refreshAdminQueries,
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateUser,
    onSuccess: refreshAdminQueries,
  });

  const deleteMutation = useMutation({
    mutationFn: softDeleteUser,
    onSuccess: refreshAdminQueries,
  });

  const restoreMutation = useMutation({
    mutationFn: restoreUser,
    onSuccess: refreshAdminQueries,
  });

  const actionError =
    roleMutation.error ??
    activateMutation.error ??
    deactivateMutation.error ??
    deleteMutation.error ??
    restoreMutation.error;

  const items = usersQuery.data?.items ?? [];
  const total = usersQuery.data?.total;
  const totalPages =
    usersQuery.data?.totalPages ??
    (total ? Math.max(1, Math.ceil(total / limit)) : 1);
  const counts = useMemo(
    () => ({
      total: summaryQuery.data?.total ?? null,
      active: summaryQuery.data?.active ?? null,
      inactive: summaryQuery.data?.inactive ?? null,
    }),
    [summaryQuery.data],
  );

  if (!user) return null;

  if (user.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-rose-500/20 bg-[#0D1324] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-white">Admin access required</h1>
        <p className="mt-2 text-sm text-slate-400">
          This workspace is connected, but your current account does not have the
          backend admin role needed for user management.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage live user accounts, access states, and platform roles from the
            backend instead of local mock data.
          </p>
        </div>

        <button
          onClick={() => void refreshAdminQueries()}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-950/20"
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-[#0D1324] p-5">
          <p className="text-sm text-slate-400">Total Users</p>
          <h2 className="mt-2 text-3xl font-black text-white">
            {counts.total ?? "—"}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0D1324] p-5">
          <p className="text-sm text-slate-400">Active Users</p>
          <h2 className="mt-2 text-3xl font-black text-emerald-400">
            {counts.active ?? "—"}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0D1324] p-5">
          <p className="text-sm text-slate-400">Inactive Users</p>
          <h2 className="mt-2 text-3xl font-black text-amber-300">
            {counts.inactive ?? "—"}
          </h2>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-[#0D1324] p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">User Management</h2>
            <p className="mt-1 text-sm text-slate-400">
              Live backend user list with account actions.
            </p>
          </div>
        </div>

        {actionError instanceof Error ? (
          <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-950/10 px-4 py-3 text-sm text-rose-300">
            {actionError.message}
          </p>
        ) : null}

        <div className="mt-5 space-y-3 lg:hidden">
          {usersQuery.isLoading ? (
            <div className="rounded-xl border border-slate-800 px-4 py-8 text-center text-cyan-300">
              <div className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading users...
              </div>
            </div>
          ) : usersQuery.error instanceof Error ? (
            <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 px-4 py-6 text-sm text-rose-300">
              {usersQuery.error.message}
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-slate-800 px-4 py-6 text-sm text-slate-500">
              No users matched the current filters.
            </div>
          ) : (
            items.map((account) => {
              const status = getUserStatus(account);
              const isBusy =
                roleMutation.isPending ||
                activateMutation.isPending ||
                deactivateMutation.isPending ||
                deleteMutation.isPending ||
                restoreMutation.isPending;

              return (
                <article
                  key={account.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {account.username}
                      </p>
                      <p className="mt-1 break-all text-[11px] text-slate-500">
                        {account.email}
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                      {account.role}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{account.points} pts</span>
                    <span>{account.totalMatches} matches</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {status === "ARCHIVED" ? (
                      <button
                        onClick={() => restoreMutation.mutate(account.id)}
                        disabled={isBusy}
                        className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300"
                      >
                        Restore
                      </button>
                    ) : (
                      <>
                        {account.isActive ? (
                          <button
                            onClick={() => deactivateMutation.mutate(account.id)}
                            disabled={isBusy}
                            className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => activateMutation.mutate(account.id)}
                            disabled={isBusy}
                            className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300"
                          >
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Archive ${account.username}? You can restore the account later.`,
                              )
                            ) {
                              deleteMutation.mutate(account.id);
                            }
                          }}
                          disabled={isBusy}
                          className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300"
                        >
                          Archive
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>

        <div className="mt-5 hidden overflow-x-hidden rounded-xl border border-slate-800 lg:block">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-slate-800 text-left text-[11px] uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4 py-3">Player</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Matches</th>
                <th className="px-4 py-3">Points</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
              {usersQuery.isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-cyan-300">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : usersQuery.error instanceof Error ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-rose-300">
                    {usersQuery.error.message}
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                    No users matched the current filters.
                  </td>
                </tr>
              ) : (
                items.map((account) => {
                  const status = getUserStatus(account);
                  const isBusy =
                    roleMutation.isPending ||
                    activateMutation.isPending ||
                    deactivateMutation.isPending ||
                    deleteMutation.isPending ||
                    restoreMutation.isPending;

                  return (
                    <tr key={account.id} className="hover:bg-slate-950/30">
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {account.username}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {account.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-400">{account.email}</td>
                      <td className="px-4 py-4">
                        <select
                          value={account.role}
                          disabled={isBusy}
                          onChange={(event) =>
                            roleMutation.mutate({
                              userId: account.id,
                              role: event.target.value as "USER" | "ADMIN",
                            })
                          }
                          className="rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1 text-xs text-white outline-none"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                            status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-300"
                              : status === "INACTIVE"
                                ? "bg-amber-500/10 text-amber-300"
                                : "bg-rose-500/10 text-rose-300"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {account.totalMatches}
                      </td>
                      <td className="px-4 py-4 text-cyan-300">{account.points}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          {status === "ARCHIVED" ? (
                            <button
                              onClick={() => restoreMutation.mutate(account.id)}
                              disabled={isBusy}
                              className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                            >
                              Restore
                            </button>
                          ) : (
                            <>
                              {account.isActive ? (
                                <button
                                  onClick={() => deactivateMutation.mutate(account.id)}
                                  disabled={isBusy}
                                  className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/15 disabled:opacity-50"
                                >
                                  Deactivate
                                </button>
                              ) : (
                                <button
                                  onClick={() => activateMutation.mutate(account.id)}
                                  disabled={isBusy}
                                  className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Archive ${account.username}? You can restore the account later.`,
                                    )
                                  ) {
                                    deleteMutation.mutate(account.id);
                                  }
                                }}
                                disabled={isBusy}
                                className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/15 disabled:opacity-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Archive
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              {usersQuery.data?.items.length
                ? `Showing page ${page}${total ? ` of ${totalPages}` : ""}`
                : "No rows to display"}
            </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || usersQuery.isLoading}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-white">
              {page}
            </span>
            <button
              onClick={() => setPage((current) => current + 1)}
              disabled={
                usersQuery.isLoading ||
                usersQuery.data?.hasNext === false
              }
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-[#0D1324] p-5">
          <div className="flex items-center gap-2 text-white">
            <UserCog className="h-5 w-5 text-cyan-400" />
            <h2 className="font-bold">Live Admin Controls</h2>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Role changes, activation state, and archive/restore actions now call
            the documented backend admin endpoints directly.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#0D1324] p-5">
          <div className="flex items-center gap-2 text-white">
            <ShieldAlert className="h-5 w-5 text-amber-300" />
            <h2 className="font-bold">Backend Model</h2>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            The backend supports `isActive`, soft-delete, restore, and role
            updates. This panel mirrors those real controls instead of the older
            mock “suspend” state.
          </p>
        </div>
      </div>
    </div>
  );
}
