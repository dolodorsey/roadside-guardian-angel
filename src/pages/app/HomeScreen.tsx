import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SOSMap from '@/components/app/SOSMap';
import { MapPin, Shield, UserCheck, ChevronRight, Phone, Zap, ChevronDown } from 'lucide-react';

const emergencyServices = [
  { type: 'tow', label: 'Towing', emoji: '🚛', bg: 'bg-red-50', ring: 'ring-red-200', desc: 'Short & long distance' },
  { type: 'flat', label: 'Flat Tire', emoji: '🔧', bg: 'bg-blue-50', ring: 'ring-blue-200', desc: 'Spare install or patch' },
  { type: 'jump', label: 'Jump Start', emoji: '⚡', bg: 'bg-amber-50', ring: 'ring-amber-200', desc: 'Portable power packs' },
  { type: 'fuel', label: 'Fuel Delivery', emoji: '⛽', bg: 'bg-green-50', ring: 'ring-green-200', desc: 'Gas, diesel, EV charge' },
  { type: 'lockout', label: 'Lockout', emoji: '🔑', bg: 'bg-purple-50', ring: 'ring-purple-200', desc: 'Non-destructive unlock' },
  { type: 'winch', label: 'Winch Out', emoji: '🪝', bg: 'bg-orange-50', ring: 'ring-orange-200', desc: 'Snow, sand, mud rescue' },
];

interface Props { onRequestService: (t: string) => void; onOpenServices: () => void; }

const HomeScreen: React.FC<Props> = ({ onRequestService, onOpenServices }) => {
  const { profile } = useAuth();
  const [loc, setLoc] = useState({ lat: 33.749, lng: -84.388 });
  const [address, setAddress] = useState('Finding you...');
  const [safeMode, setSafeMode] = useState(false);
  const [femaleFirst, setFemaleFirst] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => {
        const l = { lat: p.coords.latitude, lng: p.coords.longitude };
        setLoc(l); setReady(true);
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${l.lat}&lon=${l.lng}&format=json`)
          .then(r => r.json())
          .then(d => { const a = d.address; setAddress([a?.road, a?.city || a?.town].filter(Boolean).join(', ') || 'Current Location'); })
          .catch(() => setAddress('Current Location'));
      },
      () => { setReady(true); setAddress('Atlanta, GA'); }
    );
  }, []);

  const first = profile?.full_name?.split(' ')[0] || '';
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="relative h-[100dvh] bg-[#FFFBF5] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-safe bg-white/90 backdrop-blur-md border-b border-gray-100 z-20">
        <div className="py-4">
          <h2 className="font-display text-[22px] font-bold text-gray-900">{greet}{first ? `, ${first}` : ''} 👋</h2>
          <button className="flex items-center gap-1.5 mt-1 group">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="text-[14px] text-gray-500 truncate max-w-[250px]">{address}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative z-10">
        {ready ? (
          <SOSMap center={loc} zoom={15} markers={[{ lat: loc.lat, lng: loc.lng, color: '#f97316', pulse: true, label: 'You' }]} />
        ) : (
          <div className="w-full h-full bg-orange-50/40 flex items-center justify-center">
            <div className="text-center animate-fade-up">
              <div className="relative mx-auto w-16 h-16 mb-3"><div className="absolute inset-0 bg-orange-200/50 rounded-full animate-sos-ring" /><div className="relative w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center"><MapPin className="w-7 h-7 text-orange-500" /></div></div>
              <p className="text-gray-400 text-[14px]">Locating you...</p>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <button onClick={() => setSafeMode(!safeMode)} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-card transition-all active:scale-95 ${safeMode ? 'bg-orange-500 shadow-sos' : 'bg-white border border-gray-200'}`}>
            <Shield className={`w-5 h-5 ${safeMode ? 'text-white' : 'text-gray-400'}`} />
          </button>
          <button onClick={() => setFemaleFirst(!femaleFirst)} className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-card transition-all active:scale-95 ${femaleFirst ? 'bg-pink-500' : 'bg-white border border-gray-200'}`}>
            <UserCheck className={`w-5 h-5 ${femaleFirst ? 'text-white' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="relative z-20 bg-white rounded-t-[28px] shadow-[0_-4px_30px_rgba(0,0,0,0.06)] border-t border-gray-100 -mt-6 pb-20">
        <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 bg-gray-200 rounded-full" /></div>
        <div className="px-5 pb-3">
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">What do you need?</p>
          <div className="grid grid-cols-3 gap-3">
            {emergencyServices.map((svc, i) => (
              <button key={svc.type} onClick={() => onRequestService(svc.type)}
                className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl ${svc.bg} ring-1 ${svc.ring} hover:shadow-card-hover active:scale-[0.96] transition-all animate-fade-up`}
                style={{ animationDelay: `${i * 60}ms` }}>
                <span className="text-[28px]">{svc.emoji}</span>
                <span className="text-[12px] font-semibold text-gray-700">{svc.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 pt-2 pb-2">
          <button onClick={() => onRequestService('tow')}
            className="w-full h-[60px] bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[17px] font-bold rounded-2xl shadow-sos hover:shadow-sos-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2.5">
            <Zap className="w-6 h-6" /> Call a Superhero
          </button>
          <button onClick={onOpenServices}
            className="w-full mt-2 py-3 text-orange-500 text-[15px] font-semibold flex items-center justify-center gap-1">
            Schedule or Get a Quote <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="mx-5 mt-1 mb-2 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-red-500" /></div>
          <div><p className="text-[14px] font-semibold text-gray-800">In a dangerous situation?</p><p className="text-[12px] text-gray-500 mt-0.5">Call 911 first. We'll get you help too.</p></div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
