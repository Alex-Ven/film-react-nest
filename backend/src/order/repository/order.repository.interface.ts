import { TicketDto } from '../dto/order.dto';

export const ORDER_REPOSITORY = 'IOrderRepository';

export interface IOrderRepository {
  reserveTicket(ticket: TicketDto): Promise<void>;
}
