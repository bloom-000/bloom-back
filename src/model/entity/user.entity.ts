import { Column, Entity } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Role } from '../common/role.enum';

@Entity({ name: 'users' })
export class User extends AbstractNumberPkEntity {
  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'refresh_tokens', array: true, type: 'varchar' })
  refreshTokens: string[];

  @Column({ name: 'roles', array: true, type: 'enum', enum: Role })
  roles: Role[];
}
