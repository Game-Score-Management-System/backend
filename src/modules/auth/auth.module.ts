import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ClientsModule } from '@nestjs/microservices';

import { getGrpcClientOptions } from '@/config/grpc-client.options';
import { RedisService } from '@/common/services/redis/redis.service';

const grpcClientOptions = getGrpcClientOptions('USERS_PACKAGE');

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: +process.env.JWT_EXPIRATION }
    }),
    PassportModule,
    ClientsModule.register([
      {
        transport: grpcClientOptions.transport,
        name: grpcClientOptions.name,
        options: grpcClientOptions.options
      }
    ])
  ],
  providers: [AuthService, JwtStrategy, RedisService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
