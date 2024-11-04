import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule } from '@nestjs/microservices';
import { getGrpcClientOptions } from '@/config/grpc-client.options';

const grpcClientOptions = getGrpcClientOptions('USERS_PACKAGE');
const grpcScoreClientOptions = getGrpcClientOptions('SCORES_PACKAGE');

@Module({
  imports: [
    ClientsModule.register([
      {
        transport: grpcClientOptions.transport,
        name: grpcClientOptions.name,
        options: grpcClientOptions.options
      }
    ]),
    ClientsModule.register([
      {
        transport: grpcScoreClientOptions.transport,
        name: grpcScoreClientOptions.name,
        options: grpcScoreClientOptions.options
      }
    ])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: []
})
export class UsersModule {}
