import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './feed.controller';
import { FeedRepository } from './feed.repository';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([FeedRepository])],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService]
})
export class FeedModule {}
