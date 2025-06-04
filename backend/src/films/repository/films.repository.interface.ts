// films.repository.interface.ts
import { FilmDto, ScheduleDto } from '../dto/films.dto';

export interface FilmsRepository {
  getAll(): Promise<FilmDto[]>;
  getById(id: string): Promise<FilmDto | null>;
  getScheduleById(id: string): Promise<ScheduleDto[]>;
  createFilm(filmData: Partial<FilmDto>): Promise<FilmDto>;
}
