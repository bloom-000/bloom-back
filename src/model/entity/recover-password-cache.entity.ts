import { Column, Entity } from 'typeorm';
import { AbstractNumberPkEntity } from './core/abstract-number-pk.entity';

@Entity({ name: 'recover_password_cache' })
export class RecoverPasswordCache extends AbstractNumberPkEntity {
  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'uuid', nullable: true })
  uuid?: string;

  @Column({ name: 'is_confirmed' })
  isConfirmed: boolean;

  @Column({ name: 'code' })
  code: string;
}
