import { Injectable } from '@nestjs/common';
// import { CreateAuthDto } from './dto/create-auth.dto';
// import { JwtService } from '@nestjs/jwt';
// import { LoginAuthDto } from './dto/login-auth.dto';
// import { hash, compare } from 'bcryptjs';
// import { roles } from '@/interfaces/role.interface';
// import { JwtPayload } from '@/interfaces/jwt-payload';
// import { Response } from 'express';

@Injectable()
export class AuthService {
  // constructor(private readonly jwtService: JwtService) {}
  // private fakeUser = [];
  // async login(loginAuthDto: LoginAuthDto) {
  //   const { email, password } = loginAuthDto;
  //   const user = this.fakeUser.find((user) => user.email === email);
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  //   const isPasswordValid = await compare(password, user.password);
  //   if (!isPasswordValid) {
  //     throw new BadRequestException('Invalid password');
  //   }
  //   const token = this.generateToken({
  //     username: user.username,
  //     roles: [roles.ADMIN],
  //     sub: user.id
  //   });
  //   const { password: _, ...userWithoutPassword } = user;
  //   return {
  //     data: {
  //       ...userWithoutPassword,
  //       token
  //     }
  //   };
  // }
  // async register(createAuthDto: CreateAuthDto): Promise<any> {
  //   const { email, lastname, name, password } = createAuthDto;
  //   const username = `@${email.split('@').at(0)}`;
  //   // TODO: Esto debe ir al servicio de users porque es el que se encarga de manejar logica de los usuarios
  //   if (this.fakeUser.find((user) => user.email === email)) {
  //     throw new BadRequestException('Usuario ya existe, por favor inicie sesión');
  //   }
  //   const passwordHash = await hash(password, 10);
  //   const id = crypto.randomUUID();
  //   const newUser = {
  //     id,
  //     username,
  //     email,
  //     lastname,
  //     name,
  //     password: passwordHash,
  //     createdAt: new Date(),
  //     updatedAt: null,
  //     status: true,
  //     role: roles.ADMIN,
  //     profilePicture: `https://robohash.org/${name}`
  //   };
  //   this.fakeUser.push(newUser);
  //   const token = this.generateToken({
  //     username,
  //     roles: [roles.ADMIN],
  //     sub: id
  //   });
  //   const { password: _, ...userWithoutPassword } = newUser;
  //   return {
  //     data: {
  //       ...userWithoutPassword,
  //       token
  //     }
  //   };
  // }
  // private generateToken(payload: JwtPayload): string {
  //   return this.jwtService.sign(payload);
  // }
  // private appendCookie(res: Response, token: string) {
  //   res.cookie('access_token', token, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     sameSite: 'strict'
  //   });
  // }
}
