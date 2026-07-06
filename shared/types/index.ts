export type Tab = 'lobby' | 'leaderboard' | 'profile' | 'settings';

export interface PlayerProfile {
  username: string;
  rank: string;
  title: string;
  level: number;
  reputation: number;
  reputationMax: number;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  walletConnected: boolean;
  walletAddress: string | null;
  balanceRPS: number;
  verified: boolean;
  avatarUrl: string;
}

export interface Badge {
  id: string;
  name: string;
  tier: 'Rare' | 'Legendary' | 'Artifact' | 'Common';
  description: string;
  unlocked: boolean;
  iconType: 'water' | 'fire' | 'gold' | 'wind' | 'earth';
  rarityColor: string;
  onChainId: string;
}

export interface Match {
  id: string;
  status: 'VICTORY' | 'DEFEAT';
  opponent: string;
  opponentLevel: number;
  score: string;
  rewardRP: number;
  rewardRPS: number;
  txId: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  score: number;
  winRate: string;
  status: 'online' | 'offline' | 'ingame';
  badgeType: 'gold' | 'silver' | 'bronze' | 'none';
}
