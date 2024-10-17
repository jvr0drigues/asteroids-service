import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Asteroid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nasa_jpl_url: string;

  @Column('float')
  estimated_diameter: number;
}
