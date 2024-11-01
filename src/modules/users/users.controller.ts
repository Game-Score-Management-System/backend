import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Req,
  Inject,
  Query,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '@/guards/roles/roles.guard';
import { Roles } from '@/common/decorators/roles/roles.decorator';
import { roles } from '@/interfaces/role.interface';
import { Request } from 'express';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, firstValueFrom } from 'rxjs';
import { PACKAGE_NAMES } from '@/config/grpc-client.options';
import { PaginationQueryDto } from '@/common/dto';
import { Metadata } from '@/interfaces';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

interface Result {
  users: User[];
  metadata?: Metadata;
}

interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  username: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  status: number;
}

interface Score {
  id: string;
  userId: string;
  game: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

interface UsersService {
  getAllUsers({}): Observable<Result>;
  getUserProfileById({}): Observable<{ user: User }>;
  updateProfile({}): Observable<{ user: User }>;
  updateUserStatus({}): Observable<{ user: User }>;
  getUserScores({}): Observable<Score[]>;
  removeUser({}): Observable<void>;
}

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  private usersService: UsersService;
  constructor(@Inject(PACKAGE_NAMES.USERS_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UserService');
  }

  @Roles(roles.PLAYER, roles.ADMIN)
  @Get('profile/:id')
  async getUserProfileById(@Param('id', ParseUUIDPipe) id: string) {
    const { user } = await firstValueFrom(this.usersService.getUserProfileById({ id }));
    return {
      data: user
    };
  }

  @Roles(roles.PLAYER, roles.ADMIN)
  @Patch('profile/:id')
  async updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const { user } = await firstValueFrom(
      this.usersService.updateProfile({ id, ...updateUserDto })
    );

    return { data: user };
  }

  @Roles(roles.PLAYER, roles.ADMIN)
  @Get('/scores/:id')
  getUserScores(@Param('id', ParseUUIDPipe) id: string) {}

  @Roles(roles.ADMIN)
  @Get('admin')
  async getAllUsers(@Query() paginationQueryDto: PaginationQueryDto) {
    const { users, metadata } = await firstValueFrom(
      this.usersService.getAllUsers(paginationQueryDto)
    );
    return { data: users, metadata };
  }

  @Roles(roles.ADMIN)
  @Patch('admin/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserStatusDto
  ) {
    const { user } = await firstValueFrom(
      this.usersService.updateUserStatus({ id, status: updateUserDto.status })
    );
    return { data: user };
  }

  @Roles(roles.ADMIN)
  @Delete('admin/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUser(@Param('id', ParseUUIDPipe) id: string) {
    await firstValueFrom(this.usersService.removeUser({ id }));
    return { data: null };
  }
}
