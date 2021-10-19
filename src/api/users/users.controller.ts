import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';

// Dtos
import { createUserDto, updateUserDto } from './dtos/user.dto';
import { createAuthDto } from '../authentication/dtos/auth.dto';

// Guards & models
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TokenPublic } from './models/token-jwt.public';
import { AuthGuard } from '@nestjs/passport';

// Services
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private userS: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getInit(@Request() req) {
    return { message: 'Hello user', user: req.user };
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userS.getUserById(id);

    return { user };
  }

  @Post()
  async postUser(@Body() payload: createUserDto) {
    const newUser = await this.userS.createUser(payload);

    return { newUser };
  }

  @UseGuards(AuthGuard('jwt-secret'))
  @Put(':id')
  async putUser(
    @Body() payload: updateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const user = await this.userS.updateUser(id, payload);

    return { user };
  }

  @Delete(':id')
  async inactivateUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userS.updateStatusUser(id, false);

    return { user };
  }

  @Patch(':id')
  async activateUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userS.updateStatusUser(id, true);

    return { user };
  }

  @Get('token-auth/:email')
  async getTokenByEmail(@Param('email') email: string) {
    const token = await this.userS.getTokenByEmail(email, 'newuser');

    return { token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-auth')
  async postAuthUser(@Body() payload: createAuthDto, @Request() req) {
    const token: TokenPublic = req.user;

    const user = await this.userS.createAuthByEmail(token, payload);

    return { user };
  }
}
