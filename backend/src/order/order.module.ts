import { DynamicModule, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from '../films/entities/film.mongo-entity';
import { Order, OrderSchema } from './entities/order.mongo-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film as TypeOrmFilm } from '../films/entities/film.entity';
import { Schedule as TypeOrmSchedule } from '../films/entities/schedule.entity';
import { Order as TypeOrmOrder } from './entities/order.entity';
import { OrderMongoRepository } from './repository/order.mongo-repository';
import { OrderTypeOrmRepository } from './repository/order.typeorm-repository';

@Module({})
export class OrderModule {
  static forMongoDB(): DynamicModule {
    return {
      module: OrderModule,
      imports: [
        MongooseModule.forFeature([
          { name: Film.name, schema: FilmSchema },
          { name: Order.name, schema: OrderSchema },
        ]),
      ],
      providers: [
        OrderMongoRepository,
        {
          provide: 'IOrderRepository',
          useClass: OrderMongoRepository,
        },
        OrderService,
      ],
      controllers: [OrderController],
      exports: [OrderService],
    };
  }

  static forPostgreSQL(): DynamicModule {
    return {
      module: OrderModule,
      imports: [
        TypeOrmModule.forFeature([TypeOrmFilm, TypeOrmSchedule, TypeOrmOrder]),
      ],
      providers: [
        OrderTypeOrmRepository,
        {
          provide: 'IOrderRepository',
          useClass: OrderTypeOrmRepository,
        },
        OrderService,
      ],
      controllers: [OrderController],
      exports: [OrderService],
    };
  }
}
