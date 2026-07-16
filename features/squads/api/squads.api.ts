import apiClient from "@/shared/lib/axios";
import { AuthUser } from "@/features/auth/api/auth.api";

export interface Squad {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SquadMember {
  squadId: string;
  userId: string;
  role: "LEADER" | "ADMIN" | "MEMBER";
  joinedAt: string;
  user: AuthUser;
}

export interface SquadInvite {
  id: string;
  squadId: string;
  inviterId: string;
  inviteeId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
  squad: Squad;
  inviter: AuthUser;
}

export interface CreateSquadPayload {
  name: string;
  description?: string;
}

export interface UpdateSquadPayload {
  name?: string;
  description?: string;
}

export interface RespondInvitePayload {
  accept: boolean;
}

export async function createSquad(payload: CreateSquadPayload): Promise<Squad> {
  const { data } = await apiClient.post<{ data: Squad }>("/squads", payload);
  return data.data;
}

export async function listMySquads(): Promise<Squad[]> {
  const { data } = await apiClient.get<{ data: Squad[] }>("/squads");
  return data.data;
}

export async function getSquadDetails(id: string): Promise<Squad> {
  const { data } = await apiClient.get<{ data: Squad }>(`/squads/${id}`);
  return data.data;
}

export async function updateSquad(id: string, payload: UpdateSquadPayload): Promise<Squad> {
  const { data } = await apiClient.patch<{ data: Squad }>(`/squads/${id}`, payload);
  return data.data;
}

export async function deleteSquad(id: string): Promise<void> {
  await apiClient.delete(`/squads/${id}`);
}

export async function inviteFriendToSquad(id: string, friendId: string): Promise<SquadInvite> {
  const { data } = await apiClient.post<{ data: SquadInvite }>(`/squads/${id}/invite`, { friendId });
  return data.data;
}

export async function getPendingInvites(): Promise<SquadInvite[]> {
  const { data } = await apiClient.get<{ data: SquadInvite[] }>("/squads/invites/pending");
  return data.data;
}

export async function respondToInvite(inviteId: string, payload: RespondInvitePayload): Promise<void> {
  await apiClient.post(`/squads/invites/${inviteId}/respond`, payload);
}

export async function listSquadMembers(id: string): Promise<SquadMember[]> {
  const { data } = await apiClient.get<{ data: SquadMember[] }>(`/squads/${id}/members`);
  return data.data;
}

export async function leaveSquad(id: string): Promise<void> {
  await apiClient.post(`/squads/${id}/leave`);
}

export async function kickSquadMember(squadId: string, userId: string): Promise<void> {
  await apiClient.delete(`/squads/${squadId}/members/${userId}`);
}

export async function updateSquadMemberRole(squadId: string, userId: string, role: "ADMIN" | "MEMBER"): Promise<SquadMember> {
  const { data } = await apiClient.patch<{ data: SquadMember }>(`/squads/${squadId}/members/${userId}/role`, { role });
  return data.data;
}
