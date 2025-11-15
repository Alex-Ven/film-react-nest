import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TicketDto } from '../dto/order.dto';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id?: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('jsonb')
  tickets: TicketDto[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
