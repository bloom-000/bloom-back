import { Column, Entity, JoinTable, ManyToMany, RelationId } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User extends AbstractNumberPkEntity {
  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'refresh_tokens', array: true, type: 'varchar' })
  refreshTokens: string[];

  @RelationId((user: User) => user.roles)
  roleIds: number[];

  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];
}
