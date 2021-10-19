import { Inject, Injectable } from '@nestjs/common';

// Passport and config Environments
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';

// Interface TokenPublic
import { TokenPublic } from '../models/token-jwt.public';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(config.KEY) private configS: ConfigType<typeof config>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configS.jwtSeed.public,
    });
  }

  async validate(payload: TokenPublic) {
    return {
      name: payload.name,
      lastName: payload.lastName,
      email: payload.email,
      type: payload.type,
    };
  }
}
