import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';

//Routes
import { appRoutes } from './app.routes';
import { RouterModule } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';

// Config environments
import config from './config/config';
import { environments } from './config/environments';
import { ConfigModule } from '@nestjs/config';

// Schema validation
import * as Joi from 'joi';

@Module({
  imports: [
    ApiModule,
    RouterModule.register(appRoutes),
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || '.env',
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        JWT_SEED_PUBLIC: Joi.string().required(),
        JWT_SEED_SECRET: Joi.string().required(),
        EMAIL_API_KEY: Joi.string().required(),
      }),
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
