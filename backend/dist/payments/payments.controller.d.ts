import { PaymentsService } from './payments.service';
import { ProcessPaymentDto } from './dto/process-payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    process(dto: ProcessPaymentDto): Promise<{
        success: boolean;
        transactionId?: string;
        message: string;
    }>;
}
