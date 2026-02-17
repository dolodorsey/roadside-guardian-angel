import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Shield, UserCheck, Zap, Navigation, ChevronRight } from 'lucide-react';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

// S.O.S Service Icons (SVG-based, not emoji)
const serviceChips = [
  { type: 'tow', label: 'Tow', icon: '🚛', color: 'from-red-500 to-red-600' },
  { type: 'jump', label: 'Jump', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
  { type: 'flat', label: 'Flat Tire', icon: '🔧', color: 'from-blue-500 to-blue-600' },
  { type: 'lockout', label: 'Lockout', icon: '🔑', color: 'from-purple-500 to-purple-600' },
  { type: 'fuel', label: 'Fuel', icon: '⛽', color: 'from-green-500 to-green-600' },
  { type: 'winch', label: 'Winch', icon: '🪝', color: 'from-orange-500 to-orange-600' },
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
  const [femalFirst, setFemaleFirst] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          // Reverse geocode
          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${GOOGLE_MAPS_KEY}`
          )
            .then(r => r.json())
            .then(data => {
              if (data.results?.[0]) {
                setAddress(data.results[0].formatted_address.split(',').slice(0, 2).join(','));
              }
            })
            .catch(() => setAddress('Current Location'));
        },
        () => {
          // Default to Atlanta
          setUserLocation({ lat: 33.749, lng: -84.388 });
          setAddress('Atlanta, GA');
        }
      );
    }
  }, []);

  return (
    <div className="relative h-[100dvh] bg-black overflow-hidden">
      {/* Map Layer */}
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
          <div className="text-center">
            <Navigation className="w-8 h-8 text-orange-500 mx-auto mb-3 animate-pulse" />
            <p className="text-zinc-400 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Top Bar - Greeting + Location */}
      <div className="absolute top-0 left-0 right-0 pt-safe">
        <div className="px-5 py-4 bg-gradient-to-b from-black/80 via-black/50 to-transparent">
          <p className="text-zinc-400 text-xs font-medium tracking-wide uppercase">
            {profile?.full_name ? `Hey, ${profile.full_name.split(' ')[0]}` : 'Welcome'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <p className="text-white text-sm font-medium truncate">{address}</p>
          </div>
        </div>
      </div>

      {/* Safety Toggles - Top Right */}
      <div className="absolute top-safe right-0 mt-4 mr-5 flex flex-col gap-2">
        <button
          onClick={() => setSafeMode(!safeMode)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            safeMode ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-zinc-900/80 backdrop-blur'
          }`}
        >
          <Shield className={`w-4.5 h-4.5 ${safeMode ? 'text-white' : 'text-zinc-400'}`} />
        </button>
        <button
          onClick={() => setFemaleFirst(!femalFirst)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            femalFirst ? 'bg-pink-500 shadow-lg shadow-pink-500/30' : 'bg-zinc-900/80 backdrop-blur'
          }`}
        >
          <UserCheck className={`w-4.5 h-4.5 ${femalFirst ? 'text-white' : 'text-zinc-400'}`} />
        </button>
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-16 left-0 right-0">
        <div className="mx-4 bg-zinc-950/95 backdrop-blur-xl rounded-3xl border border-zinc-800/50 overflow-hidden shadow-2xl">
          {/* Service Chips */}
          <div className="px-5 pt-5 pb-3">
            <p className="text-zinc-400 text-xs font-medium mb-3 tracking-wide">WHAT DO YOU NEED?</p>
            <div className="grid grid-cols-6 gap-2">
              {serviceChips.map(chip => (
                <button
                  key={chip.type}
                  onClick={() => onRequestService(chip.type)}
                  className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-zinc-800/50 active:scale-95 transition-all"
                >
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${chip.color} flex items-center justify-center shadow-md`}>
                    <span className="text-lg">{chip.icon}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-zinc-800/50 mx-5" />

          {/* CTA */}
          <div className="p-4">
            <button
              onClick={() => onRequestService('tow')}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Call a Superhero
            </button>

            <button
              onClick={onOpenServices}
              className="w-full mt-2 py-3 text-zinc-400 text-sm font-medium flex items-center justify-center gap-1 hover:text-orange-400 transition-colors"
            >
              Schedule or Consult <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
