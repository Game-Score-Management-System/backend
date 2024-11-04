import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getGrpcClientOptions } from '@/config/grpc-client.options';
import { UsersModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';

const grpcClientOptions = getGrpcClientOptions('SCORES_PACKAGE');
const grpcScoreClientOptions = getGrpcClientOptions('USERS_PACKAGE');

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
  controllers: [ScoresController],
  providers: [ScoresService]
})
export class ScoresModule {}
