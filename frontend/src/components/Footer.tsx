export default function Footer() {
  return (
    <footer className="bg-hotel-dark text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-hotel-accent rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-sm">hotel</span>
              </div>
              <span className="font-serif text-lg font-bold">Grand Poprad Hotel</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience unparalleled luxury in the heart of the city. Every stay is a masterpiece.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gold-300 mb-3 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><span className="material-icons text-sm">location_on</span> 1 Royal Avenue, Bratislava</li>
              <li className="flex items-center gap-2"><span className="material-icons text-sm">phone</span> +421 900 000 000</li>
              <li className="flex items-center gap-2"><span className="material-icons text-sm">email</span> info@grandpoprad.sk</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gold-300 mb-3 uppercase text-xs tracking-widest">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {['Rooms & Suites', 'Spa & Wellness', 'Dining', 'Events', 'Privacy Policy'].map((l) => (
                <li key={l}><a href="#" className="hover:text-gold-300 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Grand Poprad Hotel. All rights reserved. Created by PeakReserve.
        </div>
      </div>
    </footer>
  );
}
