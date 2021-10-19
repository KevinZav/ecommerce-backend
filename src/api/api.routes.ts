import { Routes } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ApiModule } from './api.module';
import { RolesModule } from './roles/roles.module';
import { AuthenticationModule } from './authentication/authentication.module';

export const apiRoutes: Routes = [
  {
    path: 'api',
    module: ApiModule,
    children: [
      { path: 'users', module: UsersModule },
      { path: 'roles', module: RolesModule },
      { path: 'auth', module: AuthenticationModule },
    ],
  },
];
