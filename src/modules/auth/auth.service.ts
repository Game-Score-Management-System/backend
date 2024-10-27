import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { hash, compare } from 'bcryptjs';
import { roles } from '@/interfaces/role.interface';
import { JwtPayload } from '@/interfaces/jwt-payload';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  private fakeUser = [];

  async login(res: Response, loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = this.fakeUser.find((user) => user.email === email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const token = this.generateToken({
      username: user.username,
      roles: [roles.ADMIN],
      sub: user.id
    });

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // 2 seconds
      expires: new Date(Date.now() + 2000)
    });

    return {
      data: { token }
    };
  }

  async register(createAuthDto: CreateAuthDto): Promise<any> {
    const { email, lastname, name, password } = createAuthDto;
    const username = `@${email.split('@').at(0)}`;

    // TODO: Esto debe ir al servicio de users porque es el que se encarga de manejar logica de los usuarios
    if (this.fakeUser.find((user) => user.email === email)) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await hash(password, +process.env.JWT_SALT_ROUNDS);
    const id = crypto.randomUUID();

    this.fakeUser.push({
      id,
      username,
      email,
      lastname,
      name,
      password: passwordHash
    });

    const token = this.generateToken({
      username,
      roles: [roles.ADMIN],
      sub: id
    });

    return {
      data: { token }
    };
  }

  private generateToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }
}
