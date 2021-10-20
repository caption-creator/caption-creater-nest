import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  async readUser() {
    return 'readUser';
  }

  async createUser() {
    return 'createUser';
  }
}
