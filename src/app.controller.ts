import { Controller, Get, Query } from '@nestjs/common';
import { AsteroidsService } from './app.service';

@Controller('asteroids')
export class AsteroidsController {
  constructor(private readonly asteroidsService: AsteroidsService) {}

  @Get()
  async getAsteroids(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const asteroids = await this.asteroidsService.getAsteroids(
      startDate,
      endDate,
    );
    return asteroids;
  }
}
