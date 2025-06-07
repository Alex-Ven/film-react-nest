import { Document } from 'mongoose';
import { Film } from './film.entity';

export type FilmDocument = Film & Document;
