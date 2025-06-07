import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TicketDto } from '../dto/order.dto';
import { Film } from '../../films/entities/film.mongo-entity';
import { IOrderRepository } from './order.repository.interface';
import { Order } from '../entities/order.mongo-entity';

@Injectable()
export class OrderMongoRepository implements IOrderRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async reserveTicket(ticket: TicketDto): Promise<void> {
    const { film, session, row, seat } = ticket;
    const seatId = `${row}:${seat}`;

    const filmDoc = await this.filmModel.findOne({ id: film }).exec();
    if (!filmDoc) throw new Error(`Фильм ${film} не найден`);

    const scheduleSession = filmDoc.schedule.find((s) => s.id === session);
    if (!scheduleSession) throw new Error(`Сеанс ${session} не найден`);

    if (scheduleSession.taken.includes(seatId)) {
      throw new Error(`Место ${seatId} уже занято`);
    }

    await this.filmModel
      .updateOne(
        { id: film, 'schedule.id': session },
        { $addToSet: { 'schedule.$.taken': seatId } },
      )
      .exec();
  }
}
