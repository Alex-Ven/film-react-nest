import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../../order/order.controller';
import { OrderService } from '../../order/order.service';
import { OrderDto, TicketDto } from '../../order/dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<OrderService>;

  const mockTicketDto: TicketDto = {
    film: 'film1',
    session: 'session1',
    row: 1,
    seat: 5,
  };

  const mockOrderDto: OrderDto = {
    email: 'test@example.com',
    phone: '+1234567890',
    tickets: [mockTicketDto],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    orderService = module.get(OrderService) as jest.Mocked<OrderService>;
  });

  describe('createOrder', () => {
    it('should create order with tickets and return formatted response', async () => {
      const mockOrder = {
        ...mockOrderDto,
        createdAt: new Date(),
        tickets: mockOrderDto.tickets,
      };

      orderService.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(mockOrderDto);

      expect(result).toEqual({
        total: 1,
        items: [
          {
            ...mockTicketDto,
            id: '1:5',
          },
        ],
      });
      expect(orderService.createOrder).toHaveBeenCalledWith(mockOrderDto);
    });

    it('should handle multiple tickets correctly', async () => {
      const multiTicketOrder: OrderDto = {
        ...mockOrderDto,
        tickets: [
          { ...mockTicketDto, row: 1, seat: 5 },
          { ...mockTicketDto, row: 1, seat: 6 },
          { ...mockTicketDto, row: 2, seat: 1 },
        ],
      };

      const mockOrder = {
        ...multiTicketOrder,
        createdAt: new Date(),
      };

      orderService.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(multiTicketOrder);

      expect(result.total).toBe(3);
      expect(result.items).toEqual([
        { ...multiTicketOrder.tickets[0], id: '1:5' },
        { ...multiTicketOrder.tickets[1], id: '1:6' },
        { ...multiTicketOrder.tickets[2], id: '2:1' },
      ]);
    });

    it('should validate ticket DTO structure', async () => {
      const invalidTicket = {
        film: 'film1',
        row: 'not-a-number',
        seat: 5,
      } as any;

      await expect(
        controller.createOrder({
          ...mockOrderDto,
          tickets: [invalidTicket],
        }),
      ).rejects.toThrow();
    });
  });
});
