import { useState } from 'react';
import { paymentsApi } from '../../api/reservationApi';
import type { Reservation, ReservationFormData, PaymentResult } from '../../types';

interface Props {
  data: ReservationFormData;
  reservation: Reservation;
  onChange: (data: Partial<ReservationFormData>) => void;
  onSuccess: (result: PaymentResult) => void;
  onBack: () => void;
}

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

export default function PaymentStep({ data, reservation, onChange, onSuccess, onBack }: Props) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    const cleanCard = data.cardNumber.replace(/\s/g, '');
    if (cleanCard.length !== 16) e.cardNumber = 'Enter a valid 16-digit card number';
    if (!data.cardHolder.trim()) e.cardHolder = 'Cardholder name is required';
    const [mm, yy] = data.expiryDate.split('/');
    if (!mm || !yy || +mm > 12 || +mm < 1 || yy.length !== 2) e.expiryDate = 'Enter a valid expiry date (MM/YY)';
    if (data.cvv.length < 3) e.cvv = 'CVV must be 3-4 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handlePay() {
    if (!validate()) return;
    setProcessing(true);
    setError('');
    try {
      const result = await paymentsApi.process({
        reservationId: reservation.id,
        cardNumber: data.cardNumber.replace(/\s/g, ''),
        cardHolder: data.cardHolder,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
      });
      if (result.success) {
        onSuccess(result);
      } else {
        setError(result.message);
      }
    } catch {
      setError('An error occurred while processing payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  const cardBrand = data.cardNumber.startsWith('4') ? 'VISA' : data.cardNumber.startsWith('5') ? 'MC' : null;

  return (
    <div className="animate-slide-up max-w-lg mx-auto">
      <h2 className="font-serif text-2xl font-bold text-hotel-dark mb-2">Secure Payment</h2>
      <p className="text-gray-500 text-sm mb-6 flex items-center gap-1.5">
        <span className="material-icons text-green-500 text-sm">lock</span>
        Your payment information is encrypted and secure.
      </p>

      {/* Amount */}
      <div className="bg-hotel-navy text-white rounded-xl p-5 mb-6">
        <div className="text-sm text-white/60 mb-1">Total amount due</div>
        <div className="text-3xl font-bold text-gold-300">${reservation.totalPrice}</div>
        <div className="text-xs text-white/50 mt-1">Reservation #{reservation.id.slice(0, 8).toUpperCase()}</div>
      </div>

      {/* Card form */}
      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <div className="relative">
            <input
              type="text"
              value={data.cardNumber}
              onChange={(e) => onChange({ cardNumber: formatCardNumber(e.target.value) })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`input-field pr-16 ${errors.cardNumber ? 'border-red-400' : ''}`}
            />
            {cardBrand && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {cardBrand}
              </span>
            )}
          </div>
          {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
          <input
            type="text"
            value={data.cardHolder}
            onChange={(e) => onChange({ cardHolder: e.target.value.toUpperCase() })}
            placeholder="JOHN DOE"
            className={`input-field ${errors.cardHolder ? 'border-red-400' : ''}`}
          />
          {errors.cardHolder && <p className="text-xs text-red-500 mt-1">{errors.cardHolder}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="text"
              value={data.expiryDate}
              onChange={(e) => onChange({ expiryDate: formatExpiry(e.target.value) })}
              placeholder="MM/YY"
              maxLength={5}
              className={`input-field ${errors.expiryDate ? 'border-red-400' : ''}`}
            />
            {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              type="password"
              value={data.cvv}
              onChange={(e) => onChange({ cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              placeholder="***"
              maxLength={4}
              className={`input-field ${errors.cvv ? 'border-red-400' : ''}`}
            />
            {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
          </div>
        </div>

        <p className="text-xs text-gray-400">
          To simulate a declined payment, use a card number ending in 0000.
        </p>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
          <span className="material-icons text-red-500 text-sm mt-0.5">error</span>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <span className="material-icons text-sm">arrow_back</span>
          Back
        </button>
        <button onClick={handlePay} disabled={processing} className="btn-primary flex items-center gap-2 px-8">
          {processing ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-icons text-sm">lock</span>
          )}
          {processing ? 'Processing...' : `Pay $${reservation.totalPrice}`}
        </button>
      </div>
    </div>
  );
}
