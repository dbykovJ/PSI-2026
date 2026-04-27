import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(dto: CreateReservationDto): Promise<import("./entities/reservation.entity").Reservation>;
    calculatePrice(roomId: string, checkIn: string, checkOut: string, serviceIds: string): Promise<{
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities/reservation.entity").Reservation>;
}
