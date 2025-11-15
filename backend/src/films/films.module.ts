import { DynamicModule, Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsTypeOrmRepository } from './repository/films.typeorm-repository';
import { FilmsMongoRepository } from './repository/films.mongo-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmSchema } from './entities/film.mongo-entity';
import { Film as TypeOrmFilm } from './entities/film.entity';
import { Schedule as TypeOrmSchedule } from './entities/schedule.entity';

@Module({})
export class FilmsModule {
  static forMongoDB(): DynamicModule {
    return {
      module: FilmsModule,
      imports: [
        MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }]),
      ],
      providers: [
        FilmsMongoRepository,
        {
          provide: 'FilmsRepository',
          useClass: FilmsMongoRepository,
        },
        FilmsService,
      ],
      controllers: [FilmsController],
      exports: [FilmsService],
    };
  }

  static forPostgreSQL(): DynamicModule {
    return {
      module: FilmsModule,
      imports: [TypeOrmModule.forFeature([TypeOrmFilm, TypeOrmSchedule])],
      providers: [
        FilmsTypeOrmRepository,
        {
          provide: 'FilmsRepository',
          useClass: FilmsTypeOrmRepository,
        },
        FilmsService,
      ],
      controllers: [FilmsController],
      exports: [FilmsService],
    };
  }
}
