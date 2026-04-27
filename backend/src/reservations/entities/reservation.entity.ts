import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from '../../rooms/entities/room.entity';

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @ManyToOne(() => Room, { eager: true })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column('date')
  checkIn: string;

  @Column('date')
  checkOut: string;

  @Column('simple-json')
  serviceIds: string[];

  @Column()
  guestName: string;

  @Column()
  guestEmail: string;

  @Column()
  guestPhone: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ default: 'pending' })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;
}
