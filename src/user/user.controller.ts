import { Controller, Delete, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  @Get()
  async readUser() {
    return this.userService.readUser();
  }

  @Post()
  async createUser() {
    return this.userService.createUser();
  }
}