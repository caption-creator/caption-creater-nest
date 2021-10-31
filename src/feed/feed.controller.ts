import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService : FeedService) {}
  
  @Get()
  async readFeeds(@Query("id") id: string, @Query("pwd") pwd: string) {
    return this.feedService.readFeeds(id, pwd);
  }

  @Post("/")
  async createFeedOrigin(@Body() body) {
    return await this.feedService.createFeed(body)
  }
}
