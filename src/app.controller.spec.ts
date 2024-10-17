import { Test, TestingModule } from '@nestjs/testing';
import { AsteroidsController } from './app.controller';
import { AsteroidsService } from './app.service';

describe('AsteroidsController', () => {
  let asteroidsController: AsteroidsController;
  let asteroidsService: AsteroidsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsteroidsController],
      providers: [
        {
          provide: AsteroidsService,
          useValue: {
            getAsteroids: jest.fn().mockResolvedValue([]), // Mocking the service method
          },
        },
      ],
    }).compile();

    asteroidsController = module.get<AsteroidsController>(AsteroidsController);
    asteroidsService = module.get<AsteroidsService>(AsteroidsService);
  });

  it('should be defined', () => {
    expect(asteroidsController).toBeDefined();
  });

  describe('getAsteroids', () => {
    it('should return an array of asteroids', async () => {
      const result = [];
      jest.spyOn(asteroidsService, 'getAsteroids').mockResolvedValue(result);

      expect(
        await asteroidsController.getAsteroids('2015-09-07', '2015-09-08'),
      ).toBe(result);
    });

    it('should call getAsteroids with the correct parameters', async () => {
      const startDate = '2015-09-07';
      const endDate = '2015-09-08';

      const spy = jest.spyOn(asteroidsService, 'getAsteroids');
      await asteroidsController.getAsteroids(startDate, endDate);

      expect(spy).toHaveBeenCalledWith(startDate, endDate);
    });
  });
});
