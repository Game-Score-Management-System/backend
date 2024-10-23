export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export class CreateUserDto {
  //   id: string;
  name: string;
  lastname: string;
  email: string;
  //   role: Role;
  //   username: string;
  profilePicture: string;
  //   createdAt: string;
  //   updatedAt: string | null;
  //   status: boolean;
}
