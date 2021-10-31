import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {

  constructor(private readonly aiService: AiService) {}

  @Post("/writing")
  async writing(@Body("keywordList") keywordList: string, @Body("id") id: string, @Body("pwd") pwd: string) {
    return await this.aiService.writing(keywordList, id, pwd);
  }

  @Post("/image")
  async image(@Body("imageLink") imageLink: string) {
    return await this.aiService.image(imageLink);
  }

}

