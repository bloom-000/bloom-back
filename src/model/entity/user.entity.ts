import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';
import { Role } from './role.entity';
import { Gender } from '../enum/gender.enum';
import { RefreshToken } from './refresh-token.entity';

@Entity({ name: 'users' })
export class User extends AbstractNumberPkEntity {
  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

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
