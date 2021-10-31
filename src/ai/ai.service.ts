import { Injectable } from '@nestjs/common';
import vision from '@google-cloud/vision';
import axios from 'axios';
import { FeedService } from '../feed/feed.service';
@Injectable()
export class AiService {

  constructor(private readonly feedService: FeedService) {}

  async translate (keyword) {
    const result = await axios.post('https://naveropenapi.apigw.ntruss.com/nmt/v1/translation',
    {
      "source" : "en",
      "target" : "ko",
      "text" : keyword
    },
    {
      headers: {
        "X-NCP-APIGW-API-KEY-ID" : process.env.X_NCP_APIGW_API_KEY_ID,
        "X-NCP-APIGW-API-KEY" : process.env.X_NCP_APIGW_API_KEY
      }
    });
  
    return result.data.message.result.translatedText;
  }


  async writing(keywordList, id, pwd) {
    const feedList = await this.feedService.readFeeds(id, pwd);

    const captionAndHashtag = [];

    feedList.forEach(item => {
      const originCaption = item.caption;
      
      let hashtag = '';
      originCaption.replace(/#([0-9a-zA-Z가-힣]*)/g, (text) => {
        hashtag = hashtag +`${text}, `
      });

      const object = {
        hashtag : hashtag.slice(0 ,-2),
        caption : item.caption.replace(/\n/g, '')
      };
      captionAndHashtag.push(object);
    });

    let prompt = '';
    for (const data of captionAndHashtag) {
      prompt = prompt + data.hashtag + ' : ' + data.caption + '\n';
    }

    const getNlpResult = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      "prompt": `generator that makes a post on SNS, including keywords.\n\n${prompt}\n${keywordList.join(', ')} :`,
      "temperature": 0.2,
      "max_tokens": 100,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0,
      "stop": ["\n"]
    }, {
      headers : {
        "Authorization": process.env.OPEN_AI_KEY 
      }
    });

    return getNlpResult.data.choices[0].text;
  }

  async image(imageLink) {
    const client = new vision.ImageAnnotatorClient({
      keyFilename: 'src/config/google-vision.json'
    });
  
    const [result] = await client.objectLocalization(encodeURI(imageLink));
    const objects = result.localizedObjectAnnotations;
  
    const itemList = [];
  
    for (const item of objects) {
      const itemKo = await this.translate(item.name);
      itemList.push(itemKo);
    }
    return itemList;
  }
}
