import { PaginationQueryDto } from '@/common/dto';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UsersScoresQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  game?: string;
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  showDeleted?: boolean;
}