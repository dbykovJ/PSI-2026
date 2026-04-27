import { useState, useEffect } from 'react';
import { servicesApi } from '../../api/reservationApi';
import type { HotelService, ReservationFormData } from '../../types';

interface Props {
  data: ReservationFormData;
  onChange: (data: Partial<ReservationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ServicesStep({ data, onChange, onNext, onBack }: Props) {
  const [services, setServices] = useState<HotelService[]>([]);
  const [loading, setLoading] = useState(true);

  const nights =
    data.checkIn && data.checkOut
      ? Math.ceil((data.checkOut.getTime() - data.checkIn.getTime()) / 86400000)
      : 1;

  useEffect(() => {
    servicesApi.getAll().then(setServices).finally(() => setLoading(false));
  }, []);

  function toggleService(id: string) {
    const selected = data.serviceIds.includes(id)
      ? data.serviceIds.filter((s) => s !== id)
      : [...data.serviceIds, id];
    onChange({ serviceIds: selected });
  }

  const servicesTotal = services
    .filter((s) => data.serviceIds.includes(s.id))
    .reduce((sum, s) => sum + s.price * nights, 0);

  return (
    <div className="animate-slide-up">
      <h2 className="font-serif text-2xl font-bold text-hotel-dark mb-2">Additional Services</h2>
      <p className="text-gray-500 text-sm mb-6">Enhance your stay with our premium services. All prices are per night.</p>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-hotel-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {services.map((service) => {
            const selected = data.serviceIds.includes(service.id);
            return (
              <button
                key={service.id}
                onClick={() => service.available && toggleService(service.id)}
                disabled={!service.available}
                className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  !service.available
                    ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                    : selected
                    ? 'border-hotel-accent bg-gold-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {!service.available && (
                  <span className="absolute top-2 right-2 bg-gray-200 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                    Unavailable
                  </span>
                )}
                {selected && service.available && (
                  <div className="absolute top-2 right-2 bg-hotel-accent text-white rounded-full p-0.5">
                    <span className="material-icons text-xs">check</span>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selected ? 'bg-hotel-accent text-white' : 'bg-gray-100 text-gray-500'}`}>
                    <span className="material-icons text-sm">{service.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-hotel-dark">{service.name}</div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{service.description}</p>
                    <div className="text-xs font-bold text-hotel-accent mt-1">${service.price}/night</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {data.serviceIds.length > 0 && (
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-6">
          <div className="text-sm font-medium text-hotel-dark mb-2">Selected services ({data.serviceIds.length})</div>
          <div className="space-y-1">
            {services.filter((s) => data.serviceIds.includes(s.id)).map((s) => (
              <div key={s.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{s.name}</span>
                <span className="font-medium">${s.price * nights}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-bold text-hotel-dark border-t border-gold-200 mt-2 pt-2">
            <span>Services subtotal</span>
            <span>${servicesTotal}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={onBack} className="btn-secondary flex items-center gap-2">
          <span className="material-icons text-sm">arrow_back</span>
          Back
        </button>
        <button onClick={onNext} className="btn-primary flex items-center gap-2">
          Review Summary
          <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
