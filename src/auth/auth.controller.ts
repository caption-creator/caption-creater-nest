import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/')
  async login(@Body("id") id: string, @Body("pwd") pwd: string) {
    return this.authService.login(id, pwd);
  }
}
