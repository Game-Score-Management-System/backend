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
  Inject
} from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PaginationQueryDto } from '@/common/dto';
import { firstValueFrom, Observable } from 'rxjs';
import { PACKAGE_NAMES } from '@/config/grpc-client.options';
import { ClientGrpc } from '@nestjs/microservices';
import { Response } from '@/interfaces/response.interface';

interface Result {
  scores: Score[];
}

interface Score {
  id: string;
  userId: string;
  game: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

interface ScoresService {
  getAllScores({}): Observable<Result>;
  getScoreById(id: string): Observable<Score>;
  getLeaderboard({}): Observable<Score[]>;
  createScore(createScoreDto: CreateScoreDto): Observable<Score>;
  updateScore(id: string, updateScoreDto: UpdateScoreDto): Observable<Score>;
  removeScore(id: string): Observable<void>;
}

@Controller('scores')
export class ScoresController {
  private scoresService: ScoresService;
  constructor(@Inject(PACKAGE_NAMES.SCORES_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.scoresService = this.client.getService<ScoresService>('ScoresService');
  }

  @Get()
  async getAllScores(@Query() paginationQueryDto: PaginationQueryDto) {
    const { scores } = await firstValueFrom(this.scoresService.getAllScores({}));

    return {
      data: scores,
      metadata: {
        page: paginationQueryDto.page,
        limit: paginationQueryDto.limit,
        total: 1,
        totalPages: 2
      }
    };
  }

  @Get(':id')
  getScoreById(@Param('id', ParseUUIDPipe) id: string) {}

  @Get('leaderboard')
  GetLeaderboard(@Query() paginationQueryDto: PaginationQueryDto) {}

  @Post()
  createScore(@Body() createScoreDto: CreateScoreDto) {}

  @Patch(':id')
  updateScore(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScoreDto: UpdateScoreDto
  ) {}

  @Delete(':id')
  removeScore(@Param('id', ParseUUIDPipe) id: string) {}
}
