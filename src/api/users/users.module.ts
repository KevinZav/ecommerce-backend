import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from './entities/user.entity';
import { Auth } from '../authentication/entities/auth.entity';
import { Role } from '../roles/entities/role.entity';

// Service
import { UsersService } from './users.service';

// Jwt and config modules
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';

// Passport Module & strategy
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt-public.strategy';

// Authentication Module
import { AuthenticationModule } from '../authentication/authentication.module';
import { jwtStrategySecret } from '../authentication/strategies/jwt-secret.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auth, Role]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configS: ConfigType<typeof config>) => {
        return {
          secret: configS.jwtSeed.public,
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    AuthenticationModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, jwtStrategySecret],
})
export class UsersModule {}
