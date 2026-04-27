import { HotelServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: HotelServicesService);
    findAll(): Promise<import("./entities/hotel-service.entity").HotelServiceEntity[]>;
    checkAvailability(ids: string): Promise<{
        id: string;
        available: boolean;
    }[]>;
}
