import { Room } from '../../rooms/entities/room.entity';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';
export declare class Reservation {
    id: string;
    roomId: string;
    room: Room;
    checkIn: string;
    checkOut: string;
    serviceIds: string[];
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    totalPrice: number;
    status: ReservationStatus;
    createdAt: Date;
}
