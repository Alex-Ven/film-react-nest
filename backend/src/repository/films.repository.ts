import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, Schedule } from '../films/entities/film.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilmsRepository {
  private readonly logger = new Logger(FilmsRepository.name);
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async getAll(): Promise<Film[]> {
    return this.filmModel.find().exec();
  }
  catch(error) {
    this.logger.error('Error fetching films', error.stack);
    throw error;
  }

  async getById(id: string): Promise<Film | null> {
    return this.filmModel.findById(id).exec();
  }

  async getScheduleById(id: string): Promise<Schedule[]> {
    const film = await this.filmModel.findById(id).exec();
    if (!film) {
      return [];
    }
    return film.schedule || [];
  }

  async createFilm(filmData: Partial<Film>): Promise<Film> {
    const createdFilm = await this.filmModel.create(filmData);
    return createdFilm;
  }
}
