import { useEffect, useState } from 'react';
import apiClient from '@/shared/lib/axios';
import { getSocket } from '@/shared/lib/socket';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: string;
}

export interface UserAchievement {
  id: string;
  earnedAt: string;
  achievement: Achievement;
}

export async function getAllBadges(): Promise<Achievement[]> {
  const { data } = await apiClient.get<{ data: Achievement[] }>('/achievements');
  return data.data;
}

export async function getMyBadges(): Promise<UserAchievement[]> {
  const { data } = await apiClient.get<{ data: UserAchievement[] }>('/achievements/me');
  return data.data;
}

export async function getUserBadges(userId: string): Promise<UserAchievement[]> {
  const { data } = await apiClient.get<{ data: UserAchievement[] }>(`/achievements/user/${userId}`);
  return data.data;
}

export function useAchievementNotifications(onUnlock: (badgeName: string, bonusPoints: number, iconUrl?: string) => void) {
  useEffect(() => {
    const socket = getSocket();

    const onNotification = (notification: any) => {
      if (notification.type === 'achievement_earned') {
        onUnlock(
          notification.data.badgeName,
          notification.data.bonusPoints,
          notification.data.iconUrl
        );
      }
    };

    socket.on('notification:live', onNotification);

    return () => {
      socket.off('notification:live', onNotification);
    };
  }, [onUnlock]);
}

export function useAchievements() {
  const [allBadges, setAllBadges] = useState<Achievement[]>([]);
  const [myBadges, setMyBadges] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBadges = async () => {
    setIsLoading(true);
    try {
      const [all, mine] = await Promise.all([
        getAllBadges(),
        getMyBadges()
      ]);
      setAllBadges(all);
      setMyBadges(mine);
    } catch (error) {
      console.error('Failed to load achievements', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  return { allBadges, myBadges, isLoading, refetch: fetchBadges };
}
