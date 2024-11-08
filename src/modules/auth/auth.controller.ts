import {
  Controller,
  Post,
  Body,
  Inject,
  HttpStatus,
  HttpCode,
  InternalServerErrorException
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PACKAGE_NAMES } from '@/config/grpc-client.options';
import { ClientGrpc } from '@nestjs/microservices';
import { UsersService } from '@/interfaces/user-service.interface';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { createClient, RedisClientType } from 'redis';

@Controller('auth')
export class AuthController {
  private usersService: UsersService;
  private redisClient: RedisClientType;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(PACKAGE_NAMES.USERS_PACKAGE) private client: ClientGrpc
  ) {
    this.redisClient = createClient({ url: process.env.REDIS_URL });
    this.redisClient.connect();
  }

  onModuleInit() {
    this.usersService = this.client.getService<UsersService>('UserService');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const { user } = await firstValueFrom(this.usersService.login(loginAuthDto));
    const token = this.jwtService.sign({
      username: user.username,
      roles: [user.role],
      sub: user.id
    });

    try {
      await this.redisClient.set(token, 'active', {
        EX: +process.env.JWT_EXPIRATION
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error while saving token');
    }

    return { data: { ...user, token } };
  }

  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    const { user } = await firstValueFrom(this.usersService.registerPlayer(createAuthDto));
    const token = this.jwtService.sign({
      username: user.username,
      roles: [user.role],
      sub: user.id
    });

    return { data: { ...user, token } };
  }

  @Post('logout')
  async logout(@Body() { token }: { token: string }) {
    try {
      await this.redisClient.del(token);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error while deleting token');
    }

    return { data: null };
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Body() { token }: { token: string }) {
    const result = await this.redisClient.get(token);
    return { data: { valid: result === 'active' } };
  }
}
