import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import type { Reservation, PaymentResult } from '../../types';

interface Props {
  reservation: Reservation;
  payment: PaymentResult;
}

export default function ConfirmationStep({ reservation, payment }: Props) {
  return (
    <div className="animate-fade-in text-center max-w-lg mx-auto py-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="material-icons text-green-500 text-4xl">check_circle</span>
      </div>

      <h2 className="font-serif text-3xl font-bold text-hotel-dark mb-2">Booking Confirmed!</h2>
      <p className="text-gray-500 mb-8">
        Your reservation has been confirmed. A confirmation email will be sent to{' '}
        <span className="font-medium text-hotel-dark">{reservation.guestEmail}</span>.
      </p>

      <div className="card p-6 text-left mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-hotel-dark">Reservation Details</h3>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Confirmed</span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-mono font-semibold text-hotel-dark">#{reservation.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Transaction ID</span>
            <span className="font-mono text-xs text-gray-600">{payment.transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Guest</span>
            <span className="font-medium">{reservation.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check-in</span>
            <span className="font-medium">{format(new Date(reservation.checkIn), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check-out</span>
            <span className="font-medium">{format(new Date(reservation.checkOut), 'dd MMM yyyy')}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100 font-bold text-hotel-dark">
            <span>Total Paid</span>
            <span className="text-hotel-accent text-lg">${reservation.totalPrice}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-sm text-blue-700 flex items-start gap-2">
        <span className="material-icons text-blue-500 text-sm mt-0.5">info</span>
        <span>Check-in is available from 14:00. Please present this confirmation at the front desk.</span>
      </div>

      <Link to="/" className="btn-primary inline-flex items-center gap-2">
        <span className="material-icons text-sm">home</span>
        Back to Home
      </Link>
    </div>
  );
}
