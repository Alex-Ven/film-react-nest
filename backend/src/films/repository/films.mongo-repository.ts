import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../entities/film.mongo-entity';
import { FilmsRepository } from './films.repository.interface';
import { FilmDto, ScheduleDto } from '../dto/films.dto';
import {
  getFilmMapperFn,
  mapFilmDtoToEntity,
  mapScheduleToDto,
} from '../dto/films.mapper/films.mongo-mapper';

@Injectable()
export class FilmsMongoRepository implements FilmsRepository {
  private mapFilmToDto = getFilmMapperFn();
  private readonly logger = new Logger(FilmsMongoRepository.name);
  constructor(@InjectModel('Film') private readonly filmModel: Model<Film>) {}

  async getAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map(this.mapFilmToDto);
  }

  async getById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findById(id).exec();
    return film ? this.mapFilmToDto(film) : null;
  }

  async getScheduleById(id: string): Promise<ScheduleDto[]> {
    const film = await this.filmModel.findOne({ id }).exec(); // Исправлено: findOne вместо findById
    if (!film || !film.schedule || !Array.isArray(film.schedule)) {
      this.logger.warn(`Film or schedule not found for id: ${id}`);
      return [];
    }
    return film.schedule.map(mapScheduleToDto);
  }

  async createFilm(data: Partial<FilmDto>): Promise<FilmDto> {
    const filmEntity = mapFilmDtoToEntity(data);
    const createdFilm = await this.filmModel.create(filmEntity);
    return this.mapFilmToDto(createdFilm);
  }
}
