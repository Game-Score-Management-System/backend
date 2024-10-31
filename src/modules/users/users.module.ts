import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getGrpcClientOptions } from '@/config/grpc-client.options';

const grpcClientOptions = getGrpcClientOptions('USERS_PACKAGE');

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: grpcClientOptions.transport,
        name: grpcClientOptions.name,
        options: grpcClientOptions.options
      }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
