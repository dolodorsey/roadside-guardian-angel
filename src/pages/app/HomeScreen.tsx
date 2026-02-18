import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LOGO } from '@/lib/assets';
import { MapPin, ChevronRight, Plus, Home, Briefcase, Star, AlertTriangle, Phone } from 'lucide-react';

const CATEGORIES = [
  { key: 'sos_rescue',        icon: '🚨', label: 'SOS Rescue',       color: 'bg-red-50    ring-red-200',    iconBg: 'bg-red-100' },
  { key: 'mobile_mechanic',   icon: '🔧', label: 'Mobile Mechanic',  color: 'bg-blue-50   ring-blue-200',   iconBg: 'bg-blue-100' },
  { key: 'body_glass',        icon: '🛡️', label: 'Body & Glass',     color: 'bg-cyan-50   ring-cyan-200',   iconBg: 'bg-cyan-100' },
  { key: 'detail_unit',       icon: '✨', label: 'Detail Unit',      color: 'bg-purple-50 ring-purple-200', iconBg: 'bg-purple-100' },
  { key: 'convenience',       icon: '📦', label: 'Convenience',      color: 'bg-orange-50 ring-orange-200', iconBg: 'bg-orange-100' },
  { key: 'fleet_command',     icon: '🏢', label: 'Fleet Command',    color: 'bg-slate-50  ring-slate-200',  iconBg: 'bg-slate-100' },
  { key: 'seasonal',          icon: '🌡️', label: 'Seasonal Ops',     color: 'bg-teal-50   ring-teal-200',   iconBg: 'bg-teal-100' },
  { key: 'premium_concierge', icon: '👑', label: 'Premium',          color: 'bg-amber-50  ring-amber-200',  iconBg: 'bg-amber-100' },
];

const QUICK_MISSIONS = [
  { type: 'tow',     icon: '🚛', label: 'Tow' },
  { type: 'jump',    icon: '⚡', label: 'Jump' },
  { type: 'flat',    icon: '🔧', label: 'Flat' },
  { type: 'lockout', icon: '🔑', label: 'Lockout' },
  { type: 'fuel',    icon: '⛽', label: 'Fuel' },
  { type: 'winch',   icon: '🪝', label: 'Winch' },
];

interface Props {
  onRequestService: (type: string) => void;
  onOpenCategory: (cat: string) => void;
  activeJobId?: string | null;
  onResumeJob?: (id: string) => void;
}

const HomeScreen: React.FC<Props> = ({ onRequestService, onOpenCategory, activeJobId, onResumeJob }) => {
  const { profile } = useAuth();
  const [address, setAddress] = useState('Finding location...');
  const [savedPlaces, setSavedPlaces] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => {
        const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (key) {
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=${key}`)
            .then(r => r.json()).then(d => {
              if (d.results?.[0]) setAddress(d.results[0].formatted_address.split(',').slice(0,2).join(',').trim());
            }).catch(() => setAddress('Current Location'));
        } else setAddress('Current Location');
      },
      () => setAddress('Atlanta, GA')
    );
    // Load saved places
    supabase.from('saved_places').select('*').then(({ data }) => { if (data) setSavedPlaces(data); });
  }, []);

  // Load active job if exists
  useEffect(() => {
    if (!activeJobId) return;
    supabase.from('jobs').select('id, service_type, status, created_at').eq('id', activeJobId).single()
      .then(({ data }) => { if (data) setActiveJob(data); });
  }, [activeJobId]);

  const firstName = profile?.full_name?.split(' ')[0] || '';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF5] pb-24">
      {/* Header */}
      <div className="px-5 pt-safe bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="py-3 flex items-center gap-3">
          <img src={LOGO} alt="S.O.S" className="w-11 h-11 object-contain" />
          <div className="flex-1">
            <h2 className="font-display text-[18px] font-bold text-gray-900">{greeting}{firstName ? `, ${firstName}` : ''}</h2>
            <button className="flex items-center gap-1 mt-0.5 group">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span className="text-[13px] text-gray-500 truncate max-w-[220px]">{address}</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* SOS NOW Button */}
        <button onClick={() => onOpenCategory('sos_rescue')}
          className="w-full relative overflow-hidden rounded-[20px] bg-gradient-to-r from-red-600 to-red-700 p-5 shadow-[0_6px_30px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all">
          <div className="absolute top-2 right-2 w-20 h-20 bg-white/[0.06] rounded-full blur-xl" />
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-[36px]">🚨</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-[22px] font-display font-bold">SOS NOW</p>
              <p className="text-red-100 text-[14px] mt-0.5">Immediate dispatch — 8 min avg</p>
            </div>
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </button>

        {/* Active Job Card */}
        {activeJob && (
          <button onClick={() => onResumeJob?.(activeJob.id)}
            className="w-full bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-up active:scale-[0.98] transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <span className="text-[24px]">🦸</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[15px] font-bold text-gray-900">Mission Active</p>
              <p className="text-[13px] text-green-700">{activeJob.service_type} — Tap to track</p>
            </div>
            <ChevronRight className="w-5 h-5 text-green-400" />
          </button>
        )}

        {/* Quick Missions Row */}
        <div>
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Dispatch</p>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {QUICK_MISSIONS.map((m, i) => (
              <button key={m.type} onClick={() => onRequestService(m.type)}
                className="flex-shrink-0 flex flex-col items-center gap-1.5 w-[72px] py-3 rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm hover:shadow-md active:scale-[0.95] transition-all animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}>
                <span className="text-[24px]">{m.icon}</span>
                <span className="text-[11px] font-semibold text-gray-600">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 8 Mission Categories — 2×4 Grid */}
        <div>
          <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Mission Categories</p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat, i) => (
              <button key={cat.key} onClick={() => onOpenCategory(cat.key)}
                className={`flex items-center gap-3 p-4 rounded-2xl ${cat.color} ring-1 hover:shadow-card active:scale-[0.97] transition-all text-left animate-fade-up`}
                style={{ animationDelay: `${i * 40}ms` }}>
                <div className={`w-11 h-11 ${cat.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-[22px]">{cat.icon}</span>
                </div>
                <span className="text-[14px] font-semibold text-gray-800 leading-tight">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Saved Places */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">Saved Places</p>
            <button className="text-[12px] text-red-500 font-semibold flex items-center gap-0.5">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            <button className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm">
              <Home className="w-4 h-4 text-red-500" />
              <span className="text-[13px] font-medium text-gray-700">Home</span>
            </button>
            <button className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm">
              <Briefcase className="w-4 h-4 text-blue-500" />
              <span className="text-[13px] font-medium text-gray-700">Work</span>
            </button>
            {savedPlaces.slice(0, 3).map(p => (
              <button key={p.id} className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-[13px] font-medium text-gray-700 truncate max-w-[100px]">{p.label || p.address?.split(',')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero Pass Upsell */}
        <button className="w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg active:scale-[0.98] transition-all">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
            <span className="text-[24px]">🦸</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-[15px] font-bold text-white">Hero Pass</p>
            <p className="text-[12px] text-gray-400 mt-0.5">Free tows + priority dispatch from $9.99/mo</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>

        {/* Emergency Banner */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-gray-800">In a dangerous situation?</p>
            <p className="text-[12px] text-gray-500 mt-0.5">Call 911 first. We'll get help to you too.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
