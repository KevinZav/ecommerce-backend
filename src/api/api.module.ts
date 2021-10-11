import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RouterModule } from '@nestjs/core';
import { apiRoutes } from './api.routes';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [UsersModule, RouterModule.register(apiRoutes), AuthenticationModule],
})
export class ApiModule {}
