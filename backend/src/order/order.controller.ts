import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: OrderDto) {
    const order = await this.orderService.createOrder(dto);

    return {
      total: order.tickets.length,
      items: order.tickets.map((ticket) => ({
        ...ticket,
        id: `${ticket.row}:${ticket.seat}`,
      })),
    };
  }
}
