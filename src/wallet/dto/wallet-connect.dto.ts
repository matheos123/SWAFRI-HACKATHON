import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class WalletConnectDto {
  @ApiProperty({ example: '0xabc123abc123abc123abc123abc123abc123abc1' })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'walletAddress must be a valid Ethereum address',
  })
  walletAddress!: string;
}
