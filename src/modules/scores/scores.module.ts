import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { getGrpcClientOptions } from '@/config/grpc-client.options';

const grpcClientOptions = getGrpcClientOptions('SCORES_PACKAGE');

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
  controllers: [ScoresController],
  providers: [ScoresService]
})
export class ScoresModule {}
