import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USERS_DATA } from '@/common/utils/data-mock';
import { User } from './entities/user.entity';
import { Response } from '@/interfaces/response.interface';

@Injectable()
export class UsersService {
  private users = USERS_DATA;

  getProfile(id: string): Response<User> {
    const profile = this.users.find((user) => user.id === id);
    return {
      data: profile
    };
  }

  updateProfile(id: string, userDto: UpdateUserDto): Response<User> {
    const { data } = this.getProfile(id);

    if (data) {
      throw new NotFoundException('User not found');
    }

    const newScore = {
      ...data,
      ...userDto,
      updatedAt: new Date().toISOString()
    };

    this.users = this.users.map((user) => {
      return user.id === id ? newScore : user;
    });

    return {
      data: newScore
    };
  }

  create(createUserDto: CreateUserDto) {}

  getAllPlayers(): Response<User[]> {
    const players = this.users.filter((user) => user.role === 'USER');
    return {
      data: players,
      metadata: {
        limit: 10,
        page: 1,
        total: players.length,
        totalPages: 1
      }
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
