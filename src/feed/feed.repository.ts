import { EntityRepository } from "typeorm";
import { BaseRepository } from 'typeorm-transactional-cls-hooked';
import { Feed } from "../entities/Feed"

@EntityRepository(Feed)
export class FeedRepository extends BaseRepository<Feed> {

  async createFeed(feed, user) {
    try {
      return await this.createQueryBuilder('feed')
        .insert()
        .into('feed')
        .values({feed: feed, user : user})
        .execute();
    } catch (e) {
      throw e;
    }
  }

  async isCreatedByCC(feed, user) {
    try {
      return await this.createQueryBuilder('feed')
      .where('feed.feed = :feed AND feed.user = :user', {feed, user})
      .getCount() > 0;
    } catch (e) {
      throw e;
    }
  }
}
