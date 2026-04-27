import { Controller, Get, Query } from '@nestjs/common';
import { HotelServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: HotelServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('availability')
  checkAvailability(@Query('ids') ids: string) {
    const idList = ids ? ids.split(',') : [];
    return this.servicesService.checkAvailability(idList);
  }
}
