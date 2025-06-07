import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketDto, OrderDto } from './dto/order.dto';
import { Film } from '../films/entities/film.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async createOrder(orderDto: OrderDto): Promise<void> {
    const { tickets } = orderDto;

    for (const ticket of tickets) {
      await this.reserveTicket(ticket);
    }
  }

  private async reserveTicket(ticket: TicketDto): Promise<void> {
    const { film, session, row, seat } = ticket;
    const takenSeatId = `${row}:${seat}`;

    const filmDoc = await this.filmModel.findOne({ id: film }).exec();
    if (!filmDoc) throw new Error(`Фильм ${film} не найден`);

    const scheduleSession = filmDoc.schedule.find((s) => s.id === session);
    if (!scheduleSession) throw new Error(`Сеанс ${session} не найден`);

    if (scheduleSession.taken.includes(takenSeatId)) {
      throw new Error(`Место ${takenSeatId} уже занято`);
    }

    scheduleSession.taken.push(takenSeatId);

    await this.filmModel
      .updateOne(
        { id: film, 'schedule.id': session },
        { $addToSet: { 'schedule.$.taken': takenSeatId } },
      )
      .exec();
  }
}
