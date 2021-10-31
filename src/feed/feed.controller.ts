import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService : FeedService) {}
  
  @Get()
  async readFeeds(@Body() body) {
    return this.feedService.readFeeds(body);
  }

  @Post("/")
  async createFeedOrigin(@Body() body) {
    return await this.feedService.createFeed(body)
  }
}
