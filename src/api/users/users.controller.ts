import { Controller, Get } from '@nestjs/common';

@Controller()
export class UsersController {
  @Get()
  getInit() {
    return {
      message: 'Hello world',
    };
  }
}
