/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AsteroidsService } from './app.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asteroid } from './entities/asteroid.entity';
import { of } from 'rxjs';

describe('AsteroidsService', () => {
  let service: AsteroidsService;
  let httpService: HttpService;
  let asteroidRepository: Repository<Asteroid>;

  const mockAsteroidRepository = {
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AsteroidsService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: getRepositoryToken(Asteroid),
          useValue: mockAsteroidRepository,
        },
      ],
    }).compile();

    service = module.get<AsteroidsService>(AsteroidsService);
    httpService = module.get<HttpService>(HttpService);
    asteroidRepository = module.get<Repository<Asteroid>>(
      getRepositoryToken(Asteroid),
    );
  });

  describe('findAllAsteroids', () => {
    it('should return an array of asteroids', async () => {
      const result = [
        { id: 1, name: 'Asteroid 1' },
        { id: 2, name: 'Asteroid 2' },
      ];
      mockAsteroidRepository.find.mockResolvedValue(result);

      expect(await service.findAllAsteroids()).toBe(result);
      expect(mockAsteroidRepository.find).toHaveBeenCalled();
    });
  });

  describe('getAsteroids', () => {
    it('should return asteroid data from the API', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-07';
      const apiResponse = { data: { near_earth_objects: [] } };
      mockHttpService.get.mockReturnValue(of(apiResponse));

      const result = await service.getAsteroids(startDate, endDate);

      expect(result).toEqual(apiResponse.data);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=DEMO_KEY`,
      );
    });
  });

  describe('checkForNewAsteroids', () => {
    it('should fetch new asteroids and save them to the database', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-07';
      const apiResponse = {
        data: {
          near_earth_objects: {
            '2024-01-01': [
              {
                name: 'Asteroid 1',
                nasa_jpl_url: 'url1',
                estimated_diameter: {
                  kilometers: { estimated_diameter_max: 1 },
                },
              },
            ],
            '2024-01-02': [
              {
                name: 'Asteroid 2',
                nasa_jpl_url: 'url2',
                estimated_diameter: {
                  kilometers: { estimated_diameter_max: 2 },
                },
              },
            ],
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(apiResponse));

      await service['checkForNewAsteroids'](); // Access private method for testing

      expect(mockHttpService.get).toHaveBeenCalled();
      expect(mockAsteroidRepository.save).toHaveBeenCalledTimes(2);
      expect(mockAsteroidRepository.save).toHaveBeenCalledWith({
        name: 'Asteroid 1',
        nasa_jpl_url: 'url1',
        estimated_diameter: 1,
      });
      expect(mockAsteroidRepository.save).toHaveBeenCalledWith({
        name: 'Asteroid 2',
        nasa_jpl_url: 'url2',
        estimated_diameter: 2,
      });
    });
  });

  describe('getFormattedDate', () => {
    it('should return a formatted date string', () => {
      const date = new Date('2024-01-01');
      const formattedDate = service['getFormattedDate'](date);
      expect(formattedDate).toBe('2024-01-01');
    });
  });

  describe('subtractDays', () => {
    it('should return a date that is the specified number of days in the past', () => {
      const date = new Date('2024-01-10');
      const result = service['subtractDays'](date, 5);
      expect(result.getDate()).toBe(5);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2024);
    });
  });
});
