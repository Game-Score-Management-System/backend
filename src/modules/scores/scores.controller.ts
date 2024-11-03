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
import { ScoresService } from '@/interfaces/score-service.interface';

@Controller('scores')
export class ScoresController {
  private scoresService: ScoresService;
  constructor(@Inject(PACKAGE_NAMES.SCORES_PACKAGE) private client: ClientGrpc) {}

  onModuleInit() {
    this.scoresService = this.client.getService<ScoresService>('ScoresService');
  }

  @Get()
  async getAllScores(@Query() paginationQueryDto: PaginationQueryDto) {
    const { scores, metadata } = await firstValueFrom(
      this.scoresService.getAllScores(paginationQueryDto)
    );
    return {
      data: scores,
      metadata
    };
  }

  @Get(':id')
  getScoreById(@Param('id', ParseUUIDPipe) id: string) {}

  @Get('leaderboard')
  GetLeaderboard(@Query() paginationQueryDto: PaginationQueryDto) {}

  @Post()
  async createScore(@Body() createScoreDto: CreateScoreDto) {
    const score = await firstValueFrom(this.scoresService.createScore(createScoreDto));
    return {
      data: score
    };
  }

  @Patch(':id')
  updateScore(@Param('id', ParseUUIDPipe) id: string, @Body() updateScoreDto: UpdateScoreDto) {}

  @Delete(':id')
  removeScore(@Param('id', ParseUUIDPipe) id: string) {}
}
