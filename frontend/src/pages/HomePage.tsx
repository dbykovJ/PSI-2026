import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { roomsApi } from '../api/reservationApi';
import type { Room } from '../types';

const FEATURES = [
  { icon: 'spa', title: 'Luxury Spa', desc: 'Rejuvenate with our world-class treatments and wellness programs.' },
  { icon: 'restaurant', title: 'Fine Dining', desc: 'Savor exquisite cuisine crafted by our award-winning chefs.' },
  { icon: 'pool', title: 'Infinity Pool', desc: 'Swim with breathtaking panoramic views of the city skyline.' },
  { icon: 'fitness_center', title: 'Fitness Center', desc: 'State-of-the-art equipment and personal training sessions.' },
];

const TESTIMONIALS = [
  { name: 'Maria K.', rating: 5, text: 'Absolutely breathtaking experience. Every detail was perfect and the staff was incredibly attentive.' },
  { name: 'James T.', rating: 5, text: 'The Presidential Suite exceeded all our expectations. We will definitely be back!' },
  { name: 'Sophie L.', rating: 5, text: 'From the spa to the restaurant, everything was flawless. A true luxury escape.' },
];

export default function HomePage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    roomsApi.getAll().then(setRooms).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://www.slovakia.com/wp-content/uploads/bigstock-Poprad-with-Vysoke-Tatry-High-16125689-1350x900.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-hotel-dark/70 via-hotel-dark/50 to-hotel-dark/80" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 animate-fade-in">
          <p className="text-gold-300 text-sm font-medium tracking-widest uppercase mb-4">Welcome to</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Grand Poprad Hotel
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Where every moment becomes an unforgettable memory. Experience the pinnacle of luxury in the heart of the Tatra Mountains.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reserve"
              className="bg-hotel-accent hover:bg-gold-500 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-200 shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
            >
              <span className="material-icons">hotel</span>
              Book Your Stay
            </Link>
            <a
              href="#rooms"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-lg text-base font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              <span className="material-icons">explore</span>
              Explore Rooms
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-hotel-dark/80 backdrop-blur-sm border-t border-white/10">
          <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-3 gap-4 text-center">
            {[['200+', 'Luxury Rooms'], ['15+', 'Years of Excellence'], ['98%', 'Guest Satisfaction']].map(([val, label]) => (
              <div key={label}>
                <div className="text-gold-300 text-xl sm:text-2xl font-bold">{val}</div>
                <div className="text-white/60 text-xs sm:text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-hotel-accent text-sm font-medium tracking-widest uppercase mb-2">Why Choose Us</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-hotel-dark">World-Class Amenities</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="group text-center p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-gold-200 transition-all duration-300">
                <div className="w-14 h-14 bg-gold-50 group-hover:bg-hotel-accent rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300">
                  <span className="material-icons text-hotel-accent group-hover:text-white transition-colors duration-300">{f.icon}</span>
                </div>
                <h3 className="font-semibold text-hotel-dark mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-hotel-accent text-sm font-medium tracking-widest uppercase mb-2">Accommodations</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-hotel-dark">Our Rooms & Suites</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <div key={room.id} className="card overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={room.imageUrl}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600'; }}
                  />
                  <div className="absolute top-3 right-3 bg-hotel-accent text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    ${room.pricePerNight}/night
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-hotel-dark mb-1">{room.name}</h3>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{room.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.amenities.slice(0, 3).map((a) => (
                      <span key={a} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                  <Link
                    to="/reserve"
                    className="block text-center bg-hotel-dark hover:bg-hotel-navy text-white text-sm font-medium py-2 rounded-lg transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-hotel-navy">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-gold-300 text-sm font-medium tracking-widest uppercase mb-2">Guest Reviews</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">What Our Guests Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="material-icons text-gold-300 text-sm">star</span>
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-hotel-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {t.name[0]}
                  </div>
                  <span className="text-white font-medium text-sm">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-hotel-accent">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready for an Unforgettable Stay?
          </h2>
          <p className="text-white/80 mb-8">Book directly for the best rates and exclusive benefits.</p>
          <Link
            to="/reserve"
            className="inline-flex items-center gap-2 bg-white text-hotel-accent hover:bg-gray-50 px-8 py-4 rounded-lg text-base font-bold transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            <span className="material-icons">hotel</span>
            Reserve Now
          </Link>
        </div>
      </section>
    </div>
  );
}
