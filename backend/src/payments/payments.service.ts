import { Injectable, BadRequestException } from '@nestjs/common';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class PaymentsService {
  constructor(private readonly reservationsService: ReservationsService) {}

  async processPayment(dto: ProcessPaymentDto): Promise<{ success: boolean; transactionId?: string; message: string }> {
    const reservation = await this.reservationsService.findById(dto.reservationId);
    if (!reservation) throw new BadRequestException('Reservation not found');

    const cleaned = dto.cardNumber.replace(/\s/g, '');
    if (cleaned.endsWith('0000')) {
      return { success: false, message: 'Payment declined. Please check your card details.' };
    }

    const transactionId = `TXN-${Date.now()}`;
    await this.reservationsService.confirm(dto.reservationId);
    return { success: true, transactionId, message: 'Payment processed successfully.' };
  }
}
