import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../rooms/entities/room.entity';
import { HotelServiceEntity } from '../services/entities/hotel-service.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, HotelServiceEntity])],
  providers: [SeedService],
})
export class DatabaseModule {}
