import { Controller, Delete, Get, Post } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService : FeedService) {}
  
  @Get()
  async readFeeds() {
    return this.feedService.readFeeds();
  }

  @Post()
  async createFeed() {
    return this.feedService.createFeed()
  }
}
