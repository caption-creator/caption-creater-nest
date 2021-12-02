import { Body, Controller, Param, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {

  constructor(private readonly aiService: AiService) {}

  @Post("/writing")
  async writing(@Body("keywordList") keywordList: string, @Body("id") id: string, @Body("pwd") pwd: string) {
    return await this.aiService.writing(keywordList, id, pwd);
  }
  
  @Post("/writing/:type")
  async typeWriting(@Body("keywordList") keywordList: string, @Param("type") type : string) {
    return await this.aiService.typeWriting(keywordList, type);
  }

  @Post("/image")
  async image(@Body("imageLink") imageLink: string) {
    return await this.aiService.image(imageLink);
  }

}

