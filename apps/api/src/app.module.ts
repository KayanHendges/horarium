import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
