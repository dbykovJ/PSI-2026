import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Room } from '../rooms/entities/room.entity';
import { HotelServiceEntity } from '../services/entities/hotel-service.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private readonly roomRepo;
    private readonly serviceRepo;
    private readonly logger;
    constructor(roomRepo: Repository<Room>, serviceRepo: Repository<HotelServiceEntity>);
    onApplicationBootstrap(): Promise<void>;
    private seedRooms;
    private seedServices;
}
