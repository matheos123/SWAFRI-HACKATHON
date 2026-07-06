import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { WalletRepository } from './repository/wallet.repository';
import { SignatureService } from '../signature/signature.service';

@Module({
  imports: [PrismaModule],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository, SignatureService],
})
export class WalletModule {}
