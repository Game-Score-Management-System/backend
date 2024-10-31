import { Transport } from '@nestjs/microservices';

export const PACKAGE_NAMES = {
  USERS_PACKAGE: 'USERS_PACKAGE',
  SCORES_PACKAGE: 'SCORES_PACKAGE'
};

export const GRPC_MICROSERVICE_PACKAGES = {
  USERS_PACKAGE: {
    package: 'users',
    protoPath: 'src/protos/users.proto',
    url: process.env.USERS_SERVICE_URL ?? 'localhost:50051'
  },
  SCORES_PACKAGE: {
    package: 'scores',
    protoPath: 'src/protos/scores.proto',
    url: process.env.SCORES_SERVICE_URL ?? 'localhost:50052'
  }
};

export const getGrpcClientOptions = (packageName: keyof typeof PACKAGE_NAMES) => {
  return {
    name: PACKAGE_NAMES[packageName],
    transport: Transport.GRPC as any,
    options: {
      package: GRPC_MICROSERVICE_PACKAGES[packageName].package,
      protoPath: GRPC_MICROSERVICE_PACKAGES[packageName].protoPath,
      url: GRPC_MICROSERVICE_PACKAGES[packageName].url
    }
  };
};
