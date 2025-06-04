import { Inject, Injectable } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmsRepository } from './repository/films.repository.interface';
import { getFilmMapperFn } from './dto/films.mapper/films.mongo-mapper';

@Injectable()
export class FilmsService {
  private mapToDto = getFilmMapperFn();

  constructor(
    @Inject('FilmsRepository')
    private readonly filmsRepository: FilmsRepository,
  ) {}

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
      items: schedule,
    };
  }

  async createFilm(filmDto: FilmDto): Promise<FilmDto> {
    const filmEntity = await this.filmsRepository.createFilm(filmDto);
    return this.mapToDto(filmEntity);
  }
}
