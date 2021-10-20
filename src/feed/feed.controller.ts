import { Controller, Delete, Get, Post } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService : FeedService) {}
  
  @Get()
  async readFeeds() {
    return this.feedService.readFeeds();
  }

  @Get(':feedId')
  async readFeed() {
    return this.feedService.readFeed();
  }


  @Get('/other')
  async readOtherFeed() {
    return this.feedService.readOtherFeed()
  }

  @Post()
  async createFeed() {
    return this.feedService.createFeed()
  }

  @Post('/ai')
  async createAIFeed() {
    return this.feedService.createAIFeed();
  }
}
