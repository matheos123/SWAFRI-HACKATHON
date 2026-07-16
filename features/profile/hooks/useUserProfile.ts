import { useEffect } from 'react';
import { getSocket } from '@/shared/lib/socket';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useUserProfile() {
  const { user, loadProfile } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();

    const onMatchResult = (result: any) => {
      // If the current user won and it's a ranked match, refetch profile to update points/streaks
      if (result.winnerId === user.id && result.isRanked) {
        loadProfile();
      }
    };

    socket.on('game:match_result', onMatchResult);

    return () => {
      socket.off('game:match_result', onMatchResult);
    };
  }, [user, loadProfile]);

  return user;
}
