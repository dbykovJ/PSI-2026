import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { roomsApi } from '../../api/reservationApi';
import type { Room, ReservationFormData } from '../../types';
import { format } from 'date-fns';

interface Props {
  data: ReservationFormData;
  onChange: (data: Partial<ReservationFormData>) => void;
  onNext: () => void;
}

export default function DateRoomStep({ data, onChange, onNext }: Props) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  // null = unknown, true = available, false = taken
  const [availability, setAvailability] = useState<Record<string, boolean | null>>({});
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [proceeding, setProceeding] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    roomsApi.getAll().then(setRooms).finally(() => setLoadingRooms(false));
  }, []);

  // Re-check all rooms whenever both dates are set
  useEffect(() => {
    if (!data.checkIn || !data.checkOut || !rooms.length) {
      setAvailability({});
      return;
    }

    // Cancel previous in-flight batch
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const checkIn = format(data.checkIn, 'yyyy-MM-dd');
    const checkOut = format(data.checkOut, 'yyyy-MM-dd');

    setCheckingAvailability(true);
    setAvailability({});

    // Kick off all checks in parallel; update state as each resolves
    rooms.forEach((room) => {
      roomsApi
        .checkAvailability(room.id, checkIn, checkOut)
        .then((available) => {
          if (controller.signal.aborted) return;
          setAvailability((prev) => ({ ...prev, [room.id]: available }));

          // If the currently selected room just became unavailable, deselect it
          if (!available && data.roomId === room.id) {
            onChange({ roomId: '' });
          }
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setAvailability((prev) => ({ ...prev, [room.id]: null }));
        });
    });

    // Mark loading finished once all settle (we don't need all results to stop the spinner)
    Promise.allSettled(
      rooms.map((r) => roomsApi.checkAvailability(r.id, checkIn, checkOut)),
    ).finally(() => {
      if (!controller.signal.aborted) setCheckingAvailability(false);
    });
  }, [data.checkIn, data.checkOut, rooms]);

  const nights =
    data.checkIn && data.checkOut
      ? Math.ceil((data.checkOut.getTime() - data.checkIn.getTime()) / 86400000)
      : 0;

  async function handleNext() {
    if (!data.checkIn || !data.checkOut || !data.roomId) return;
    setProceeding(true);
    try {
      // One final authoritative check before advancing
      const available = await roomsApi.checkAvailability(
        data.roomId,
        format(data.checkIn, 'yyyy-MM-dd'),
        format(data.checkOut, 'yyyy-MM-dd'),
      );
      if (!available) {
        setAvailability((prev) => ({ ...prev, [data.roomId]: false }));
        onChange({ roomId: '' });
        return;
      }
      onNext();
    } finally {
      setProceeding(false);
    }
  }

  const datesSelected = !!data.checkIn && !!data.checkOut;
  const isValid = datesSelected && !!data.roomId && nights > 0 && availability[data.roomId] !== false;
  const anyUnavailable = datesSelected && Object.values(availability).some((v) => v === false);

  return (
    <div className="animate-slide-up">
      <h2 className="font-serif text-2xl font-bold text-hotel-dark mb-6">Select Dates & Room</h2>

      {/* Date pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-in Date</label>
          <DatePicker
            selected={data.checkIn}
            onChange={(d) =>
              onChange({
                checkIn: d,
                checkOut: data.checkOut && d && data.checkOut <= d ? null : data.checkOut,
              })
            }
            minDate={new Date()}
            placeholderText="Select check-in date"
            dateFormat="dd MMM yyyy"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-out Date</label>
          <DatePicker
            selected={data.checkOut}
            onChange={(d) => onChange({ checkOut: d })}
            minDate={data.checkIn ? new Date(data.checkIn.getTime() + 86400000) : new Date()}
            placeholderText="Select check-out date"
            dateFormat="dd MMM yyyy"
            className="input-field"
            disabled={!data.checkIn}
          />
        </div>
      </div>

      {nights > 0 && (
        <p className="text-sm text-hotel-accent font-medium mb-4 flex items-center gap-1.5">
          <span className="material-icons text-sm">nights_stay</span>
          {nights} night{nights > 1 ? 's' : ''} selected
        </p>
      )}

      {/* Availability hint */}
      {datesSelected && anyUnavailable && !checkingAvailability && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4 flex items-center gap-2 text-sm text-amber-800">
          <span className="material-icons text-amber-500 text-sm">info</span>
          Some rooms are already booked for these dates and cannot be selected.
        </div>
      )}

      {/* Room grid */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">Choose Room Type</h3>
        {checkingAvailability && (
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-3 h-3 border-2 border-hotel-accent border-t-transparent rounded-full animate-spin inline-block" />
            Checking availability…
          </span>
        )}
      </div>

      {loadingRooms ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-hotel-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {rooms.map((room) => {
            const avail = availability[room.id]; // true | false | null | undefined
            const isTaken = avail === false;
            const isSelected = data.roomId === room.id;

            return (
              <button
                key={room.id}
                onClick={() => !isTaken && onChange({ roomId: room.id })}
                disabled={isTaken}
                className={`relative text-left rounded-xl border-2 overflow-hidden transition-all duration-200
                  ${isTaken
                    ? 'border-red-200 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'border-hotel-accent shadow-md hover:shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${isTaken ? '' : 'hover:scale-105'}`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600';
                    }}
                  />

                  {/* Taken overlay */}
                  {isTaken && (
                    <div className="absolute inset-0 bg-red-900/50 flex flex-col items-center justify-center gap-1">
                      <span className="material-icons text-white text-3xl">event_busy</span>
                      <span className="text-white text-xs font-semibold tracking-wide uppercase">
                        Not Available
                      </span>
                    </div>
                  )}

                  {/* Selected badge */}
                  {isSelected && !isTaken && (
                    <div className="absolute top-2 right-2 bg-hotel-accent text-white rounded-full p-1">
                      <span className="material-icons text-sm">check</span>
                    </div>
                  )}

                  {/* Available badge (only shown once dates are set and check completed) */}
                  {datesSelected && avail === true && !isSelected && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      Available
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className={`p-4 ${isTaken ? 'bg-gray-50' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-hotel-dark">{room.name}</span>
                    <span className={`font-bold text-sm ${isTaken ? 'text-gray-400' : 'text-hotel-accent'}`}>
                      ${room.pricePerNight}/night
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">{room.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <span className="material-icons text-xs">person</span>
                    <span>Up to {room.capacity} guests</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {room.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {a}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-xs text-gray-400">+{room.amenities.length - 3} more</span>
                    )}
                  </div>
                  {nights > 0 && !isTaken && (
                    <div className="mt-2 pt-2 border-t border-gray-100 text-sm font-semibold text-hotel-dark">
                      Total: ${room.pricePerNight * nights}
                    </div>
                  )}
                  {isTaken && (
                    <div className="mt-2 pt-2 border-t border-red-100 text-xs text-red-500 font-medium flex items-center gap-1">
                      <span className="material-icons text-xs">block</span>
                      Already booked for these dates
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!isValid || proceeding || checkingAvailability}
          className="btn-primary flex items-center gap-2"
        >
          {proceeding && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          Continue to Services
          <span className="material-icons text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
