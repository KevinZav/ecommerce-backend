import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

// Dtos
import { createUserDto, updateUserDto } from './dtos/user.dto';
import { createAuthDto } from '../authentication/dtos/auth.dto';

// JWT & Token
import { JwtService } from '@nestjs/jwt';
import { TokenPublic } from './models/token-jwt.public';

// Auth Service
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRep: Repository<User>,
    @InjectRepository(Role) private roleRep: Repository<Role>,
    private authS: AuthenticationService,
    private jwtS: JwtService,
  ) {}

  async createUser(payload: createUserDto): Promise<User> {
    const newUser = this.userRep.create(payload);

    return await this.userRep.save(newUser);
  }

  async getUserById(id: number, verifyActive = false): Promise<User> {
    const user = verifyActive
      ? await this.userRep.findOne(id, { where: { isActive: true } })
      : await this.userRep.findOne(id);

    if (!user) throw new NotFoundException('Could not be found user by id');

    return user;
  }

  async getUserByEmail(email: string, verifyActive = false) {
    const user = verifyActive
      ? await this.userRep.findOne({
          where: { email, isActive: true },
          relations: ['authentication'],
        })
      : await this.userRep.findOne({
          where: { email },
          relations: ['authentication'],
        });
    if (!user) throw new NotFoundException('Could not be find user by email');

    return user;
  }

  private async getRoleById(id: number, verifyActive = false): Promise<Role> {
    const role = verifyActive
      ? await this.roleRep.findOne(id, { where: { isActive: true } })
      : await this.roleRep.findOne(id);
    if (!role) throw new NotFoundException('Could not be find role by id');

    return role;
  }

  async updateUser(id: number, payload: updateUserDto): Promise<User> {
    const user = await this.getUserById(id, true);

    this.userRep.merge(user, payload);
    return await this.userRep.save(user);
  }

  async updateStatusUser(id: number, isActive: boolean): Promise<User> {
    const user = await this.getUserById(id);

    this.userRep.merge(user, { isActive });

    return await this.userRep.save(user);
  }

  async getTokenByEmail(email: string, type: string): Promise<string> {
    const user = await this.getUserByEmail(email, true);

    const payload: TokenPublic = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      type,
    };
    const token = this.jwtS.sign(payload);
    return token;
  }

  async createAuthByEmail(token: TokenPublic, payload: createAuthDto) {
    const user = await this.getUserByEmail(token.email, true);
    console.log(user);
    console.log(user.authentication);
    if (user.authentication)
      throw new BadRequestException(
        'Could not be overwrite user authentication. You must request a change of credentials',
      );
    const newAuth = await this.authS.createAuth(payload);

    user.authentication = newAuth;

    return await this.userRep.save(user);
  }

  async assingRole(idUser: number, idRole: number) {
    const user = await this.getUserById(idUser, true);
    const role = await this.getRoleById(idRole, true);

    user.role = role;
    return await this.userRep.save(user);
  }
}
