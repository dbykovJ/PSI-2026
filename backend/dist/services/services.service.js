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
exports.HotelServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotel_service_entity_1 = require("./entities/hotel-service.entity");
let HotelServicesService = class HotelServicesService {
    constructor(serviceRepo) {
        this.serviceRepo = serviceRepo;
    }
    findAll() {
        return this.serviceRepo.find();
    }
    findByIds(ids) {
        if (!ids.length)
            return Promise.resolve([]);
        return this.serviceRepo.find({ where: { id: (0, typeorm_2.In)(ids) } });
    }
    async checkAvailability(serviceIds) {
        const services = await this.serviceRepo.find({ where: { id: (0, typeorm_2.In)(serviceIds) } });
        return serviceIds.map((id) => {
            const svc = services.find((s) => s.id === id);
            return { id, available: svc ? svc.available : false };
        });
    }
};
exports.HotelServicesService = HotelServicesService;
exports.HotelServicesService = HotelServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hotel_service_entity_1.HotelServiceEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HotelServicesService);
//# sourceMappingURL=services.service.js.map