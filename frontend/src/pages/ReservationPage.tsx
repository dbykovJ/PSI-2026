import { useState } from 'react';
import type { ReservationFormData, ReservationStep, Reservation, PaymentResult } from '../types';
import StepIndicator from '../components/StepIndicator';
import DateRoomStep from '../components/steps/DateRoomStep';
import ServicesStep from '../components/steps/ServicesStep';
import SummaryStep from '../components/steps/SummaryStep';
import PaymentStep from '../components/steps/PaymentStep';
import ConfirmationStep from '../components/steps/ConfirmationStep';

const INITIAL_FORM: ReservationFormData = {
  checkIn: null,
  checkOut: null,
  roomId: '',
  serviceIds: [],
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
};

export default function ReservationPage() {
  const [step, setStep] = useState<ReservationStep>('dates');
  const [form, setForm] = useState<ReservationFormData>(INITIAL_FORM);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);

  function updateForm(partial: Partial<ReservationFormData>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-hotel-dark">Make a Reservation</h1>
          <p className="text-gray-500 mt-2 text-sm">Complete the steps below to book your stay at Grand Luxe Hotel.</p>
        </div>

        <StepIndicator current={step} />

        <div className="card p-6 sm:p-8">
          {step === 'dates' && (
            <DateRoomStep
              data={form}
              onChange={updateForm}
              onNext={() => setStep('services')}
            />
          )}
          {step === 'services' && (
            <ServicesStep
              data={form}
              onChange={updateForm}
              onNext={() => setStep('summary')}
              onBack={() => setStep('dates')}
            />
          )}
          {step === 'summary' && (
            <SummaryStep
              data={form}
              onChange={updateForm}
              onNext={(r) => { setReservation(r); setStep('payment'); }}
              onBack={() => setStep('services')}
              onGoToDates={() => setStep('dates')}
            />
          )}
          {step === 'payment' && reservation && (
            <PaymentStep
              data={form}
              reservation={reservation}
              onChange={updateForm}
              onSuccess={(result) => { setPaymentResult(result); setStep('confirmation'); }}
              onBack={() => setStep('summary')}
            />
          )}
          {step === 'confirmation' && reservation && paymentResult && (
            <ConfirmationStep reservation={reservation} payment={paymentResult} />
          )}
        </div>
      </div>
    </div>
  );
}
