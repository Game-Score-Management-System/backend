import { CreateScoreDto } from '@/modules/scores/dto/create-score.dto';
import { UpdateScoreDto } from '@/modules/scores/dto/update-score.dto';
import { Observable } from 'rxjs';
import { Metadata } from './metadata.interface';

interface Result {
  scores: Score[];
  metadata?: Metadata;
}

export interface Score {
  id: string;
  userId: string;
  game: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScoresService {
  getAllScores({}): Observable<Result>;
  getScoreById(id: string): Observable<Score>;
  getLeaderboard({}): Observable<Result>;
  createScore(createScoreDto: CreateScoreDto): Observable<Score>;
  updateScore({}): Observable<Score>;
  removeScore({}): Observable<void>;
}
