import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { AuthRepository } from './repository/auth.repository';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Tokens } from './interfaces/tokens.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  private toUserResponse(user: any): UserResponseDto {
    const {
      password,
      refreshToken,
      ...rest
    } = user;
    return rest as UserResponseDto;
  }

  private async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    const existingUsername = await this.usersService.findByUsername(registerDto.username);
    if (existingUsername) {
      throw new ConflictException('Username already in use');
    }

    const hashedPassword = await hash(registerDto.password, 10);

    try {
      const user = await this.usersService.createUser({
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
      });

      const tokens = await this.getTokens(user.id, user.email);
      await this.authRepository.setRefreshTokenHash(user.id, await hash(tokens.refreshToken, 10));

      return {
        user: this.toUserResponse(user),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Duplicate field value entered');
      }
      throw error;
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await compare(loginDto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.authRepository.setRefreshTokenHash(user.id, await hash(tokens.refreshToken, 10));

    return {
      user: this.toUserResponse(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<AuthResponseDto> {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.authRepository.findUserById(payload.sub);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await compare(refreshToken, user.refreshToken);
    if (!matches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.authRepository.setRefreshTokenHash(user.id, await hash(tokens.refreshToken, 10));

    return {
      user: this.toUserResponse(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.removeRefreshToken(userId);
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.toUserResponse(user);
  }
}
