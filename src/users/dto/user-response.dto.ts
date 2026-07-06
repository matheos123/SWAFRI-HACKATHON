import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid' })
  id!: string;

  @ApiProperty({ example: 'player1' })
  username!: string;

  @ApiProperty({ example: 'player@example.com' })
  email!: string;

  @ApiProperty({ example: 'https://example.com/avatar.png', required: false })
  avatar?: string;

  @ApiProperty({ example: '0xabc123abc123abc123abc123abc123abc123abc1', required: false })
  walletAddress?: string;

  @ApiProperty({ example: 10 })
  wins!: number;

  @ApiProperty({ example: 5 })
  losses!: number;

  @ApiProperty({ example: 15 })
  totalMatches!: number;

  @ApiProperty({ example: 2 })
  currentStreak!: number;

  @ApiProperty({ example: 4 })
  longestStreak!: number;

  @ApiProperty({ example: 1200 })
  points!: number;

  @ApiProperty({ example: '2026-07-06T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-07-06T12:00:00.000Z' })
  updatedAt!: Date;
}
