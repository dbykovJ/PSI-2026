import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { RoomsService } from '../rooms/rooms.service';
import { HotelServicesService } from '../services/services.service';
export declare class ReservationsService {
    private readonly reservationRepo;
    private readonly roomsService;
    private readonly servicesService;
    constructor(reservationRepo: Repository<Reservation>, roomsService: RoomsService, servicesService: HotelServicesService);
    create(dto: CreateReservationDto): Promise<Reservation>;
    findById(id: string): Promise<Reservation | null>;
    confirm(id: string): Promise<Reservation>;
    cancel(id: string): Promise<Reservation>;
    calculatePrice(roomId: string, checkIn: string, checkOut: string, serviceIds: string[]): Promise<number>;
    private calcNights;
}
