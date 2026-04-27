"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const room_entity_1 = require("./rooms/entities/room.entity");
const hotel_service_entity_1 = require("./services/entities/hotel-service.entity");
const reservation_entity_1 = require("./reservations/entities/reservation.entity");
const rooms_module_1 = require("./rooms/rooms.module");
const services_module_1 = require("./services/services.module");
const reservations_module_1 = require("./reservations/reservations.module");
const payments_module_1 = require("./payments/payments.module");
const database_module_1 = require("./database/database.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 5432),
                    username: config.get('DB_USERNAME', 'postgres'),
                    password: config.get('DB_PASSWORD', 'postgres'),
                    database: config.get('DB_NAME', 'hotel_reservation'),
                    entities: [room_entity_1.Room, hotel_service_entity_1.HotelServiceEntity, reservation_entity_1.Reservation],
                    synchronize: true,
                    logging: false,
                }),
            }),
            database_module_1.DatabaseModule,
            rooms_module_1.RoomsModule,
            services_module_1.ServicesModule,
            reservations_module_1.ReservationsModule,
            payments_module_1.PaymentsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map