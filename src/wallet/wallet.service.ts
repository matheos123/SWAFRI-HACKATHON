import { BadRequestException, Injectable } from '@nestjs/common';
import { WalletRepository } from './repository/wallet.repository';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { SignatureService } from '../signature/signature.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly signatureService: SignatureService,
  ) {}

  async connect(userId: string, walletAddress: string) {
    const existing = await this.walletRepository.findByWalletAddress(walletAddress);
    if (existing && existing.id !== userId) {
      throw new BadRequestException('Wallet address already connected to another account');
    }

    const user = await this.walletRepository.connectWallet(userId, walletAddress);
    const { password, refreshToken, ...rest } = user;
    return {
      connected: true,
      walletAddress: rest.walletAddress,
    };
  }

  async disconnect(userId: string) {
    const user = await this.walletRepository.disconnectWallet(userId);
    return {
      connected: false,
      walletAddress: user.walletAddress ?? null,
    };
  }

  async status(userId: string) {
    const user = await this.walletRepository.findByUserId(userId);
    return {
      connected: Boolean(user?.walletAddress),
      walletAddress: user?.walletAddress,
    };
  }
}
