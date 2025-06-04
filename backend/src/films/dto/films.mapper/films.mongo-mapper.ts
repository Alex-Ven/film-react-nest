import {
  Schedule as ScheduleEntity,
  Film as FilmEntity,
} from '../../entities/film.mongo-entity';
import { FilmDto, ScheduleDto } from '../films.dto';

// Маппер для расписания
export const mapScheduleToDto = (schedule: ScheduleEntity): ScheduleDto => ({
  id: schedule.id,
  daytime:
    schedule.daytime instanceof Date
      ? schedule.daytime.toISOString()
      : new Date(schedule.daytime).toISOString(), // если это строка
  hall: schedule.hall,
  rows: schedule.rows,
  seats: schedule.seats,
  price: schedule.price,
  taken: schedule.taken,
});

// Фабрика маппера для фильма
export const getFilmMapperFn = () => {
  return (film: any): FilmDto => ({
    //id: film._id.toHexString(),
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
};

export const mapScheduleToEntity = (
  scheduleDto: ScheduleDto,
): ScheduleEntity => ({
  id: scheduleDto.id,
  daytime: new Date(scheduleDto.daytime),
  hall: scheduleDto.hall,
  rows: scheduleDto.rows,
  seats: scheduleDto.seats,
  price: scheduleDto.price,
  taken: scheduleDto.taken,
});

export const mapFilmDtoToEntity = (
  filmDto: Partial<FilmDto>,
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
  schedule: filmDto.schedule?.map(mapScheduleToEntity) || [],
});
