import { RoomsService } from './rooms.service';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    findAll(): Promise<import("./entities/room.entity").Room[]>;
    findOne(id: string): Promise<import("./entities/room.entity").Room>;
    checkAvailability(id: string, checkIn: string, checkOut: string): Promise<{
        available: boolean;
    }>;
}
