import { Global, Module } from '@nestjs/common';

// typeORM
import { TypeOrmModule } from '@nestjs/typeorm';

// configType
import config from 'src/config/config';
import { ConfigType } from '@nestjs/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configS: ConfigType<typeof config>) => {
        const { host, port, username, password, database } = configS.database;
        return {
          type: 'postgres',
          host,
          port,
          username,
          password,
          database,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
