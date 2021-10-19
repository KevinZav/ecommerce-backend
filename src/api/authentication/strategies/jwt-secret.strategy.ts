import { Inject } from '@nestjs/common';

// Passport & config Environments
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';

// Model token
import { Token } from '../models/token-jwt';

export class jwtStrategySecret extends PassportStrategy(
  Strategy,
  'jwt-secret',
) {
  constructor(@Inject(config.KEY) private configS: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configS.jwtSeed.secret,
    });
  }

  validate(payload: Token) {
    return {
      name: payload.name,
      lastName: payload.lastName,
      email: payload.email,
      username: payload.username,
      type: payload.type,
    };
  }
}
