import { Document } from 'mongoose';
import { Film } from './film.entity';

// FilmDocument = Film + Mongoose Document
export type FilmDocument = Film & Document;
