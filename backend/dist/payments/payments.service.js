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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const reservations_service_1 = require("../reservations/reservations.service");
let PaymentsService = class PaymentsService {
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    async processPayment(dto) {
        const reservation = await this.reservationsService.findById(dto.reservationId);
        if (!reservation)
            throw new common_1.BadRequestException('Reservation not found');
        const cleaned = dto.cardNumber.replace(/\s/g, '');
        if (cleaned.endsWith('0000')) {
            return { success: false, message: 'Payment declined. Please check your card details.' };
        }
        const transactionId = `TXN-${Date.now()}`;
        await this.reservationsService.confirm(dto.reservationId);
        return { success: true, transactionId, message: 'Payment processed successfully.' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map