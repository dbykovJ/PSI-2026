import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { HotelServicesService } from './services.service';
import { HotelServiceEntity } from './entities/hotel-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HotelServiceEntity])],
  controllers: [ServicesController],
  providers: [HotelServicesService],
  exports: [HotelServicesService],
})
export class ServicesModule {}
