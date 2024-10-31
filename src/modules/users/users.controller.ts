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
  Inject
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

interface Result {
  users: User[];
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
  getUserProfileById(id: string): Observable<User>;
  updateProfile(id: string, updateUserDto: UpdateUserDto): Observable<User>;
  getUserScores(id: string): Observable<Score[]>;
  removeUser(id: string): Observable<void>;
}

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  private usersService: UsersService;
  constructor(@Inject(PACKAGE_NAMES.USERS_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UserService');
  }

  @Get('profile/:id')
  getUserProfileById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserProfileById(id);
  }

  @Patch('profile/:id')
  updateProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {}

  @Get('/scores/:id')
  getUserScores(@Param('id', ParseUUIDPipe) id: string) {}

  // @Roles(roles.ADMIN)
  @Get('admin')
  async getAllUsers() {
    const { users } = await firstValueFrom(this.usersService.getAllUsers({}));
    console.log('users', users);
    return {
      data: users,
      metadata: {
        limit: 10,
        page: 1,
        total: 1,
        totalPages: 1
      }
    };
  }

  @Roles(roles.ADMIN)
  @Patch('admin/:id')
  updateUser() {}

  @Roles(roles.ADMIN)
  @Delete('admin/:id')
  removeUser() {}
}
