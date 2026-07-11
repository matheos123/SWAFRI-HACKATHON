import apiClient from "@/shared/lib/axios";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: string;
}

export interface EarnedAchievement {
  id: string;
  earnedAt: string;
  achievement: {
    name: string;
    description: string;
    iconUrl: string;
  };
}

export async function getAllAchievements(): Promise<Achievement[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: Achievement[];
  }>("/achievements");
  return data.data;
}

export async function getMyAchievements(): Promise<EarnedAchievement[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: EarnedAchievement[];
  }>("/achievements/me");
  return data.data;
}

export async function getUserAchievements(
  userId: string,
): Promise<EarnedAchievement[]> {
  const { data } = await apiClient.get<{
    success: boolean;
    data: EarnedAchievement[];
  }>(`/achievements/user/${userId}`);
  return data.data;
}
