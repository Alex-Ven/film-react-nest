import { Film as FilmEntity } from '../../entities/film.entity';
import { Schedule as ScheduleEntity } from '../../entities/schedule.entity';
import { FilmDto, ScheduleDto } from '../films.dto';

export const mapScheduleToTypeOrmEntity = (
  scheduleDto: ScheduleDto,
): ScheduleEntity => ({
  id: scheduleDto.id,
  daytime: new Date(scheduleDto.daytime),
  hall: scheduleDto.hall,
  rows: scheduleDto.rows,
  seats: scheduleDto.seats,
  price: scheduleDto.price,
  taken: scheduleDto.taken,
  film: new FilmEntity(),
});

export const mapFilmDtoToTypeOrmEntity = (
  filmDto: FilmDto,
): Partial<FilmEntity> => ({
  id: filmDto.id,
  title: filmDto.title,
  director: filmDto.director,
  rating: filmDto.rating,
  tags: filmDto.tags,
  image: filmDto.image,
  cover: filmDto.cover,
  about: filmDto.about,
  description: filmDto.description,
  schedule: filmDto.schedule?.map(mapScheduleToTypeOrmEntity) || [],
});

export const mapScheduleToDto = (schedule: ScheduleEntity): ScheduleDto => ({
  id: schedule.id,
  daytime: schedule.daytime.toISOString(),
  hall: schedule.hall,
  rows: schedule.rows,
  seats: schedule.seats,
  price: schedule.price,
  taken: schedule.taken,
});

export const mapFilmToDto = (film: FilmEntity): FilmDto => ({
  id: film.id,
  title: film.title,
  director: film.director,
  rating: film.rating,
  tags: film.tags,
  image: film.image,
  cover: film.cover,
  about: film.about,
  description: film.description,
  schedule: film.schedule?.map(mapScheduleToDto) || [],
});
