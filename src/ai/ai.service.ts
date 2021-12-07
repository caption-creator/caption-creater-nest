import { Injectable } from '@nestjs/common';
import vision from '@google-cloud/vision';
import axios from 'axios';
import { FeedService } from '../feed/feed.service';
import * as fs from 'fs';
import request from 'request';

@Injectable()
export class AiService {

  constructor(private readonly feedService: FeedService) {}



  download_image  = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve(''))
          .on('error', e => reject(e));
      }),
  );

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

  async typeWriting(keywordList, type) {
    let userPrompt = '';
    for (const data of keywordList) {
      userPrompt = userPrompt + data + ',';
    }

    let prompt = "";
    if (type == 1) { //음식
      prompt = `A sentence to post on social media by referring to the explanation.\n\n성수역, 장어덮밥 : 와우~!! 성수역에서 먹은 장어덮밥인데요, 장어덮밥이 느끼했지만 맛있었어요.\n방어회, 제주회사랑, 신선함 : 이야~ 제주회사랑에서 먹은 방어회. 대박 신선함!\n마시타야, 홍대, 라멘 : 라멘을 먹으러 갔습니다. 홍대에 위치한 마시타야 인데요. 라멘 국물이 엄청 시원했어요. 재방문 의사 있습니다.\n만두, 손만두 : 만두 중 최고의 만두는 역시 손만두라고 생각합니다.\n초밥, 맛, 기뻤 : 초밥 먹었습니다. 맛이 좋아서 기뻤어요.\n텐동, 용인, 느끼 : 용인시에서 파는 텐동 맛집!! 근데 느끼해서 별로 였습니다!\n고등어, 고된이, 바싹함 : 고된이라는 가게에서 먹은 고등어는 진짜 바싹했습니다.\n새우덮밥, 상수역 : 이야~ 상수역에서 먹은 새우덮밥이었습니다. 배달시킴도 있었습니다.\n나시고랭, 신대방 : 신대방역에 나시고랭 맛집이 있어서 찾아갔어요. 대박! 믿기지 않는 맛입니다.\n오징어, 강릉 : 강릉에서 먹은 오징어는 진짜 좋았습니다. 가격도 저렴하고 맛도 좋았기 때문에요.\n${prompt} : `;
    } else if (type == 2) { //여행
      prompt = `generator that makes a post on SNS, including keywords.\n\n미국, 로스앤젤레스, 흥분 : 미국에 있는 로스앤젤레스를 갔습니다. 새로운 나라를 여행하는건 항상 흥분되네요.\n강릉, 강릉시장, 맛집 : 강릉시장을 갔는데 맛집이 너무 많았어요. 배가 꺼질새 없는 여행이었습니다.\n명지대, 신기함 : 명지대학교 자연캠퍼스를 방문했습니다. 인문캠과는 다르게 엄청 커서 신기했어요.\n목포, 바다, 기분전환 : 목포 여행! 바다를 봐서 그런지 기분전환 됐음 ㅋ\n부산, 우정여행 : 부산에 우정여행을 갔습니다. 친구들과 함께 하는 여행이라 그런지 쉴 시간 없이 재밌었어요.\n에버랜드, 츄러스 : 에버랜드로 놀러갔어요! 맛있는 츄러스를 먹어서 행복~\n도쿄, 일본, 코로나 : 일본 갔다옴. 도쿄 최고. 코로나 ㅠㅠ...\n태안, 바다, 캠핑 : 태안에 있는 바다로 놀러갔다왔다. 캠핑을 했는데 날씨가 추웠당... 힝\n성수, 카페 : 성수에 많은 카페가 있어서 사진을 이쁘게 찍었어요.\n ${prompt} : `
    } else {
      return '아쉽지만 문장을 생성하지 못했어요. 다시 입력해주세요.';
    }

    const getNlpResult = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      "prompt": prompt,
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


    const random = Math.floor(Math.random() * 1000);
    await this.download_image(imageLink,`./src/image/${random}.jpg`);
  
    const [result] = await client.labelDetection(encodeURI(`./src/image/${random}.jpg`));
    const objects = result.labelAnnotations;

    console.log(result);
  
    const itemList = [];
  
    for (const item of objects) {
      const itemKo = await this.translate(item.description);
      itemList.push(itemKo);
    }
    return itemList;
  }

  // async image(imageLink) {
  //   const client = new vision.ImageAnnotatorClient({
  //     keyFilename: 'src/config/google-vision.json'
  //   });

  //   const random = Math.floor(Math.random() * 1000);

  //   await this.download_image(imageLink,`./src/image/${random}.jpg`);

  //   const [result] = await client.objectLocalization(`./src/image/${random}.jpg`);
  //   const objects = result.localizedObjectAnnotations;

  //   console.log(result);

  //   const itemList = [];

  //   for (const item of objects) {
  //     const itemKo = await this.translate(item.name);
  //     itemList.push(itemKo);
  //   }
  //   return itemList;
  // }
}
