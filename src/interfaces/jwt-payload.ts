import { roles } from './role.interface';

export interface JwtPayload {
  sub: string;
  username: string;
  roles: roles[];
}
