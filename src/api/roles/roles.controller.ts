import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { createRoleDto, updateRoleDto } from './dtos/role.dto';

@Controller()
export class RolesController {
  constructor(private roleS: RolesService) {}

  @Post()
  async postRole(@Body() payload: createRoleDto) {
    const newRole = await this.roleS.createRole(payload);
    return {
      newRole,
    };
  }

  @Put(':id')
  async putRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: updateRoleDto,
  ) {
    const role = await this.roleS.updateRole(id, payload);
    return {
      role,
    };
  }

  @Delete(':id')
  async inactivateRole(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleS.updateStateRole(id, false);
    return {
      role,
    };
  }

  @Patch(':id')
  async activateRole(@Param('id', ParseIntPipe) id: number) {
    const role = await this.roleS.updateStateRole(id, true);
    return {
      role,
    };
  }
}
