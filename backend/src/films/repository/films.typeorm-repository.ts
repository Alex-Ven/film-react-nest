import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film as TypeOrmFilm } from '../entities/film.entity';
import { Schedule as TypeOrmSchedule } from '../entities/schedule.entity';
import { FilmsRepository } from './films.repository.interface';
import { FilmDto, ScheduleDto } from '../dto/films.dto';
import {
  mapFilmToDto,
  mapScheduleToDto,
} from '../dto/films.mapper/films.typeorm-mapper';

@Injectable()
export class FilmsTypeOrmRepository implements FilmsRepository {
  constructor(
    @InjectRepository(TypeOrmFilm)
    private readonly filmRepository: Repository<TypeOrmFilm>,
    @InjectRepository(TypeOrmSchedule)
    private readonly scheduleRepository: Repository<TypeOrmSchedule>,
  ) {}

  async getAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({ relations: ['schedule'] });
    return films.map(mapFilmToDto);
  }

  async getById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });

    return film ? mapFilmToDto(film) : null;
  }

  async getScheduleById(id: string): Promise<ScheduleDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { film: { id } },
    });

    return schedules.map(mapScheduleToDto);
  }

  async createFilm(data: Partial<FilmDto>): Promise<FilmDto> {
    const film = this.filmRepository.create({
      ...data,
      schedule:
        data.schedule?.map((dto) =>
          this.scheduleRepository.create({ ...dto, film }),
        ) || [],
    });

    const savedFilm = await this.filmRepository.save(film);

    if (savedFilm.schedule && savedFilm.schedule.length > 0) {
      await this.scheduleRepository.save(savedFilm.schedule);
    }

    return mapFilmToDto(savedFilm);
  }
}
