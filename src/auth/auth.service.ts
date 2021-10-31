import { Injectable } from '@nestjs/common';
import { IgApiClient } from 'instagram-private-api';

@Injectable()
export class AuthService {
  async login(id, pwd) {
    try {
      const ig = new IgApiClient();
      ig.state.generateDevice(id);
      const auth = await ig.account.login(id, pwd);
      return true;
    } catch (e) {
      return false;
    }
  }
}
