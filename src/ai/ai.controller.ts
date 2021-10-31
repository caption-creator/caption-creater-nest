import { Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {

  constructor(private readonly aiService: AiService) {}

  @Post("/writing")
  async writing() {
    return await this.aiService.writing();
  }

  @Post("/image")
  async image() {
    return await this.aiService.image();
  }

}

