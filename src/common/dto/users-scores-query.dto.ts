import { PaginationQueryDto } from '@/common/dto';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UsersScoresQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  game?: string;
  @IsOptional()
  @IsString()
  orderBy?: string;

  @IsOptional()
  @IsString()
  order?: ['asc' | 'desc'];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  showDeleted?: boolean;
}
