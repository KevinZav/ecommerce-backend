import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthenticationController {
  constructor(private authS: AuthenticationService) {}

  @UseGuards(AuthGuard('jwt-secret'))
  @Get()
  async getAuth(@Request() req) {
    const auth = await this.authS.getAuth(req.user.username);
    return { auth };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async loginAuth(@Request() req) {
    const token = await this.authS.generateJwt(req.user);

    return { token };
  }

  @UseGuards(AuthGuard('jwt-secret'))
  @Get('renew-token')
  async renewToken(@Request() req) {
    const token = await this.authS.renewToken(req.user);

    return { token };
  }
}
