import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import { RoomsService } from '../rooms/rooms.service';
import { HotelServicesService } from '../services/services.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    private readonly roomsService: RoomsService,
    private readonly servicesService: HotelServicesService,
  ) {}

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const room = await this.roomsService.findById(dto.roomId);
    if (!room) throw new BadRequestException('Room not found');

    const available = await this.roomsService.checkAvailability(dto.roomId, dto.checkIn, dto.checkOut);
    if (!available) throw new BadRequestException('Room not available for selected dates');

    const nights = this.calcNights(dto.checkIn, dto.checkOut);
    if (nights <= 0) throw new BadRequestException('Check-out must be after check-in');

    const services = await this.servicesService.findByIds(dto.serviceIds);
    const servicesTotal = services.reduce((sum, s) => sum + Number(s.price) * nights, 0);
    const totalPrice = Number(room.pricePerNight) * nights + servicesTotal;

    const reservation = this.reservationRepo.create({
      roomId: dto.roomId,
      checkIn: dto.checkIn,
      checkOut: dto.checkOut,
      serviceIds: dto.serviceIds,
      guestName: dto.guestName,
      guestEmail: dto.guestEmail,
      guestPhone: dto.guestPhone,
      totalPrice,
      status: 'pending',
    });

    return this.reservationRepo.save(reservation);
  }

  findById(id: string): Promise<Reservation | null> {
    return this.reservationRepo.findOne({ where: { id } });
  }

  async confirm(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);
    if (!reservation) throw new BadRequestException('Reservation not found');
    reservation.status = 'confirmed';
    return this.reservationRepo.save(reservation);
  }

  async cancel(id: string): Promise<Reservation> {
    const reservation = await this.findById(id);
    if (!reservation) throw new BadRequestException('Reservation not found');
    reservation.status = 'cancelled';
    return this.reservationRepo.save(reservation);
  }

  async calculatePrice(roomId: string, checkIn: string, checkOut: string, serviceIds: string[]): Promise<number> {
    const room = await this.roomsService.findById(roomId);
    if (!room) throw new BadRequestException('Room not found');
    const nights = this.calcNights(checkIn, checkOut);
    const services = await this.servicesService.findByIds(serviceIds);
    const servicesTotal = services.reduce((sum, s) => sum + Number(s.price) * nights, 0);
    return Number(room.pricePerNight) * nights + servicesTotal;
  }

  private calcNights(checkIn: string, checkOut: string): number {
    return Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24),
    );
  }
}
