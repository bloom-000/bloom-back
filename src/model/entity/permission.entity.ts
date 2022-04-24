import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'permissions' })
export class Permission extends AbstractNumberPkEntity {
  @Column({ name: 'permission' })
  permission: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  role: Role;
}
