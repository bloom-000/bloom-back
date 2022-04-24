import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role extends AbstractNumberPkEntity {
  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => Permission, (permission) => permission.role)
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
