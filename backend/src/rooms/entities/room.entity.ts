import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryColumn()
  id: string;

  @Column()
  type: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  pricePerNight: number;

  @Column('int')
  capacity: number;

  @Column('simple-json')
  amenities: string[];

  @Column()
  imageUrl: string;
}
