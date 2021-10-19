import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Auth } from './entities/auth.entity';
import { User } from '../users/entities/user.entity';

// controllers
import { AuthenticationController } from './authentication.controller';

// Jwt Module and config Environments
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';

// Strategies
import { localStrategy } from './strategies/local.strategy';
import { jwtStrategySecret } from './strategies/jwt-secret.strategy';

@Module({
  providers: [AuthenticationService, localStrategy, jwtStrategySecret],
  imports: [
    TypeOrmModule.forFeature([Auth, User]),
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configS: ConfigType<typeof config>) => {
        return {
          secret: configS.jwtSeed.secret,
          signOptions: {
            expiresIn: '10d',
          },
        };
      },
    }),
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
