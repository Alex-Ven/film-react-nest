import { Injectable } from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import {
  getFilmMapperFn,
  mapFilmDtoToEntity,
  mapScheduleToDto,
} from './dto/films.mapper';

@Injectable()
export class FilmsService {
  private mapToDto = getFilmMapperFn();

  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getAllFilms(): Promise<{ total: number; items: FilmDto[] }> {
    const films = await this.filmsRepository.getAll();
    return {
      total: films.length,
      items: films.map(this.mapToDto),
    };
  }

  async getFilmById(id: string): Promise<FilmDto> {
    const film = await this.filmsRepository.getById(id);
    if (!film) throw new Error('Фильм не найден');
    return this.mapToDto(film);
  }
  async getFilmSchedule(id: string): Promise<{ items: ScheduleDto[] }> {
    const schedule = await this.filmsRepository.getScheduleById(id);
    return {
      items: schedule.map(mapScheduleToDto),
    };
  }

  async createFilm(filmDto: FilmDto): Promise<FilmDto> {
    const filmEntity = mapFilmDtoToEntity(filmDto);
    const createdFilm = await this.filmsRepository.createFilm(filmEntity);
    return this.mapToDto(createdFilm);
  }
}
