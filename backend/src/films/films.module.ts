import { DynamicModule, Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsTypeOrmRepository } from './repository/films.typeorm-repository';
import { FilmsMongoRepository } from './repository/films.mongo-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { FilmSchema } from './entities/film.mongo-entity';
import { Film as TypeOrmFilm } from './entities//film.entity';
import { Schedule as TypeOrmSchedule } from './entities/schedule.entity';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {
  static forRoot(driver: 'postgres' | 'mongodb'): DynamicModule {
    const imports = [];
    const providers = [];

    if (driver === 'postgres') {
      imports.push(TypeOrmModule.forFeature([TypeOrmFilm, TypeOrmSchedule]));
      providers.push({
        provide: 'FilmsRepository',
        useExisting: FilmsTypeOrmRepository,
      });
    } else {
      imports.push(
        MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }]),
      );
      providers.push({
        provide: 'FilmsRepository',
        useExisting: FilmsMongoRepository,
      });
    }

    return {
      module: FilmsModule,
      imports,
      providers,
      exports: ['FilmsRepository'],
    };
  }
}
