import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Schedule {
  @Prop({ required: true, type: String, unique: true })
  id: string;

  @Prop({ type: Date, required: true })
  daytime: Date;

  @Prop({ required: true })
  hall: number;

  @Prop({ required: true })
  rows: number;

  @Prop({ required: true })
  seats: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [String], default: [] })
  taken: string[];
}

@Schema({ _id: false })
export class Film {
  @Prop({ required: true, type: String, unique: true })
  id: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ required: true })
  director: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  cover: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  about: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [Schedule], default: [] })
  schedule: Schedule[];
}

export const ScheduleSchema = SchemaFactory.createForClass(Schedule);
export const FilmSchema = SchemaFactory.createForClass(Film);
