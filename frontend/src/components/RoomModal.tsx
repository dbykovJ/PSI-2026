import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Room } from '../types';

interface Props {
  room: Room;
  onClose: () => void;
}

export default function RoomModal({ room, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <img
            src={room.imageUrl}
            alt={room.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white rounded-full w-9 h-9 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <span className="material-icons text-lg">close</span>
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-hotel-accent text-white text-xs font-bold px-3 py-1 rounded-full">
              {room.type}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h2 className="font-serif text-2xl font-bold text-hotel-dark">{room.name}</h2>
            <div className="text-right ml-4 shrink-0">
              <span className="text-2xl font-bold text-hotel-accent">${room.pricePerNight}</span>
              <span className="text-gray-400 text-sm block">per night</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
              <span className="material-icons text-base text-hotel-accent">people</span>
              Up to {room.capacity} guests
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
              <span className="material-icons text-base text-hotel-accent">king_bed</span>
              {room.type}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-5">{room.description}</p>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="font-semibold text-hotel-dark mb-3 flex items-center gap-2">
              <span className="material-icons text-base text-hotel-accent">checklist</span>
              Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 bg-gold-50 border border-gold-200 text-hotel-dark text-sm px-3 py-1 rounded-full"
                >
                  <span className="material-icons text-xs text-hotel-accent">check_circle</span>
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              to="/reserve"
              className="flex-1 text-center bg-hotel-accent hover:bg-gold-500 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-icons text-base">hotel</span>
              Book Now
            </Link>
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
