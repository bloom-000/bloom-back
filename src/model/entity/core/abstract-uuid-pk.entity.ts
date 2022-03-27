import { PrimaryGeneratedColumn } from 'typeorm';
import { DateAuditEntity } from './date-audit.entity';

export class AbstractUuidPkEntity extends DateAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
