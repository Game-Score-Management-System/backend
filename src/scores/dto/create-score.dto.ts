import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateScoreDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
  @IsNotEmpty()
  @IsString()
  game: string;
  @IsNotEmpty()
  @IsNumber()
  score: number;
}
