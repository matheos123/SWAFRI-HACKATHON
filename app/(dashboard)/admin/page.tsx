"use client";

import { useState } from "react";

type Status = "Active" | "Inactive" | "Suspended";

type Player = {
  id: number;
  name: string;
  email: string;
  status: Status;
};

export default function AdminPage() {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: "Lydia",
      email: "lydiakebede546@gmail.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Beza",
      email: "bezawitalemuk@gmail.com",
      status: "Inactive",
    },
  ]);

  function changeStatus(id: number, status: Status) {
    setPlayers((current) =>
      current.map((player) =>
        player.id === id ? { ...player, status } : player,
      ),
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview */}

      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <p className="text-gray-400 mt-2">
          Manage players, matches and platform activities.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-[#0D1324] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400">Total Players</p>

          <h2 className="text-3xl font-bold mt-2">12540</h2>
        </div>

        <div className="bg-[#0D1324] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400">Active Players</p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">3420</h2>
        </div>

        <div className="bg-[#0D1324] border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400">Suspended Players</p>

          <h2 className="text-3xl font-bold text-red-400 mt-2">25</h2>
        </div>
      </div>

      {/* Player Control */}

      <div>
        <h2 className="text-xl font-bold mb-4">Player Management</h2>

        <div
          className="
bg-[#0D1324]
border border-gray-800
rounded-xl
overflow-hidden 
"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="p-4 text-left">Player</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Status</th>

                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-b border-gray-800">
                  <td className="p-4">{player.name}</td>

                  <td className="p-4 text-gray-400">{player.email}</td>

                  <td className="p-4">
                    <span
                      className={
                        player.status === "Active"
                          ? "text-green-400"
                          : player.status === "Inactive"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }
                    >
                      {player.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => changeStatus(player.id, "Active")}
                        className="
px-3 py-2
rounded-lg
bg-green-600/20
text-green-400
text-xs
"
                      >
                        Activate
                      </button>

                      <button
                        onClick={() => changeStatus(player.id, "Inactive")}
                        className="
px-3 py-2
rounded-lg
bg-yellow-600/20
text-yellow-400
text-xs
"
                      >
                        Deactivate
                      </button>

                      <button
                        onClick={() => changeStatus(player.id, "Suspended")}
                        className="
px-3 py-2
rounded-lg
bg-red-600/20
text-red-400
text-xs
"
                      >
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Admin Sections */}

      <div className="grid md:grid-cols-2 gap-5">
        <div
          className="
bg-[#0D1324]
border border-gray-800
rounded-xl
p-5
"
        >
          <h2 className="font-bold mb-3">Match Monitoring</h2>

          <p className="text-gray-400 text-sm">
            View active games, suspicious matches and terminate unfair games.
          </p>

          <button
            className="
mt-4
px-4
py-2
rounded-lg
bg-purple-600
text-sm
"
          >
            View Matches
          </button>
        </div>

        <div
          className="
bg-[#0D1324]
border border-gray-800
rounded-xl
p-5
"
        >
          <h2 className="font-bold mb-3">Reports</h2>

          <p className="text-gray-400 text-sm">
            Review player complaints and security reports.
          </p>

          <button
            className="
mt-4
px-4
py-2
rounded-lg
bg-purple-600
text-sm
"
          >
            Review Reports
          </button>
        </div>
      </div>
    </div>
  );
}
