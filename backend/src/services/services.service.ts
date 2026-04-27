import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { HotelServiceEntity } from './entities/hotel-service.entity';

@Injectable()
export class HotelServicesService {
  constructor(
    @InjectRepository(HotelServiceEntity)
    private readonly serviceRepo: Repository<HotelServiceEntity>,
  ) {}

  findAll(): Promise<HotelServiceEntity[]> {
    return this.serviceRepo.find();
  }

  findByIds(ids: string[]): Promise<HotelServiceEntity[]> {
    if (!ids.length) return Promise.resolve([]);
    return this.serviceRepo.find({ where: { id: In(ids) } });
  }

  async checkAvailability(serviceIds: string[]): Promise<{ id: string; available: boolean }[]> {
    const services = await this.serviceRepo.find({ where: { id: In(serviceIds) } });
    return serviceIds.map((id) => {
      const svc = services.find((s) => s.id === id);
      return { id, available: svc ? svc.available : false };
    });
  }
}
