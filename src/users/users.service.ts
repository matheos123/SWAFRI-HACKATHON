import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.usersRepository.createUser(data);
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserResponse(user);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findByUsername(username);
  }

  async findAll() {
    const users = await this.usersRepository.findAll();
    return users.map(this.toUserResponse);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.usersRepository.updateUser(id, data as Prisma.UserUpdateInput);
    return this.toUserResponse(user);
  }

  private toUserResponse(user: any): UserResponseDto {
    const { password, refreshToken, ...rest } = user;
    return rest as UserResponseDto;
  }
}
