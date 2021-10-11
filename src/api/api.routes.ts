import { Routes } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ApiModule } from './api.module';

export const apiRoutes: Routes = [
  {
    path: 'api',
    module: ApiModule,
    children: [{ path: 'users', module: UsersModule }],
  },
];
