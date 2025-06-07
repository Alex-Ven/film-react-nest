import { Injectable, Inject } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { IOrderRepository } from './repository/order.repository.interface';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
  ) {}

  async createOrder(orderDto: OrderDto): Promise<Order> {
    const { email, phone, tickets } = orderDto;

    for (const ticket of tickets) {
      await this.orderRepository.reserveTicket(ticket);
    }

    return {
      email,
      phone,
      tickets: tickets.map((t) => ({
        ...t,
        id: `${t.row}:${t.seat}`,
      })),
      createdAt: new Date(),
    };
  }
}
