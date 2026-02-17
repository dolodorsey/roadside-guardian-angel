import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useAuth } from '@/contexts/AuthContext';
import { getServiceIcon } from '@/components/app/ServiceIcons';
import { MapPin, Shield, UserCheck, Zap, Navigation, ChevronRight, Bell } from 'lucide-react';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDIOnBRI2EMgLHHiUR6fM78aYgvp8T0YOg';

const serviceChips = [
  { type: 'tow', label: 'Tow' },
  { type: 'jump', label: 'Jump' },
  { type: 'flat', label: 'Flat Tire' },
  { type: 'lockout', label: 'Lockout' },
  { type: 'fuel', label: 'Fuel' },
  { type: 'winch', label: 'Winch' },
];

interface HomeScreenProps {
  onRequestService: (serviceType: string) => void;
  onOpenServices: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onRequestService, onOpenServices }) => {
  const { profile } = useAuth();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('Locating...');
  const [safeMode, setSafeMode] = useState(false);
  const [femaleFirst, setFemaleFirst] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${GOOGLE_MAPS_KEY}`)
            .then(r => r.json())
            .then(data => {
              if (data.results?.[0]) setAddress(data.results[0].formatted_address.split(',').slice(0, 2).join(','));
            })
            .catch(() => setAddress('Current Location'));
        },
        () => {
          setUserLocation({ lat: 33.749, lng: -84.388 });
          setAddress('Atlanta, GA');
        }
      );
    }
  }, []);

  return (
    <div className="relative h-[100dvh] bg-black overflow-hidden">
      {/* Map */}
      {GOOGLE_MAPS_KEY && userLocation ? (
        <APIProvider apiKey={GOOGLE_MAPS_KEY}>
          <Map
            defaultCenter={userLocation}
            defaultZoom={15}
            disableDefaultUI
            className="w-full h-full"
            gestureHandling="greedy"
            colorScheme="DARK"
          >
            <Marker position={userLocation} />
          </Map>
        </APIProvider>
      ) : (
        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
          <Navigation className="w-8 h-8 text-orange-500 animate-pulse" />
        </div>
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 pt-safe">
        <div className="px-5 pt-4 pb-6 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-zinc-500 text-[11px] font-semibold tracking-widest uppercase">
                {profile?.full_name ? `Hey, ${profile.full_name.split(' ')[0]}` : 'Welcome to S.O.S'}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <p className="text-white text-sm font-medium truncate max-w-[240px]">{address}</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800/50 flex items-center justify-center">
              <Bell className="w-4.5 h-4.5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Safety Toggles */}
      <div className="absolute top-[120px] right-4 flex flex-col gap-2.5 z-10">
        <button
          onClick={() => setSafeMode(!safeMode)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            safeMode
              ? 'bg-orange-500 shadow-orange-500/30 ring-2 ring-orange-400/50'
              : 'bg-zinc-900/80 backdrop-blur-md border border-zinc-800/50'
          }`}
        >
          <Shield className={`w-[18px] h-[18px] ${safeMode ? 'text-white' : 'text-zinc-400'}`} />
        </button>
        <button
          onClick={() => setFemaleFirst(!femaleFirst)}
          className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
            femaleFirst
              ? 'bg-pink-500 shadow-pink-500/30 ring-2 ring-pink-400/50'
              : 'bg-zinc-900/80 backdrop-blur-md border border-zinc-800/50'
          }`}
        >
          <UserCheck className={`w-[18px] h-[18px] ${femaleFirst ? 'text-white' : 'text-zinc-400'}`} />
        </button>
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-[68px] left-0 right-0 px-4">
        <div className="bg-zinc-950/[0.97] backdrop-blur-2xl rounded-[28px] border border-zinc-800/40 overflow-hidden shadow-2xl shadow-black/60">
          {/* Service Grid */}
          <div className="px-5 pt-5 pb-2">
            <p className="text-zinc-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-3">What do you need?</p>
            <div className="grid grid-cols-6 gap-1">
              {serviceChips.map(chip => {
                const { Icon, gradient } = getServiceIcon(chip.type);
                return (
                  <button
                    key={chip.type}
                    onClick={() => onRequestService(chip.type)}
                    className="flex flex-col items-center gap-1.5 py-2.5 rounded-2xl hover:bg-zinc-800/40 active:scale-90 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
                      <Icon className="text-white" size={22} />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium leading-none">{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />

          {/* CTA */}
          <div className="p-4 pt-3">
            <button
              onClick={() => onRequestService('tow')}
              className="w-full py-[14px] bg-gradient-to-r from-orange-500 via-orange-500 to-amber-500 text-white font-bold text-[15px] rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" strokeWidth={2.5} />
              Call a Superhero
            </button>
            <button
              onClick={onOpenServices}
              className="w-full mt-1.5 py-2.5 text-zinc-500 text-[13px] font-medium flex items-center justify-center gap-1 hover:text-orange-400 transition-colors"
            >
              Schedule or Get a Quote <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
