import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [RedisModule.register({url:'redis://localhost:6379'}), EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
