import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import blockchainConfig from './common/config/blockchain.config';
import databaseConfig from './common/config/database.config';
import jwtConfig from './common/config/jwt.config';
import redisConfig from './common/config/redis.config';
import socketConfig from './common/config/socket.config';
import { AchievementModule } from './achievement/achievement.module';
import { AuthModule } from './auth/auth.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { ChatModule } from './chat/chat.module';
import { FriendsModule } from './friends/friends.module';
import { GameModule } from './game/game.module';
import { HealthModule } from './health/health.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReplayModule } from './replay/replay.module';
import { SocketModule } from './socket/socket.module';
import { UsersModule } from './users/users.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, socketConfig, blockchainConfig, redisConfig],
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().default(3000),
        REDIS_URL: Joi.string().uri().required(),
        RPC_URL: Joi.string().uri().required(),
        PRIVATE_KEY: Joi.string().required(),
        GAME_CONTRACT: Joi.string().required(),
        BADGE_CONTRACT: Joi.string().required(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      }),
      validationOptions: { abortEarly: false },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WalletModule,
    GameModule,
    MatchmakingModule,
    SocketModule,
    LeaderboardModule,
    AchievementModule,
    BlockchainModule,
    ChatModule,
    FriendsModule,
    NotificationsModule,
    ReplayModule,
    HealthModule,
  ],
})
export class AppModule {}
