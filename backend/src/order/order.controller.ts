import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() dto: OrderDto) {
    await this.orderService.createOrder(dto);
    return {
      message: 'Билеты успешно забронированы',
      items: dto.tickets.map((t) => ({ ...t, id: `${t.row}:${t.seat}` })),
    };
  }
}
