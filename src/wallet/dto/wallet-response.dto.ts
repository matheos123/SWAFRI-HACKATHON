import { ApiProperty } from '@nestjs/swagger';

export class WalletResponseDto {
  @ApiProperty({ example: true })
  connected!: boolean;

  @ApiProperty({ example: '0xabc123abc123abc123abc123abc123abc123abc1', required: false })
  walletAddress?: string;
}
