import { Injectable } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';
import { get } from 'request-promise'
import { FeedRepository } from './feed.repository';

@Injectable()
export class FeedService {

  constructor(private readonly feedRepository: FeedRepository) {}

  
  async readFeeds(id, pwd) {

    const ig = new IgApiClient();
    ig.state.generateDevice(id);
    const auth = await ig.account.login(id, pwd);
    const userFeed = ig.feed.user(auth.pk);
    const feeds = await userFeed.items();

    const feedList = [];
    for ( const feed of feeds ) {

      const isCreatedByCC = await this.feedRepository.isCreatedByCC(feed.pk, auth.pk);
      let temporaryObject = {};

      if ( feed.carousel_media_count !== undefined && feed?.carousel_media_count > 1 ) {
        const imageList = [];
        for(let i = 0; i < feed.carousel_media_count ; i++ ) {
          imageList.push(feed.carousel_media[i].image_versions2.candidates[0].url);
        }

        temporaryObject = {
          id: feed.pk,
          imageList : imageList,
          caption : feed.caption.text,
          createdByCC : isCreatedByCC
        }
      } else {
        temporaryObject = {
          id: feed.pk,
          image : feed.image_versions2?.candidates[0].url,
          image2 : feed.image_versions2?.candidates[1].url,
          caption : feed.caption.text,
          createdByCC : isCreatedByCC
        }
      }

      feedList.push(temporaryObject);
    }
    
    return feedList;
  }
  
  async createFeed(body) {
    const { id, pwd, caption, imageLink } = body;

    const ig = new IgApiClient();
    ig.state.generateDevice(id);
    const auth = await ig.account.login(id, pwd);
  
    const imageBuffer = await get({
      url: imageLink,
      encoding: null,
    });
  
    const publishResult = await ig.publish.photo({
      file: imageBuffer, // image buffer, you also can specify image from your disk using fs
      caption: caption, // nice caption (optional)
    });

    await this.feedRepository.createFeed(publishResult.media.pk, auth.pk);

    return (publishResult.status === "ok") ? true : false ;
  }
}