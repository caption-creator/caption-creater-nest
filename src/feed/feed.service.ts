import { Injectable } from '@nestjs/common';

@Injectable()
export class FeedService {
  async readFeeds() {
    return 'readFeeds';
  }

  async readFeed() {
    return 'readFeed';
  }

  async readOtherFeed() {
    return 'readOtherFeed';
  }

  async createFeed() {
    return 'createFeed';
  }

  async createAIFeed() {
    return 'createAIFeed';
  }
}
