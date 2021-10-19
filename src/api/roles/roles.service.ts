import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { createRoleDto, updateRoleDto } from './dtos/role.dto';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private roleRep: Repository<Role>) {}

  async createRole(payload: createRoleDto): Promise<Role> {
    const newRole = this.roleRep.create(payload);

    return await this.roleRep.save(newRole);
  }

  async getRoleById(id: number, verifyActive = false): Promise<Role> {
    const role = verifyActive
      ? await this.roleRep.findOne(id, { where: { isActive: true } })
      : await this.roleRep.findOne(id);
    if (!role) throw new NotFoundException('Could not be found role by Id');

    return role;
  }

  async updateRole(id: number, payload: updateRoleDto): Promise<Role> {
    const role = await this.getRoleById(id, true);
    this.roleRep.merge(role, payload);

    return await this.roleRep.save(role);
  }

  async updateStateRole(id: number, isActive: boolean) {
    const role = await this.getRoleById(id);
    this.roleRep.merge(role, { isActive });

    return await this.roleRep.save(role);
  }
}
