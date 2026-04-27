import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }

  @Get('calculate-price')
  async calculatePrice(
    @Query('roomId') roomId: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
    @Query('serviceIds') serviceIds: string,
  ) {
    const ids = serviceIds ? serviceIds.split(',').filter(Boolean) : [];
    const total = await this.reservationsService.calculatePrice(roomId, checkIn, checkOut, ids);
    return { total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findById(id);
  }
}
