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
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get()
  getAllScores(@Query() paginationQueryDto: PaginationQueryDto) {
    console.log(paginationQueryDto);
    return this.scoresService.findAll(paginationQueryDto);
  }
  @Get(':id')
  getScoreById(@Param('id', ParseUUIDPipe) id: string) {
    return this.scoresService.findOne(id);
  }

  @Post()
  create(@Body() createScoreDto: CreateScoreDto) {
    return this.scoresService.create(createScoreDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateScoreDto: UpdateScoreDto,
  ) {
    return this.scoresService.update(id, updateScoreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.scoresService.remove(+id);
  }
}
