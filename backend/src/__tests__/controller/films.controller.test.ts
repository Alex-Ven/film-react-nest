import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../../films/films.controller';
import { FilmsService } from '../../films/films.service';
import { FilmDto, ScheduleDto } from '../../films/dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<FilmsService>;

  const mockFilmDto: FilmDto = {
    id: '1',
    rating: 8.5,
    director: 'Christopher Nolan',
    tags: ['sci-fi', 'action'],
    image: 'image.jpg',
    cover: 'cover.jpg',
    title: 'Inception',
    about: 'A mind-bending movie',
    description: 'Detailed description',
    schedule: [
      {
        id: 'session1',
        daytime: '2023-01-01T18:00:00',
        hall: 1,
        rows: 10,
        seats: 20,
        price: 500,
        taken: ['1:2', '1:3'],
      },
    ],
  };

  const mockScheduleDto: ScheduleDto[] = [
    {
      id: 'session1',
      daytime: '2023-01-01T18:00:00',
      hall: 1,
      rows: 10,
      seats: 20,
      price: 500,
      taken: [],
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            getAllFilms: jest.fn(),
            getFilmSchedule: jest.fn(),
            createFilm: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    filmsService = module.get(FilmsService) as jest.Mocked<FilmsService>;
  });

  describe('getAllFilms', () => {
    it('should return films list with correct DTO structure', async () => {
      filmsService.getAllFilms.mockResolvedValue({
        total: 1,
        items: [mockFilmDto],
      });

      const result = await controller.getAllFilms();

      expect(result).toEqual({
        total: 1,
        items: [mockFilmDto],
      });
      expect(result.items[0]).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        schedule: expect.arrayContaining([
          expect.objectContaining({
            daytime: expect.any(String),
            price: expect.any(Number),
          }),
        ]),
      });
    });
  });

  describe('getFilmSchedule', () => {
    it('should return film schedule with correct DTO structure', async () => {
      filmsService.getFilmSchedule.mockResolvedValue({
        items: mockScheduleDto,
      });

      const result = await controller.getFilmSchedule('1');

      expect(result).toEqual({
        items: mockScheduleDto,
      });
      expect(result.items[0]).toMatchObject({
        id: expect.any(String),
        hall: expect.any(Number),
        price: expect.any(Number),
        taken: expect.any(Array),
      });
    });
  });

  describe('createFilm', () => {
    it('should create new film with complete DTO', async () => {
      const newFilmDto: FilmDto = {
        ...mockFilmDto,
        id: 'new-id',
        title: 'New Film',
      };

      filmsService.createFilm.mockResolvedValue(newFilmDto);

      const result = await controller.createFilm(newFilmDto);

      expect(result).toEqual(newFilmDto);
      expect(result.schedule[0]).toHaveProperty('daytime');
      expect(result.schedule[0]).toHaveProperty('taken');
      expect(filmsService.createFilm).toHaveBeenCalledWith(newFilmDto);
    });
  });
});
