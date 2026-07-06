import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';
import { WalletConnectDto } from './dto/wallet-connect.dto';
import { WalletResponseDto } from './dto/wallet-response.dto';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('connect')
  @ApiOkResponse({ type: WalletResponseDto })
  async connect(@Req() request: any, @Body() walletConnectDto: WalletConnectDto) {
    return this.walletService.connect(request.user.userId, walletConnectDto.walletAddress);
  }

  @Post('disconnect')
  @ApiOkResponse({ type: WalletResponseDto })
  async disconnect(@Req() request: any) {
    return this.walletService.disconnect(request.user.userId);
  }

  @Get('status')
  @ApiOkResponse({ type: WalletResponseDto })
  async status(@Req() request: any) {
    return this.walletService.status(request.user.userId);
  }
}
