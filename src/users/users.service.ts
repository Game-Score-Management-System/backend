import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USERS_DATA } from 'src/utils/data-mock';

@Injectable()
export class UsersService {
  private users = USERS_DATA;

  getProfile(id: string) {
    return this.users.find((user) => user.id === id);
  }

  updateProfile(id: string, userDto: UpdateUserDto) {
    const data = this.getProfile(id);

    if (!data) {
      throw new NotFoundException('User not found');
    }

    const newScore = {
      ...data,
      ...userDto,
      updatedAt: new Date().toISOString(),
    };

    console.log('🔎🔎🔎🔎🔎', userDto);
    this.users = this.users.map((user) => {
      return user.id === id ? newScore : user;
    });

    return newScore;
  }

  create(createUserDto: CreateUserDto) {}

  findAll() {
    return `This action returns all users`;
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
