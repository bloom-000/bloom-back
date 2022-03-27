import { Column, Entity } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';

@Entity({ name: 'users' })
export class User extends AbstractNumberPkEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'refresh_tokens', array: true, type: 'varchar' })
  refreshTokens: string[];
}
