import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsteroidsController } from './app.controller';
import { AsteroidsService } from './app.service';
import { Asteroid } from './entities/asteroid.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'asteroids',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Asteroid]),
  ],
  controllers: [AsteroidsController],
  providers: [AsteroidsService],
})
export class AppModule {}
