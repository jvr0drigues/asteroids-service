import { Test, TestingModule } from '@nestjs/testing';
import { AsteroidsController } from './asteroids.controller';

describe('AsteroidsController', () => {
  let controller: AsteroidsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsteroidsController],
    }).compile();

    controller = module.get<AsteroidsController>(AsteroidsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
