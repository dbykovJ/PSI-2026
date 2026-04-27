import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ReservationsService } from '../reservations/reservations.service';
export declare class PaymentsService {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    processPayment(dto: ProcessPaymentDto): Promise<{
        success: boolean;
        transactionId?: string;
        message: string;
    }>;
}
