import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Inject,
  HttpStatus,
  HttpCode,
  UseGuards
} from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PaginationQueryDto } from '@/common/dto';
import { firstValueFrom } from 'rxjs';
import { PACKAGE_NAMES } from '@/config/grpc-client.options';
import { ClientGrpc } from '@nestjs/microservices';
import { ScoresService } from '@/interfaces/score-service.interface';
import { UsersScoresQueryDto } from '@/common/dto/users-scores-query.dto';
import { UsersService } from '@/interfaces/user-service.interface';
import { JwtAuthGuard } from '@/common/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles/roles.guard';
import { Roles } from '@/common/decorators/roles/roles.decorator';
import { roles } from '@/interfaces/role.interface';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('scores')
export class ScoresController {
  private scoresService: ScoresService;
  private usersService: UsersService;
  constructor(
    @Inject(PACKAGE_NAMES.SCORES_PACKAGE) private client: ClientGrpc,
    @Inject(PACKAGE_NAMES.USERS_PACKAGE) private usersClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.scoresService = this.client.getService<ScoresService>('ScoresService');
    this.usersService = this.usersClient.getService<UsersService>('UserService');
  }

  @Roles(roles.PLAYER, roles.ADMIN)
  @Get()
  async getAllScores(@Query() scoresQueryDto: UsersScoresQueryDto) {
    const { limit, page, ...filter } = scoresQueryDto;

    const { scores, metadata } = await firstValueFrom(
      this.scoresService.getAllScores({ limit, page, filter })
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
      metadata
    };
  }

  @Roles(roles.PLAYER, roles.ADMIN)
  @Get('leaderboard/:gameName')
  async GetLeaderboard(
    @Query() paginationQueryDto: PaginationQueryDto,
    @Param('gameName') gameName: string
  ) {
    const { scores, metadata } = await firstValueFrom(
      this.scoresService.getLeaderboard({ ...paginationQueryDto, game: gameName })
    );
    const promises = scores.map(async (score) => {
      const { user } = await firstValueFrom(
        this.usersService.getUserProfileById({ id: score.userId })
      );
      return {
        ...score,
        user
      };
    });

    const leaderboard = await Promise.all(promises);

    return {
      data: leaderboard,
      metadata
    };
  }

  @Roles(roles.PLAYER, roles.ADMIN)
  @Get(':id')
  getScoreById(@Param('id', ParseUUIDPipe) id: string) {}

  @Roles(roles.ADMIN)
  @Post()
  async createScore(@Body() createScoreDto: CreateScoreDto) {
    const score = await firstValueFrom(this.scoresService.createScore(createScoreDto));
    return {
      data: score
    };
  }

  @Roles(roles.ADMIN)
  @Patch(':id')
  async updateScore(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScoreDto: UpdateScoreDto
  ) {
    const score = await firstValueFrom(
      this.scoresService.updateScore({ scoreId: id, ...updateScoreDto })
    );

    return {
      data: score
    };
  }

  @Roles(roles.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeScore(@Param('id', ParseUUIDPipe) id: string) {
    await firstValueFrom(this.scoresService.removeScore({ id }));
    return { data: null };
  }
}
