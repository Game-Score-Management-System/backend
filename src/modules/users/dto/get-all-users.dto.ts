import { PaginationQueryDto } from '@/common/dto';
import { IsOptional, IsString } from 'class-validator';

export class GetAllUsersDto extends PaginationQueryDto {
  @IsString()
  @IsOptional()
  search?: string;
}
