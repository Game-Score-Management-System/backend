import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScoreDto } from './dto/create-score.dto';
import { UpdateScoreDto } from './dto/update-score.dto';
import { PaginationQueryDto } from 'src/commons/dto/pagination-query';
import { metadataType } from 'src/commons/interfaces/paginator';
import { SCORE_DATA } from 'src/utils/data-mock';

export interface IScore {
  id: string;
  userId: string;
  game: string;
  score: number;
  createdAt: string;
  updatedAt: string | null;
}

@Injectable()
export class ScoresService {
  private scores: IScore[] = SCORE_DATA;

  findAll(paginationQueryDto: PaginationQueryDto): {
    data: IScore[];
    metadata: metadataType;
  } {
    const { limit, page } = paginationQueryDto;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const totalPages = Math.ceil(this.scores.length / limit);
    return {
      data: this.scores.slice(startIndex, endIndex),
      metadata: {
        total: this.scores.length,
        page,
        limit,
        totalPages: totalPages,
      },
    };
  }

  findOne(id: string): IScore {
    return this.scores.find((score) => score.id === id);
  }

  update(id: string, updateScoreDto: UpdateScoreDto): IScore {
    const data = this.findOne(id);

    if (!data) {
      throw new NotFoundException('Score not found');
    }

    const newScore = {
      ...data,
      ...updateScoreDto,
      updatedAt: new Date().toISOString(),
    };

    this.scores = this.scores.map((score) => {
      return score.id === id ? newScore : score;
    });

    return newScore;
  }

  create(createScoreDto: CreateScoreDto) {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const score = { id, createdAt, updatedAt: null, ...createScoreDto };
    this.scores.push(score);

    return {
      data: score,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} score`;
  }
}
