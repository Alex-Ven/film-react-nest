import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmsService } from './films.service';

interface ApiListResponse<T> {
  total: number;
  items: T[];
}

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAllFilms(): Promise<ApiListResponse<FilmDto>> {
    return this.filmsService.getAllFilms();
  }

  @Get(':id/schedule')
  async getFilmSchedule(
    @Param('id') id: string,
  ): Promise<{ items: ScheduleDto[] }> {
    return this.filmsService.getFilmSchedule(id);
  }

  @Post()
  async createFilm(@Body() filmDto: FilmDto): Promise<FilmDto> {
    return this.filmsService.createFilm(filmDto);
  }
}
