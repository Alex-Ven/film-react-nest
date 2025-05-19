export class FilmDto {
  readonly id: string;
  readonly rating: number;
  readonly director: string;
  readonly tags: string[];
  readonly image: string;
  readonly cover: string;
  readonly title: string;
  readonly about: string;
  readonly description: string;
  readonly schedule: ScheduleDto[];
}

export class ScheduleDto {
  readonly id: string;
  readonly daytime: string;
  readonly hall: number;
  readonly rows: number;
  readonly seats: number;
  readonly price: number;
  readonly taken: string[];
}
