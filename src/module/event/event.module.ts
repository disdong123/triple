import { Module } from '@nestjs/common';
import { ReviewModule } from '@src/module/review/review.module';
import { EventController } from '@src/module/event/event.controller';

@Module({
  imports: [ReviewModule],
  controllers: [EventController],
})
export class EventModule {}
