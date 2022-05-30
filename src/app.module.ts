import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MensaplanModule } from './mensaplan/mensaplan.module';

@Module({
  imports: [ScheduleModule.forRoot(), MensaplanModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
