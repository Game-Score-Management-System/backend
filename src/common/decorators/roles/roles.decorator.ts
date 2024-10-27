import { roles } from '@/interfaces/role.interface';
import { SetMetadata } from '@nestjs/common';

export const Roles = (...args: roles[]) => SetMetadata('roles', args);
