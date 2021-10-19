import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';

@Module({
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
})
export class RolesModule {}
