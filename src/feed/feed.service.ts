import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedService {

  async readFeeds() {
    return 'readFeeds';
  }

  async createFeed() {

  }
}