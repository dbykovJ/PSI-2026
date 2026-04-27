import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { roomsApi, servicesApi, reservationsApi } from '../../api/reservationApi';
import type { Room, HotelService, Reservation, ReservationFormData } from '../../types';

interface Props {
  data: ReservationFormData;
  onChange: (data: Partial<ReservationFormData>) => void;
  onNext: (reservation: Reservation) => void;
  onBack: () => void;
  onGoToDates: () => void;
}

export default function SummaryStep({ data, onChange, onNext, onBack, onGoToDates }: Props) {
  const [room, setRoom] = useState<Room | null>(null);
  const [services, setServices] = useState<HotelService[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<{ message: string; roomTaken: boolean } | null>(null);

  const nights =
    data.checkIn && data.checkOut
      ? Math.ceil((data.checkOut.getTime() - data.checkIn.getTime()) / 86400000)
      : 0;

  useEffect(() => {
    Promise.all([
      roomsApi.getAll(),
      servicesApi.getAll(),
    ]).then(([rooms, allServices]) => {
      setRoom(rooms.find((r) => r.id === data.roomId) || null);
      setServices(allServices.filter((s) => data.serviceIds.includes(s.id)));
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!data.roomId || !data.checkIn || !data.checkOut) return;
    reservationsApi
      .calculatePrice(
        data.roomId,
        format(data.checkIn, 'yyyy-MM-dd'),
        format(data.checkOut, 'yyyy-MM-dd'),
        data.serviceIds,
      )
      .then(setTotalPrice);
  }, [data.roomId, data.checkIn, data.checkOut, data.serviceIds]);

  function validate() {
    const e: Record<string, string> = {};
    if (!data.guestName.trim()) e.guestName = 'Name is required';
    if (!data.guestEmail.trim() || !/\S+@\S+\.\S+/.test(data.guestEmail)) e.guestEmail = 'Valid email is required';
    if (!data.guestPhone.trim()) e.guestPhone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleConfirm() {
    if (!validate() || !data.checkIn || !data.checkOut) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const reservation = await reservationsApi.create({
        roomId: data.roomId,
        checkIn: format(data.checkIn, 'yyyy-MM-dd'),
        checkOut: format(data.checkOut, 'yyyy-MM-dd'),
        serviceIds: data.serviceIds,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
      });
      onNext(reservation);
    } catch (err: any) {
      const msg: string = err?.response?.data?.message ?? 'Something went wrong. Please try again.';
      const roomTaken = msg.toLowerCase().includes('not available');
      setSubmitError({ message: roomTaken
        ? 'This room was just booked by someone else while you were filling in your details.'
        : msg,
        roomTaken,
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-hotel-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <h2 className="font-serif text-2xl font-bold text-hotel-dark mb-6">Reservation Summary</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Booking details */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="material-icons text-hotel-accent text-sm">calendar_today</span>
            Booking Details
          </h3>
          {room && (
            <div className="flex gap-3 mb-4">
              <img
                src={room.imageUrl}
                alt={room.name}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'; }}
              />
              <div>
                <div className="font-semibold text-hotel-dark">{room.name}</div>
                <div className="text-sm text-gray-500">${room.pricePerNight}/night</div>
                <div className="text-xs text-gray-400 mt-1">Capacity: {room.capacity} guests</div>
              </div>
            </div>
          )}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Check-in</span>
              <span className="font-medium">{data.checkIn ? format(data.checkIn, 'dd MMM yyyy') : '-'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Check-out</span>
              <span className="font-medium">{data.checkOut ? format(data.checkOut, 'dd MMM yyyy') : '-'}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Duration</span>
              <span className="font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
          </div>

          {services.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm font-medium text-gray-700 mb-2">Additional Services</div>
              <div className="space-y-1">
                {services.map((s) => (
                  <div key={s.id} className="flex justify-between text-sm text-gray-500">
                    <span>{s.name}</span>
                    <span>${s.price * nights}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between font-bold text-hotel-dark">
            <span>Total</span>
            <span className="text-hotel-accent text-lg">${totalPrice}</span>
          </div>
        </div>

        {/* Guest info */}
        <div className="card p-5">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span className="material-icons text-hotel-accent text-sm">person</span>
            Guest Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={data.guestName}
                onChange={(e) => onChange({ guestName: e.target.value })}
                placeholder="John Doe"
                className={`input-field ${errors.guestName ? 'border-red-400' : ''}`}
              />
              {errors.guestName && <p className="text-xs text-red-500 mt-1">{errors.guestName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={data.guestEmail}
                onChange={(e) => onChange({ guestEmail: e.target.value })}
                placeholder="john@example.com"
                className={`input-field ${errors.guestEmail ? 'border-red-400' : ''}`}
              />
              {errors.guestEmail && <p className="text-xs text-red-500 mt-1">{errors.guestEmail}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={data.guestPhone}
                onChange={(e) => onChange({ guestPhone: e.target.value })}
                placeholder="+421 900 000 000"
                className={`input-field ${errors.guestPhone ? 'border-red-400' : ''}`}
              />
              {errors.guestPhone && <p className="text-xs text-red-500 mt-1">{errors.guestPhone}</p>}
            </div>
          </div>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="material-icons text-red-500 mt-0.5">event_busy</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800 mb-1">
                {submitError.roomTaken ? 'Room no longer available' : 'Reservation failed'}
              </p>
              <p className="text-sm text-red-700 mb-3">{submitError.message}</p>
              {submitError.roomTaken && (
                <button
                  onClick={onGoToDates}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-700 underline underline-offset-2 hover:text-red-900"
                >
                  <span className="material-icons text-sm">calendar_today</span>
                  Choose different dates or another room
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <span className="material-icons text-sm">arrow_back</span>
          Back
        </button>
        <button onClick={handleConfirm} disabled={submitting || !!submitError?.roomTaken} className="btn-primary flex items-center gap-2">
          {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          Proceed to Payment
          <span className="material-icons text-sm">credit_card</span>
        </button>
      </div>
    </div>
  );
}
