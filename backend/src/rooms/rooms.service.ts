import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Room } from './entities/room.entity';
import { Reservation } from '../reservations/entities/reservation.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
  ) {}

  findAll(): Promise<Room[]> {
    return this.roomRepo.find();
  }

  findById(id: string): Promise<Room | null> {
    return this.roomRepo.findOne({ where: { id } });
  }

  async checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<boolean> {
    const room = await this.findById(roomId);
    if (!room) return false;

    // A reservation overlaps when: existing.checkIn < requested.checkOut AND existing.checkOut > requested.checkIn
    const overlapping = await this.reservationRepo
      .createQueryBuilder('r')
      .where('r.roomId = :roomId', { roomId })
      .andWhere('r.status != :cancelled', { cancelled: 'cancelled' })
      .andWhere('r.checkIn < :checkOut', { checkOut })
      .andWhere('r.checkOut > :checkIn', { checkIn })
      .getCount();

    return overlapping === 0;
  }
}
