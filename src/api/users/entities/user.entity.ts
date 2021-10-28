import { CommonEntity } from '../../common/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auth } from '../../authentication/entities/auth.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'users' })
export class User extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rfc: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photo: string;

  @OneToOne(() => Auth, (auth) => auth.user, { nullable: true })
  @JoinColumn({ name: 'auth_id' })
  authentication: Auth;

  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
