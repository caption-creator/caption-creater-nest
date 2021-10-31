import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports : [FeedModule],
  providers: [AiService],
  controllers: [AiController]
})
export class AiModule {}
