import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Squad, SquadMember } from "@/shared/types";

function dedupeMembers(members: SquadMember[]): SquadMember[] {
  const seen = new Set<string>();

  return members.filter((member) => {
    if (seen.has(member.id)) {
      return false;
    }

    seen.add(member.id);
    return true;
  });
}

interface SquadState {
  squad: Squad | null;
  squads: Squad[];
  squadMembers: SquadMember[];
  squadMembersByName: Record<string, SquadMember[]>;
  activeSquadName: string | null;
  initializeSquad: (
    name: string,
    privacy: "Public" | "Encrypted" | "Cloaked",
    leader?: { id: string; username: string },
  ) => void;
  disbandSquad: () => void;
  setActiveSquad: (name: string) => void;
  updateSquadName: (name: string) => void;
  updateSquadPrivacy: (privacy: "Public" | "Encrypted" | "Cloaked") => void;
  addMember: (member: Pick<SquadMember, "id" | "username" | "avatarUrl">) => void;
  kickMember: (id: string) => void;
  toggleMute: (id: string) => void;
  getActiveSquadRoomId: () => string | null;
  isMemberOfSquadRoom: (roomId: string, userId?: string) => boolean;
}

type PersistedSquadState = Partial<
  Pick<
    SquadState,
    "squad" | "squads" | "squadMembers" | "squadMembersByName" | "activeSquadName"
  >
>;

export function getSquadRoomId(squadName: string): string {
  return `squad-${squadName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export const useSquadStore = create<SquadState>()(
  persist(
    (set, get) => ({
      squad: null,
      squads: [],
      squadMembers: [],
      squadMembersByName: {},
      activeSquadName: null,

      initializeSquad: (name, privacy, leader) => {
        const normalizedName = name.trim().toUpperCase();
        const squad: Squad = {
          name: normalizedName,
          privacy,
          membersCount: 1,
          status: "ACTIVE",
          maxMembers: 5,
          winRate: "78%",
          winRateTrend: "+4.2%",
          totalOnChainWins: 42,
          globalStanding: "#1,402",
        };
        const members: SquadMember[] = [
          {
            id: leader?.id ?? "leader",
            username: leader?.username ?? "Commander",
            verified: true,
            ping: "24ms",
            statusText: "Ready",
            status: "online",
            rank: "LEGEND",
            role: "LEADER",
            micMuted: false,
          },
        ];

        set((state) => {
          const otherSquads = state.squads.filter((item) => item.name !== normalizedName);
          return {
            squad,
            squads: [...otherSquads, squad],
            activeSquadName: normalizedName,
            squadMembers: members,
            squadMembersByName: {
              ...state.squadMembersByName,
              [normalizedName]: members,
            },
          };
        });
      },

      disbandSquad: () =>
        set((state) => {
          if (!state.squad) {
            return {
              squad: null,
              squadMembers: [],
              activeSquadName: null,
            };
          }

          const remainingSquads = state.squads.filter(
            (item) => item.name !== state.squad?.name,
          );
          const remainingMembers = { ...state.squadMembersByName };
          delete remainingMembers[state.squad.name];
          const nextSquad = remainingSquads[0] ?? null;

          return {
            squad: nextSquad,
            squads: remainingSquads,
            activeSquadName: nextSquad?.name ?? null,
            squadMembers: nextSquad ? remainingMembers[nextSquad.name] ?? [] : [],
            squadMembersByName: remainingMembers,
          };
        }),

      setActiveSquad: (name) =>
        set((state) => {
          const nextSquad = state.squads.find((item) => item.name === name);
          if (!nextSquad) return state;

          return {
            squad: nextSquad,
            activeSquadName: nextSquad.name,
            squadMembers: state.squadMembersByName[nextSquad.name] ?? [],
          };
        }),

      updateSquadName: (name) =>
        set((state) => {
          if (!state.squad) return state;
          const normalizedName = name.trim().toUpperCase();
          const previousName = state.squad.name;
          const updatedSquad = { ...state.squad, name: normalizedName };
          const previousMembers =
            state.squadMembersByName[previousName] ?? state.squadMembers;
          const remainingMembers = { ...state.squadMembersByName };
          delete remainingMembers[previousName];

          return {
            squad: updatedSquad,
            squads: state.squads.map((item) =>
              item.name === previousName ? updatedSquad : item,
            ),
            activeSquadName: normalizedName,
            squadMembersByName: {
              ...remainingMembers,
              [normalizedName]: previousMembers,
            },
          };
        }),

      updateSquadPrivacy: (privacy) =>
        set((state) => {
          if (!state.squad) return state;
          const updatedSquad = { ...state.squad, privacy };

          return {
            squad: updatedSquad,
            squads: state.squads.map((item) =>
              item.name === updatedSquad.name ? updatedSquad : item,
            ),
          };
        }),

      addMember: (member) =>
        set((state) => {
          if (!state.squad) return state;

          const currentMembers = dedupeMembers(
            state.squadMembersByName[state.squad.name] ?? state.squadMembers,
          );
          if (currentMembers.some((item) => item.id === member.id)) {
            return state;
          }

          if (currentMembers.length >= state.squad.maxMembers) {
            return state;
          }

          const nextMembers = dedupeMembers([
            ...currentMembers,
            {
              id: member.id,
              username: member.username,
              avatarUrl: member.avatarUrl,
              verified: false,
              ping: null,
              statusText: "Squad member",
              status: "online",
              rank: "ALLY",
              role: "OPERATIVE",
              micMuted: false,
            },
          ]);

          const updatedSquad = {
            ...state.squad,
            membersCount: nextMembers.length,
          };

          return {
            squad: updatedSquad,
            squads: state.squads.map((item) =>
              item.name === state.squad?.name
                ? { ...item, membersCount: nextMembers.length }
                : item,
            ),
            squadMembers: nextMembers,
            squadMembersByName: {
              ...state.squadMembersByName,
              [state.squad.name]: nextMembers,
            },
          };
        }),

      kickMember: (id) =>
        set((state) => {
          if (!state.squad) {
            return { squadMembers: state.squadMembers };
          }

          const nextMembers = dedupeMembers(
            state.squadMembers.filter((member) => member.id !== id),
          );
          const updatedSquad = {
            ...state.squad,
            membersCount: nextMembers.length,
          };

          return {
            squad: updatedSquad,
            squads: state.squads.map((item) =>
              item.name === state.squad?.name
                ? { ...item, membersCount: nextMembers.length }
                : item,
            ),
            squadMembers: nextMembers,
            squadMembersByName: {
              ...state.squadMembersByName,
              [state.squad.name]: nextMembers,
            },
          };
        }),

      toggleMute: (id) =>
        set((state) => {
          if (!state.squad) {
            return { squadMembers: state.squadMembers };
          }

          const nextMembers = state.squadMembers.map((member) =>
            member.id === id ? { ...member, micMuted: !member.micMuted } : member,
          );

          return {
            squadMembers: nextMembers,
            squadMembersByName: {
              ...state.squadMembersByName,
              [state.squad.name]: nextMembers,
            },
          };
        }),

      getActiveSquadRoomId: () => {
        const activeSquad = get().squad;
        return activeSquad ? getSquadRoomId(activeSquad.name) : null;
      },

      isMemberOfSquadRoom: (roomId, userId) => {
        const state = get();
        const squad = state.squads.find((item) => getSquadRoomId(item.name) === roomId);
        if (!squad) return false;

        if (!userId) return true;

        const members = state.squadMembersByName[squad.name] ?? [];
        return members.some((member) => member.id === userId);
      },
    }),
    {
      name: "squad-storage",
      migrate: (persistedState) => {
        const state = persistedState as PersistedSquadState;

        if (state.squads?.length) {
          const squadMembersByName = Object.fromEntries(
            Object.entries(state.squadMembersByName ?? {}).map(([name, members]) => [
              name,
              dedupeMembers(members ?? []),
            ]),
          );
          const activeSquadName = state.activeSquadName ?? state.squad?.name ?? null;

          return {
            ...state,
            squadMembersByName,
            squadMembers: activeSquadName
              ? squadMembersByName[activeSquadName] ?? dedupeMembers(state.squadMembers ?? [])
              : dedupeMembers(state.squadMembers ?? []),
            squads: state.squads.map((squad) => ({
              ...squad,
              membersCount: (squadMembersByName[squad.name] ?? []).length || squad.membersCount,
            })),
          };
        }
        if (!state.squad) return state;

        const squadMembers = dedupeMembers(state.squadMembers ?? []);

        return {
          ...state,
          squads: [state.squad],
          activeSquadName: state.squad.name,
          squadMembers,
          squadMembersByName: {
            [state.squad.name]: squadMembers,
          },
        };
      },
    },
  ),
);
