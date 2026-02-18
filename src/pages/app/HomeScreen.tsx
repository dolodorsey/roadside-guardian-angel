import { LOGO } from "@/lib/assets";
import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Shield, UserCheck, ChevronRight, Phone } from 'lucide-react';

const GMAPS = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const services = [
  { type: 'tow',     label: 'Tow',        icon: '🚛', bg: 'bg-red-50',    ring: 'ring-red-200' },
  { type: 'jump',    label: 'Jump Start',  icon: '⚡',  bg: 'bg-amber-50',  ring: 'ring-amber-200' },
  { type: 'flat',    label: 'Flat Tire',   icon: '🔧', bg: 'bg-blue-50',   ring: 'ring-blue-200' },
  { type: 'lockout', label: 'Lockout',     icon: '🔑', bg: 'bg-purple-50', ring: 'ring-purple-200' },
  { type: 'fuel',    label: 'Fuel',        icon: '⛽',  bg: 'bg-green-50',  ring: 'ring-green-200' },
  { type: 'winch',   label: 'Winch Out',   icon: '🪝', bg: 'bg-orange-50', ring: 'ring-orange-200' },
];

interface Props {
  onRequestService: (t: string) => void;
  onOpenServices: () => void;
}

const HomeScreen: React.FC<Props> = ({ onRequestService, onOpenServices }) => {
  const { profile } = useAuth();
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('Finding your location...');
  const [safeMode, setSafeMode] = useState(false);
  const [femaleFirst, setFemaleFirst] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const l = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLoc(l);
        if (GMAPS) {
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${l.lat},${l.lng}&key=${GMAPS}`)
            .then(r => r.json())
            .then(d => { if (d.results?.[0]) setAddress(d.results[0].formatted_address.split(',').slice(0, 2).join(',')); })
            .catch(() => setAddress('Current Location'));
        } else setAddress('Current Location');
      },
      () => { setLoc({ lat: 33.749, lng: -84.388 }); setAddress('Atlanta, GA'); }
    );
  }, []);

  const firstName = profile?.full_name?.split(' ')[0] || '';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative h-[100dvh] bg-[#FFFBF5] flex flex-col overflow-hidden">
      {/* Top: Logo + Greeting + Location */}
      <div className="px-5 pt-safe bg-white/80 backdrop-blur-md border-b border-gray-100 relative z-20">
        <div className="py-3 flex items-center gap-3">
          <img src={LOGO} alt="S.O.S" className="w-11 h-11 object-contain" />
          <div className="flex-1">
            <h2 className="font-display text-[18px] font-bold text-gray-900">
              {greeting}{firstName ? `, ${firstName}` : ''} 👋
            </h2>
            <button className="flex items-center gap-1 mt-0.5 group">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[13px] text-gray-500 group-hover:text-red-500 transition-colors truncate max-w-[220px]">{address}</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative z-10">
        {GMAPS && loc ? (
          <APIProvider apiKey={GMAPS}>
            <Map defaultCenter={loc} defaultZoom={15} disableDefaultUI gestureHandling="greedy" className="w-full h-full">
              <Marker position={loc} />
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-red-50/30 to-red-50/10 flex items-center justify-center">
            <div className="text-center animate-fade-up">
              <div className="relative mx-auto w-20 h-20 mb-3">
                <div className="absolute inset-0 bg-red-200/30 rounded-full animate-sos-ring" />
                <img src={LOGO} alt="" className="w-20 h-20 object-contain relative z-10" />
              </div>
              <p className="text-gray-400 text-[14px]">Loading map...</p>
            </div>
          </div>
        )}
        {/* Safety toggles */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button onClick={() => setSafeMode(!safeMode)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-card transition-all ${safeMode ? 'bg-red-600 shadow-[0_4px_20px_rgba(220,38,38,0.3)]' : 'bg-white border border-gray-200'}`}>
            <Shield className={`w-5 h-5 ${safeMode ? 'text-white' : 'text-gray-400'}`} />
          </button>
          <button onClick={() => setFemaleFirst(!femaleFirst)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-card transition-all ${femaleFirst ? 'bg-pink-500 shadow-md' : 'bg-white border border-gray-200'}`}>
            <UserCheck className={`w-5 h-5 ${femaleFirst ? 'text-white' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="relative z-20 bg-white rounded-t-[28px] shadow-[0_-4px_30px_rgba(0,0,0,0.06)] border-t border-gray-100 -mt-6 pb-20">
        <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
        <div className="px-5 pb-3">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">What do you need?</p>
          <div className="grid grid-cols-3 gap-3">
            {services.map((svc, i) => (
              <button key={svc.type} onClick={() => onRequestService(svc.type)}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl ${svc.bg} ring-1 ${svc.ring} hover:shadow-card-hover active:scale-[0.96] transition-all animate-fade-up`}
                style={{ animationDelay: `${i * 60}ms` }}>
                <span className="text-[28px]">{svc.icon}</span>
                <span className="text-[13px] font-semibold text-gray-700">{svc.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 pt-2 pb-2">
          <button onClick={() => onRequestService('tow')}
            className="w-full h-[60px] bg-gradient-to-r from-red-600 to-red-700 text-white text-[17px] font-bold rounded-2xl shadow-[0_4px_24px_rgba(220,38,38,0.25)] hover:shadow-[0_4px_32px_rgba(220,38,38,0.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Call a Superhero
          </button>
          <button onClick={onOpenServices}
            className="w-full mt-2 py-3.5 text-red-600 text-[15px] font-semibold flex items-center justify-center gap-1 hover:text-red-700 transition-colors">
            Schedule or Get a Quote <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="mx-5 mt-1 mb-2 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-gray-800">In a dangerous situation?</p>
            <p className="text-[12px] text-gray-500 mt-0.5">Call 911 first. We'll get help to you too.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
