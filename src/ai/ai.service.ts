import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async writing() {
    return 'GPT3';
  }

  async image() {
    return 'image';
  }
}
