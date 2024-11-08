import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from './create-user.dto';

export class UpdateUserDto {
  @IsBoolean()
  @IsOptional()
  status: boolean;
  @IsOptional()
  role: Role;
}
