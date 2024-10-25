import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { ScoresModule } from '@/modules/scores/scores.module';

@Module({
  imports: [AuthModule, UsersModule, ScoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
