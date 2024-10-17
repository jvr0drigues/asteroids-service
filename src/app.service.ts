import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Asteroid } from './entities/asteroid.entity';

@Injectable()
export class AsteroidsService implements OnModuleInit {
  private readonly apiKey = 'DEMO_KEY';
  private readonly baseUrl = 'https://api.nasa.gov/neo/rest/v1/feed';
  private firstRun = true;
  private readonly logger = new Logger(AsteroidsService.name); // Logger for service

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Asteroid)
    private readonly asteroidRepository: Repository<Asteroid>,
  ) {}

  async findAllAsteroids() {
    return this.asteroidRepository.find(); // Fetches all asteroids from the database
  }

  async getAsteroids(startDate: string, endDate: string) {
    const url = `${this.baseUrl}?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  @Cron(CronExpression.EVERY_DAY_AT_11PM, {
    timeZone: 'UTC',
  })
  handleCron() {
    this.logger.log('Running checkForNewAsteroids...');
    this.checkForNewAsteroids();
  }

  async onModuleInit() {
    this.logger.log('Running checkForNewAsteroids on startup...');
    await this.checkForNewAsteroids();
  }

  private async checkForNewAsteroids() {
    let startDate: string;
    let endDate: string;

    if (this.firstRun) {
      startDate = this.getFormattedDate(this.subtractDays(new Date(), 7));
      endDate = this.getFormattedDate(new Date());
      this.firstRun = false;
    } else {
      startDate = this.getFormattedDate(this.subtractDays(new Date(), 1));
      endDate = this.getFormattedDate(new Date());
    }

    const apiUrl = `${this.baseUrl}?start_date=${startDate}&end_date=${endDate}&api_key=${this.apiKey}`;

    this.logger.log(`Fetching asteroids from ${startDate} to ${endDate}`);

    const response = await lastValueFrom(this.httpService.get(apiUrl));
    const asteroids = response.data.near_earth_objects;

    for (const date in asteroids) {
      for (const asteroid of asteroids[date]) {
        this.logger.log(`Adding asteroid: ${asteroid.name}!`);
        await this.asteroidRepository.save({
          name: asteroid.name,
          nasa_jpl_url: asteroid.nasa_jpl_url,
          estimated_diameter:
            asteroid.estimated_diameter.kilometers.estimated_diameter_max,
        });
      }
    }
  }

  private getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  private subtractDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }
}
