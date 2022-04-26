import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Role } from './role.entity';
import { Gender } from '../enum/gender.enum';

@Entity({ name: 'users' })
export class User extends AbstractNumberPkEntity {
  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'refresh_tokens', array: true, type: 'varchar' })
  refreshTokens: string[];

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'birth_date', type: 'timestamptz' })
  birthDate: Date;

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
