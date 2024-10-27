import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ScoresModule } from '@/modules/scores/scores.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV?.trim()}`,
    //   isGlobal: true
    // }),
    AuthModule,
    UsersModule,
    ScoresModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
