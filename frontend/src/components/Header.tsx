import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={`${isHome ? 'absolute top-0 left-0 right-0 z-50' : 'bg-hotel-navy shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-hotel-accent rounded-full flex items-center justify-center">
              <span className="material-icons text-white text-xl">hotel</span>
            </div>
            <div>
              <p className="font-serif text-xl font-bold text-white leading-none">Grand Luxe</p>
              <p className="text-xs text-gold-300 tracking-widest uppercase">Hotel & Spa</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Rooms', 'Services', 'About', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-sm font-medium text-white/80 hover:text-gold-300 transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <Link
            to="/reserve"
            className="bg-hotel-accent hover:bg-gold-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
