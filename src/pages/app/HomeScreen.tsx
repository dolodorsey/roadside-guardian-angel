import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LOGO } from '@/lib/assets';
import { MapPin, ChevronRight, Shield, UserCheck, Phone, Clock, Zap, Star } from 'lucide-react';

const GMAPS = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const categories = [
  { id: 'sos_rescue',        label: 'SOS Rescue',      icon: '🚨', color: 'from-red-500 to-red-600',    ring: 'ring-red-200' },
  { id: 'mobile_mechanic',   label: 'Mobile Mechanic', icon: '🔧', color: 'from-blue-500 to-blue-600',  ring: 'ring-blue-200' },
  { id: 'body_glass',        label: 'Body & Glass',    icon: '🛡️', color: 'from-cyan-500 to-cyan-600',  ring: 'ring-cyan-200' },
  { id: 'detail_unit',       label: 'Detail Unit',     icon: '✨', color: 'from-purple-500 to-purple-600', ring: 'ring-purple-200' },
  { id: 'convenience',       label: 'Convenience',     icon: '📦', color: 'from-orange-500 to-orange-600', ring: 'ring-orange-200' },
  { id: 'fleet_command',     label: 'Fleet Command',   icon: '🏢', color: 'from-slate-500 to-slate-600',  ring: 'ring-slate-200' },
  { id: 'seasonal',          label: 'Seasonal Ops',    icon: '🌡️', color: 'from-teal-500 to-teal-600',  ring: 'ring-teal-200' },
  { id: 'premium_concierge', label: 'Premium',         icon: '👑', color: 'from-amber-500 to-amber-600', ring: 'ring-amber-200' },
];

const quickMissions = [
  { type: 'tow_short', label: 'Tow', icon: '🚛' },
  { type: 'jump_standard', label: 'Jump', icon: '⚡' },
  { type: 'flat_spare', label: 'Flat', icon: '🔧' },
  { type: 'lockout', label: 'Lockout', icon: '🔑' },
];

interface Props {
  onRequestService: (t: string) => void;
  onOpenCategory: (cat: string) => void;
}

const HomeScreen: React.FC<Props> = ({ onRequestService, onOpenCategory }) => {
  const { profile } = useAuth();
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('Finding your location...');
  const [activeJob, setActiveJob] = useState<any>(null);

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
    <div className="min-h-[100dvh] bg-[#FFFBF5] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-safe bg-white border-b border-gray-100">
        <div className="py-3 flex items-center gap-3">
          <img src={LOGO} alt="S.O.S" className="w-10 h-10 object-contain" />
          <div className="flex-1">
            <h2 className="font-display text-[17px] font-bold text-gray-900">{greeting}{firstName ? `, ${firstName}` : ''}</h2>
            <button className="flex items-center gap-1 mt-0.5 group">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[12px] text-gray-500 truncate max-w-[200px]">{address}</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
            </button>
          </div>
          <div className="flex gap-1.5">
            <button className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* SOS NOW BUTTON */}
      <div className="px-5 pt-5">
        <button onClick={() => onOpenCategory('sos_rescue')}
          className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl shadow-[0_4px_24px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-5" />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" fill="white" />
            </div>
            <div className="text-left">
              <p className="text-white text-[19px] font-bold">SOS NOW</p>
              <p className="text-red-200 text-[12px] font-medium">Get immediate help</p>
            </div>
          </div>
        </button>
      </div>

      {/* Quick Missions Row */}
      <div className="px-5 mt-4">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Missions</p>
        <div className="flex gap-2">
          {quickMissions.map(qm => (
            <button key={qm.type} onClick={() => onRequestService(qm.type)}
              className="flex-1 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-card flex flex-col items-center gap-1.5 active:scale-[0.96] transition-all">
              <span className="text-[22px]">{qm.icon}</span>
              <span className="text-[11px] font-semibold text-gray-600">{qm.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 8 Category Grid */}
      <div className="px-5 mt-5">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Mission Categories</p>
        <div className="grid grid-cols-2 gap-2.5">
          {categories.map((cat, i) => (
            <button key={cat.id} onClick={() => onOpenCategory(cat.id)}
              className={`py-4 px-4 rounded-2xl bg-white border border-gray-100 shadow-card flex items-center gap-3 text-left active:scale-[0.97] transition-all animate-fade-up hover:shadow-card-hover`}
              style={{ animationDelay: `${i * 40}ms` }}>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                <span className="text-[20px]">{cat.icon}</span>
              </div>
              <span className="text-[13px] font-semibold text-gray-800 leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Saved Places */}
      <div className="px-5 mt-5">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Saved Places</p>
        <div className="flex gap-2">
          {[{ label: 'Home', icon: '🏠' }, { label: 'Work', icon: '💼' }, { label: 'Add', icon: '➕' }].map(p => (
            <button key={p.label} className="flex-1 py-3 bg-white rounded-xl border border-gray-100 flex items-center justify-center gap-1.5 text-[12px] text-gray-500 font-medium">
              <span>{p.icon}</span> {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Pass Upsell */}
      <div className="px-5 mt-5 mb-4">
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-white" fill="white" />
          </div>
          <div className="flex-1">
            <p className="text-white text-[14px] font-bold">Hero Pass</p>
            <p className="text-red-200 text-[12px]">Save up to 25% on every mission</p>
          </div>
          <ChevronRight className="w-5 h-5 text-red-200" />
        </div>
      </div>

      {/* Emergency */}
      <div className="mx-5 mb-4 bg-red-50 border border-red-100 rounded-2xl p-3.5 flex items-center gap-3">
        <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-gray-800">Dangerous situation? Call 911 first.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
