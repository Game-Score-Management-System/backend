import { Controller, Post, Body, Inject, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PACKAGE_NAMES } from '@/config/grpc-client.options';
import { ClientGrpc } from '@nestjs/microservices';
import { UsersService } from '@/interfaces/user-service.interface';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  private usersService: UsersService;

  constructor(
    private readonly jwtService: JwtService,
    @Inject(PACKAGE_NAMES.USERS_PACKAGE) private client: ClientGrpc
  ) {}

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
}
