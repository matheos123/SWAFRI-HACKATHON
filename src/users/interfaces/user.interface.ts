export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar?: string | null;
  walletAddress?: string | null;
  wins: number;
  losses: number;
  totalMatches: number;
  currentStreak: number;
  longestStreak: number;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}
