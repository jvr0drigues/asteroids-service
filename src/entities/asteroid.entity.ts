import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Asteroid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  neo_reference_id: string;

  @Column()
  name: string;

  @Column()
  nasa_jpl_url: string;

  @Column('decimal', { precision: 5, scale: 2 })
  absolute_magnitude_h: number;

  @Column({ type: 'date', nullable: true })
  closeApproachDate: string;

  @Column('jsonb')
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    miles: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
    feet: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };

  @Column()
  is_potentially_hazardous_asteroid: boolean;

  @Column('jsonb', { nullable: true })
  close_approach_data: {
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }[];

  @Column()
  is_sentry_object: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
