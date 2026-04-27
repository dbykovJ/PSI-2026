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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
const rooms_service_1 = require("../rooms/rooms.service");
const services_service_1 = require("../services/services.service");
let ReservationsService = class ReservationsService {
    constructor(reservationRepo, roomsService, servicesService) {
        this.reservationRepo = reservationRepo;
        this.roomsService = roomsService;
        this.servicesService = servicesService;
    }
    async create(dto) {
        const room = await this.roomsService.findById(dto.roomId);
        if (!room)
            throw new common_1.BadRequestException('Room not found');
        const available = await this.roomsService.checkAvailability(dto.roomId, dto.checkIn, dto.checkOut);
        if (!available)
            throw new common_1.BadRequestException('Room not available for selected dates');
        const nights = this.calcNights(dto.checkIn, dto.checkOut);
        if (nights <= 0)
            throw new common_1.BadRequestException('Check-out must be after check-in');
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
    findById(id) {
        return this.reservationRepo.findOne({ where: { id } });
    }
    async confirm(id) {
        const reservation = await this.findById(id);
        if (!reservation)
            throw new common_1.BadRequestException('Reservation not found');
        reservation.status = 'confirmed';
        return this.reservationRepo.save(reservation);
    }
    async cancel(id) {
        const reservation = await this.findById(id);
        if (!reservation)
            throw new common_1.BadRequestException('Reservation not found');
        reservation.status = 'cancelled';
        return this.reservationRepo.save(reservation);
    }
    async calculatePrice(roomId, checkIn, checkOut, serviceIds) {
        const room = await this.roomsService.findById(roomId);
        if (!room)
            throw new common_1.BadRequestException('Room not found');
        const nights = this.calcNights(checkIn, checkOut);
        const services = await this.servicesService.findByIds(serviceIds);
        const servicesTotal = services.reduce((sum, s) => sum + Number(s.price) * nights, 0);
        return Number(room.pricePerNight) * nights + servicesTotal;
    }
    calcNights(checkIn, checkOut) {
        return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        rooms_service_1.RoomsService,
        services_service_1.HotelServicesService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map