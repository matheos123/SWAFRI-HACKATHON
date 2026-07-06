import { ApiProperty } from '@nestjs/swagger';
import { UserProfile } from '../../users/interfaces/user.interface';

export class AuthResponseDto {
  @ApiProperty({ type: () => Object })
  user!: UserProfile;

  @ApiProperty({ example: 'access_token_value' })
  accessToken!: string;

  @ApiProperty({ example: 'refresh_token_value' })
  refreshToken!: string;
}
