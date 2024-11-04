import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
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
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PACKAGE_NAMES } from '@/config/grpc-client.options';
import { PaginationQueryDto } from '@/common/dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UsersService } from '@/interfaces/user-service.interface';
import { ScoresService } from '@/interfaces/score-service.interface';
import { UsersScoresQueryDto } from '@/common/dto/users-scores-query.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  private usersService: UsersService;
  private scoresService: ScoresService;
  constructor(
    @Inject(PACKAGE_NAMES.USERS_PACKAGE) private client: ClientGrpc,
    @Inject(PACKAGE_NAMES.SCORES_PACKAGE) private scoresClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UserService');
    this.scoresService = this.scoresClient.getService<ScoresService>('ScoresService');
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
  async getUserScores(
    @Query() usersScoresQueryDto: UsersScoresQueryDto,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    const { limit, page, ...filter } = usersScoresQueryDto;
    const { scores, metadata } = await firstValueFrom(
      this.scoresService.getAllScores({ limit, page, filter: { userId: id, ...filter } })
    );

    if (!scores) {
      return {
        data: [],
        metadata
      };
    }

    const promises = scores.map(async (score) => {
      const { user } = await firstValueFrom(
        this.usersService.getUserProfileById({ id: score.userId })
      );
      return {
        ...score,
        user
      };
    });

    const scoresWithUsers = await Promise.all(promises);

    return {
      data: scoresWithUsers,
      metadata: metadata
    };
  }

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
