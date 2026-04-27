import { Repository } from 'typeorm';
import { HotelServiceEntity } from './entities/hotel-service.entity';
export declare class HotelServicesService {
    private readonly serviceRepo;
    constructor(serviceRepo: Repository<HotelServiceEntity>);
    findAll(): Promise<HotelServiceEntity[]>;
    findByIds(ids: string[]): Promise<HotelServiceEntity[]>;
    checkAvailability(serviceIds: string[]): Promise<{
        id: string;
        available: boolean;
    }[]>;
}
