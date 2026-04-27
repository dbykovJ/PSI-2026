import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../rooms/entities/room.entity';
import { HotelServiceEntity } from '../services/entities/hotel-service.entity';

const ROOMS: Partial<Room>[] = [
  { id: 'standard', type: 'standard', name: 'Standard Room', description: 'Comfortable room with all essential amenities for a pleasant stay.', pricePerNight: 89, capacity: 2, amenities: ['Wi-Fi', 'TV', 'Air conditioning', 'Private bathroom'], imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600' },
  { id: 'deluxe', type: 'deluxe', name: 'Deluxe Room', description: 'Spacious room with premium furnishings and a beautiful city view.', pricePerNight: 149, capacity: 2, amenities: ['Wi-Fi', 'Smart TV', 'Air conditioning', 'Mini-bar', 'City view', 'Bathtub'], imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600' },
  { id: 'suite', type: 'suite', name: 'Junior Suite', description: 'Luxurious suite with a separate living area and panoramic views.', pricePerNight: 249, capacity: 3, amenities: ['Wi-Fi', 'Smart TV', 'Air conditioning', 'Mini-bar', 'Panoramic view', 'Jacuzzi', 'Lounge area'], imageUrl: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600' },
  { id: 'presidential', type: 'presidential', name: 'Presidential Suite', description: 'The pinnacle of luxury with exclusive service and breathtaking views.', pricePerNight: 499, capacity: 4, amenities: ['Wi-Fi', '4K Smart TV', 'Climate control', 'Full bar', 'Terrace', 'Private pool', 'Butler service', 'Dining area'], imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600' },
];

const SERVICES: Partial<HotelServiceEntity>[] = [
  { id: 'spa', name: 'Spa & Wellness', description: 'Full day access to spa, sauna, and pool.', price: 45, icon: 'spa', available: true },
  { id: 'breakfast', name: 'Breakfast Buffet', description: 'Daily breakfast buffet per person.', price: 18, icon: 'restaurant', available: true },
  { id: 'parking', name: 'Secure Parking', description: 'Covered parking spot for the duration of your stay.', price: 15, icon: 'local_parking', available: true },
  { id: 'airport', name: 'Airport Transfer', description: 'Private transfer to/from the airport.', price: 65, icon: 'flight', available: true },
  { id: 'gym', name: 'Fitness Center', description: 'Unlimited access to the hotel gym.', price: 10, icon: 'fitness_center', available: true },
  { id: 'laundry', name: 'Laundry Service', description: 'Same-day laundry and dry-cleaning service.', price: 25, icon: 'local_laundry_service', available: true },
  { id: 'room_service', name: 'Room Service', description: '24/7 in-room dining service.', price: 20, icon: 'room_service', available: true },
  { id: 'pets', name: 'Pet-Friendly Room', description: 'Pet accommodation and care package.', price: 30, icon: 'pets', available: false },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Room) private readonly roomRepo: Repository<Room>,
    @InjectRepository(HotelServiceEntity) private readonly serviceRepo: Repository<HotelServiceEntity>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRooms();
    await this.seedServices();
  }

  private async seedRooms() {
    for (const room of ROOMS) {
      const exists = await this.roomRepo.findOne({ where: { id: room.id } });
      if (!exists) {
        await this.roomRepo.save(this.roomRepo.create(room));
      }
    }
    this.logger.log('Rooms seeded');
  }

  private async seedServices() {
    for (const service of SERVICES) {
      const exists = await this.serviceRepo.findOne({ where: { id: service.id } });
      if (!exists) {
        await this.serviceRepo.save(this.serviceRepo.create(service));
      }
    }
    this.logger.log('Services seeded');
  }
}
