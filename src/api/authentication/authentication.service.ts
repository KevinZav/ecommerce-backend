import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Entities and repository
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';

// Dto
import { createAuthDto } from './dtos/auth.dto';

// Model Token & jwtService
import { Token } from './models/token-jwt';
import { JwtService } from '@nestjs/jwt';

// bcrypt password
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Auth) private authRep: Repository<Auth>,
    private jwtS: JwtService,
  ) {}

  async createAuth(payload: createAuthDto): Promise<Auth> {
    const authExists = await this.authRep.findOne({
      username: payload.username,
    });

    if (authExists) {
      throw new BadRequestException('Could not be create username duplicate');
    }

    const newAuth = this.authRep.create(payload);
    newAuth.password = bcrypt.hashSync(payload.password, 10);

    return await this.authRep.save(newAuth);
  }

  async getAuth(username: string, verifyActive = false) {
    const auth = verifyActive
      ? await this.authRep.findOne({
          where: { username, isActive: true },
          relations: ['user'],
        })
      : await this.authRep.findOne({
          where: { username, isActive: true },
          relations: ['user'],
        });
    if (!auth)
      throw new NotFoundException('Could not be found auth by username');

    return auth;
  }

  async validateAuth(username: string, password: string) {
    const auth = await this.getAuth(username);

    if (!auth.user)
      throw new BadRequestException('Auth does not belong to any user');

    const isMatch = await bcrypt.compare(password, auth.password);

    if (isMatch) return auth;

    return null;
  }

  async generateJwt(auth: Auth) {
    const payload: Token = {
      name: auth.user.name,
      lastName: auth.user.lastName,
      email: auth.user.email,
      username: auth.username,
      type: 'login',
    };
    const token = this.jwtS.sign(payload);

    return token;
  }

  renewToken(payload: Token) {
    const token = this.jwtS.sign(payload);

    return token;
  }
}
