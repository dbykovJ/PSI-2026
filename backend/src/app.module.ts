import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './rooms/entities/room.entity';
import { HotelServiceEntity } from './services/entities/hotel-service.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { RoomsModule } from './rooms/rooms.module';
import { ServicesModule } from './services/services.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PaymentsModule } from './payments/payments.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'postgres'),
        password: config.get('DB_PASSWORD', 'postgres'),
        database: config.get('DB_NAME', 'hotel_reservation'),
        entities: [Room, HotelServiceEntity, Reservation],
        synchronize: true,
        logging: false,
      }),
    }),
    DatabaseModule,
    RoomsModule,
    ServicesModule,
    ReservationsModule,
    PaymentsModule,
  ],
})
export class AppModule {}
