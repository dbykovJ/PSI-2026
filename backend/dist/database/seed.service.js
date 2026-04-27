"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const room_entity_1 = require("../rooms/entities/room.entity");
const hotel_service_entity_1 = require("../services/entities/hotel-service.entity");
const ROOMS = [
    { id: 'standard', type: 'standard', name: 'Standard Room', description: 'Comfortable room with all essential amenities for a pleasant stay.', pricePerNight: 89, capacity: 2, amenities: ['Wi-Fi', 'TV', 'Air conditioning', 'Private bathroom'], imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600' },
    { id: 'deluxe', type: 'deluxe', name: 'Deluxe Room', description: 'Spacious room with premium furnishings and a beautiful city view.', pricePerNight: 149, capacity: 2, amenities: ['Wi-Fi', 'Smart TV', 'Air conditioning', 'Mini-bar', 'City view', 'Bathtub'], imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600' },
    { id: 'suite', type: 'suite', name: 'Junior Suite', description: 'Luxurious suite with a separate living area and panoramic views.', pricePerNight: 249, capacity: 3, amenities: ['Wi-Fi', 'Smart TV', 'Air conditioning', 'Mini-bar', 'Panoramic view', 'Jacuzzi', 'Lounge area'], imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600' },
    { id: 'presidential', type: 'presidential', name: 'Presidential Suite', description: 'The pinnacle of luxury with exclusive service and breathtaking views.', pricePerNight: 499, capacity: 4, amenities: ['Wi-Fi', '4K Smart TV', 'Climate control', 'Full bar', 'Terrace', 'Private pool', 'Butler service', 'Dining area'], imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600' },
];
const SERVICES = [
    { id: 'spa', name: 'Spa & Wellness', description: 'Full day access to spa, sauna, and pool.', price: 45, icon: 'spa', available: true },
    { id: 'breakfast', name: 'Breakfast Buffet', description: 'Daily breakfast buffet per person.', price: 18, icon: 'restaurant', available: true },
    { id: 'parking', name: 'Secure Parking', description: 'Covered parking spot for the duration of your stay.', price: 15, icon: 'local_parking', available: true },
    { id: 'airport', name: 'Airport Transfer', description: 'Private transfer to/from the airport.', price: 65, icon: 'flight', available: true },
    { id: 'gym', name: 'Fitness Center', description: 'Unlimited access to the hotel gym.', price: 10, icon: 'fitness_center', available: true },
    { id: 'laundry', name: 'Laundry Service', description: 'Same-day laundry and dry-cleaning service.', price: 25, icon: 'local_laundry_service', available: true },
    { id: 'room_service', name: 'Room Service', description: '24/7 in-room dining service.', price: 20, icon: 'room_service', available: true },
    { id: 'pets', name: 'Pet-Friendly Room', description: 'Pet accommodation and care package.', price: 30, icon: 'pets', available: false },
];
let SeedService = SeedService_1 = class SeedService {
    constructor(roomRepo, serviceRepo) {
        this.roomRepo = roomRepo;
        this.serviceRepo = serviceRepo;
        this.logger = new common_1.Logger(SeedService_1.name);
    }
    async onApplicationBootstrap() {
        await this.seedRooms();
        await this.seedServices();
    }
    async seedRooms() {
        for (const room of ROOMS) {
            const exists = await this.roomRepo.findOne({ where: { id: room.id } });
            if (!exists) {
                await this.roomRepo.save(this.roomRepo.create(room));
            }
        }
        this.logger.log('Rooms seeded');
    }
    async seedServices() {
        for (const service of SERVICES) {
            const exists = await this.serviceRepo.findOne({ where: { id: service.id } });
            if (!exists) {
                await this.serviceRepo.save(this.serviceRepo.create(service));
            }
        }
        this.logger.log('Services seeded');
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(1, (0, typeorm_1.InjectRepository)(hotel_service_entity_1.HotelServiceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map