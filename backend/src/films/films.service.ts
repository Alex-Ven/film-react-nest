import { Inject, Injectable } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmsRepository } from './repository/films.repository.interface';
import { getFilmMapperFn } from './dto/films.mapper/films.mongo-mapper';
import { LoggerService } from '@nestjs/common';

@Injectable()
export class FilmsService {
  private readonly mapToDto = getFilmMapperFn();

  constructor(
    @Inject('FilmsRepository')
    private readonly filmsRepository: FilmsRepository,
    @Inject('BASE_LOGGER')
    private readonly logger: LoggerService,
  ) {
    this.logger.log('FilmsService initialized', 'FilmsService');
  }

  async getAllFilms(): Promise<{ total: number; items: FilmDto[] }> {
    this.logger.log('Starting to fetch all films', 'FilmsService');

    try {
      const films = await this.filmsRepository.getAll();
      this.logger.debug(
        `Successfully fetched ${films.length} films`,
        'FilmsService',
      );

      return {
        total: films.length,
        items: films.map(this.mapToDto),
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch films: ${error.message}`,
        error.stack,
        'FilmsService',
      );
      throw new Error('Failed to retrieve films');
    }
  }

  async getFilmById(id: string): Promise<FilmDto> {
    this.logger.log(`Fetching film by ID: ${id}`, 'FilmsService');

    try {
      const film = await this.filmsRepository.getById(id);

      if (!film) {
        this.logger.warn(`Film not found with ID: ${id}`, 'FilmsService');
        throw new Error('Фильм не найден');
      }

      this.logger.debug(
        `Successfully fetched film: ${film.title || film.id}`,
        'FilmsService',
      );

      return this.mapToDto(film);
    } catch (error) {
      this.logger.error(
        `Failed to fetch film by ID ${id}: ${error.message}`,
        error.stack,
        'FilmsService',
      );
      throw error;
    }
  }

  async getFilmSchedule(id: string): Promise<{ items: ScheduleDto[] }> {
    this.logger.log(`Fetching schedule for film ID: ${id}`, 'FilmsService');

    try {
      const schedule = await this.filmsRepository.getScheduleById(id);
      this.logger.debug(
        `Found ${schedule.length} schedule items for film ${id}`,
        'FilmsService',
      );

      return { items: schedule };
    } catch (error) {
      this.logger.error(
        `Failed to fetch schedule for film ${id}: ${error.message}`,
        error.stack,
        'FilmsService',
      );
      throw new Error('Failed to retrieve film schedule');
    }
  }

  async createFilm(filmDto: FilmDto): Promise<FilmDto> {
    this.logger.log('Creating new film', 'FilmsService');
    this.logger.verbose(
      `Film data: ${JSON.stringify(filmDto)}`,
      'FilmsService',
    );

    try {
      const filmEntity = await this.filmsRepository.createFilm(filmDto);
      this.logger.log(
        `Successfully created film with ID: ${filmEntity.id}`,
        'FilmsService',
      );

      return this.mapToDto(filmEntity);
    } catch (error) {
      this.logger.error(
        `Failed to create film: ${error.message}`,
        error.stack,
        'FilmsService',
      );
      throw new Error('Failed to create film');
    }
  }
}
