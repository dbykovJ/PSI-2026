import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('hotel_services')
export class HotelServiceEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  icon: string;

  @Column({ default: true })
  available: boolean;
}
