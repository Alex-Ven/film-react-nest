import { Injectable, Inject } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { IOrderRepository } from './repository/order.repository.interface';
import { Order } from './entities/order.entity';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @Inject('BASE_LOGGER') private readonly logger: LoggerService,
  ) {
    this.logger.log('OrderService initialized', 'OrderService');
  }

  async createOrder(orderDto: OrderDto): Promise<Order> {
    const logContext = 'OrderService';
    const { email, phone, tickets } = orderDto;

    this.logger.log(`Creating order for ${email || phone}`, logContext);
    this.logger.verbose(
      `Order details: ${JSON.stringify({ email, phone, ticketCount: tickets.length })}`,
      logContext,
    );

    this.logger.debug(`Reserving ${tickets.length} tickets`, logContext);

    try {
      for (const [index, ticket] of tickets.entries()) {
        await this.orderRepository.reserveTicket(ticket);
        this.logger.verbose(
          `Reserved ticket ${index + 1}/${tickets.length}: row ${ticket.row}, seat ${ticket.seat}`,
          logContext,
        );
      }

      const order: Order = {
        email,
        phone,
        tickets: tickets.map((t) => ({
          ...t,
          id: `${t.row}:${t.seat}`,
        })),
        createdAt: new Date(),
      };

      this.logger.log(
        `Order created successfully for ${email || phone}`,
        logContext,
      );
      this.logger.debug(`Order details: ${JSON.stringify(order)}`, logContext);

      return order;
    } catch (error) {
      this.logger.error(
        `Failed to create order: ${error.message}`,
        error.stack,
        logContext,
      );
      throw new Error(`Order creation failed: ${error.message}`);
    }
  }
}
