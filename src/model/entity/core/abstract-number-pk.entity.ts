import { PrimaryGeneratedColumn } from 'typeorm';
import { DateAuditEntity } from './date-audit.entity';

export class AbstractNumberPkEntity extends DateAuditEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
