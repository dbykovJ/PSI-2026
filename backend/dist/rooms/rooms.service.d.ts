import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
export declare class RoomsService {
    private readonly roomRepo;
    private readonly reservationRepo;
    constructor(roomRepo: Repository<Room>, reservationRepo: Repository<Reservation>);
    findAll(): Promise<Room[]>;
    findById(id: string): Promise<Room | null>;
    checkAvailability(roomId: string, checkIn: string, checkOut: string): Promise<boolean>;
}
