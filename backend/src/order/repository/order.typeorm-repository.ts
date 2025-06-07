import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketDto } from '../dto/order.dto';
import { Film as TypeOrmFilm } from '../../films/entities/film.entity';
import { Schedule as TypeOrmSchedule } from '../../films/entities/schedule.entity';
import { IOrderRepository } from './order.repository.interface';
import { Order as TypeOrmOrder } from '../entities/order.entity';

@Injectable()
export class OrderTypeOrmRepository implements IOrderRepository {
  constructor(
    @InjectRepository(TypeOrmFilm)
    private readonly filmRepository: Repository<TypeOrmFilm>,
    @InjectRepository(TypeOrmSchedule)
    private readonly scheduleRepository: Repository<TypeOrmSchedule>,
    @InjectRepository(TypeOrmOrder)
    private readonly orderRepository: Repository<TypeOrmOrder>,
  ) {}

  async reserveTicket(ticket: TicketDto): Promise<void> {
    const { film, session, row, seat } = ticket;
    const seatId = `${row}:${seat}`;

    const filmEntity = await this.filmRepository.findOne({
      where: { id: film },
      relations: ['schedule'],
    });
    if (!filmEntity) throw new Error(`Фильм ${film} не найден`);

    const scheduleSession = filmEntity.schedule.find((s) => s.id === session);
    if (!scheduleSession) throw new Error(`Сеанс ${session} не найден`);

    if (scheduleSession.taken.includes(seatId)) {
      throw new Error(`Место ${seatId} уже занято`);
    }

    scheduleSession.taken.push(seatId);
    await this.scheduleRepository.save(scheduleSession);
  }
}
