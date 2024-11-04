import '@/config/env';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { ResponseInterceptor } from '@/interceptors/response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');
  // Enable CORS
  app.enableCors();
  // Define the global prefix
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  logger.log(`Server running on port ${PORT}`);
}
bootstrap();
