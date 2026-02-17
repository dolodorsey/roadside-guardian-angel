import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Shield, UserCheck, ChevronRight, ChevronDown, Phone, Zap, Star, Clock, X } from 'lucide-react';

const GMAPS = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

/* ─── All 8 service categories from the deck ─── */
const emergencyServices = [
  { type: 'tow',     label: 'Towing',       icon: '🚛', desc: 'Short & long distance' },
  { type: 'flat',    label: 'Flat Tire',     icon: '🔧', desc: 'Spare install or patch' },
  { type: 'jump',    label: 'Jump Start',    icon: '⚡', desc: 'Portable power packs' },
  { type: 'fuel',    label: 'Fuel Delivery', icon: '⛽', desc: 'Gas, diesel, EV charge' },
  { type: 'lockout', label: 'Lockout',       icon: '🔑', desc: 'Non-destructive unlock' },
  { type: 'winch',   label: 'Winch Out',     icon: '🪝', desc: 'Snow, sand, mud rescue' },
  { type: 'accident',label: 'Accident Help', icon: '🚨', desc: 'Cleanup & temp fixes' },
  { type: 'tire_concierge', label: 'Tire Concierge', icon: '🛞', desc: 'Pick up, install, deliver' },
];

const maintenanceServices = [
  { type: 'oil_change', label: 'Oil Change',   icon: '🛢️', desc: 'At home or office' },
  { type: 'battery',    label: 'Battery Swap', icon: '🔋', desc: 'Delivered + installed' },
  { type: 'brakes',     label: 'Brake Pads',   icon: '🔴', desc: 'Mobile installs' },
  { type: 'diagnostic', label: 'Diagnostic',   icon: '📟', desc: 'OBD-II scan + report' },
  { type: 'fluids',     label: 'Fluid Top-Up', icon: '💧', desc: 'Brake, coolant, wiper' },
  { type: 'bulbs',      label: 'Bulb Replace', icon: '💡', desc: 'Head/brake/turn signal' },
];

const detailingServices = [
  { type: 'exterior_wash', label: 'Exterior Wash', icon: '🚿', desc: 'Waterless or traditional' },
  { type: 'full_detail',   label: 'Full Detail',   icon: '✨', desc: 'Interior + exterior' },
  { type: 'ceramic',       label: 'Ceramic Coat',  icon: '🛡️', desc: 'Premium protection' },
  { type: 'upholstery',    label: 'Upholstery',    icon: '🧽', desc: 'Carpet & seat shampoo' },
];

const glassServices = [
  { type: 'windshield',  label: 'Windshield',    icon: '🪟', desc: 'Chips & cracks' },
  { type: 'tinting',     label: 'Window Tint',   icon: '🕶️', desc: 'Mobile tinting' },
  { type: 'dent_remove', label: 'Dent Removal',  icon: '🔨', desc: 'Paintless repair' },
];

const convenienceServices = [
  { type: 'errand',    label: 'Errand Assist',  icon: '📦', desc: 'Pick up parts for you' },
  { type: 'dashcam',   label: 'Tech Install',   icon: '📱', desc: 'CarPlay / dash cams' },
  { type: 'key_fob',   label: 'Key Fob',        icon: '🔐', desc: 'Program & replace' },
  { type: 'safety_kit',label: 'Safety Kit',      icon: '🧰', desc: 'Emergency kit delivery' },
];

const premiumServices = [
  { type: 'valet_wash', label: 'Valet Fuel+Wash', icon: '🏎️', desc: 'While you work/shop' },
  { type: 'pickup_return', label: 'Pickup & Return', icon: '🔄', desc: 'We take it to the shop' },
  { type: 'inspection', label: 'Inspection Escort', icon: '📋', desc: 'State inspection + return' },
  { type: 'upgrade',    label: 'Upgrade Concierge', icon: '⭐', desc: 'Tires, rims, performance' },
];

const seasonalServices = [
  { type: 'winter_prep',  label: 'Winter Prep',   icon: '❄️', desc: 'Antifreeze, tire swap' },
  { type: 'summer_prep',  label: 'Summer Prep',   icon: '☀️', desc: 'AC check, coolant' },
  { type: 'ac_recharge',  label: 'AC Recharge',   icon: '🌡️', desc: 'On-site A/C refresh' },
  { type: 'tire_swap',    label: 'Tire Swap',     icon: '🔄', desc: 'Seasonal changeover' },
];

const fleetServices = [
  { type: 'fleet_fuel',   label: 'Fleet Fueling',  icon: '⛽', desc: 'Gas/diesel delivery' },
  { type: 'fleet_wash',   label: 'Fleet Detail',   icon: '🚿', desc: 'On-site group service' },
  { type: 'fleet_check',  label: 'Fleet Checkup',  icon: '📊', desc: 'Tire, fluids, diag' },
  { type: 'fleet_maint',  label: 'Fleet Maint.',   icon: '🔧', desc: 'Bulk discount upkeep' },
];

const serviceCategories = [
  { id: 'emergency',    label: 'Emergency',         icon: '🚨', services: emergencyServices },
  { id: 'maintenance',  label: 'Maintenance',       icon: '🔧', services: maintenanceServices },
  { id: 'detailing',    label: 'Wash & Detail',     icon: '✨', services: detailingServices },
  { id: 'glass',        label: 'Glass & Body',      icon: '🪟', services: glassServices },
  { id: 'convenience',  label: 'Convenience',       icon: '📦', services: convenienceServices },
  { id: 'premium',      label: 'Premium Concierge', icon: '👑', services: premiumServices },
  { id: 'seasonal',     label: 'Seasonal',          icon: '🌡️', services: seasonalServices },
  { id: 'fleet',        label: 'Fleet Services',    icon: '🚚', services: fleetServices },
];

const quickActions = [
  { type: 'tow',     label: 'Tow',        icon: '🚛', glow: '#ef4444' },
  { type: 'jump',    label: 'Jump',        icon: '⚡', glow: '#f59e0b' },
  { type: 'flat',    label: 'Flat Tire',   icon: '🔧', glow: '#3b82f6' },
  { type: 'lockout', label: 'Lockout',     icon: '🔑', glow: '#a855f7' },
  { type: 'fuel',    label: 'Fuel',        icon: '⛽', glow: '#22c55e' },
  { type: 'full_detail', label: 'Detail',  icon: '✨', glow: '#06b6d4' },
];

const adBanners = [
  {
    id: 'roadside-plus',
    title: 'ROADSIDE+',
    subtitle: 'Unlimited calls. Priority dispatch. $9.99/mo',
    cta: 'Start Free Trial',
    bg: 'linear-gradient(135deg, #ea580c 0%, #d97706 50%, #f97316 100%)',
    internal: true,
  },
  {
    id: 'ad-slot-1',
    title: 'YOUR BRAND HERE',
    subtitle: 'Reach 100K+ drivers in your city',
    cta: 'Advertise',
    bg: 'linear-gradient(135deg, #334155 0%, #475569 50%, #334155 100%)',
    internal: false,
  },
  {
    id: 'ad-slot-2',
    title: 'PARTNER SPOTLIGHT',
    subtitle: 'Premium ad placement available',
    cta: 'Learn More',
    bg: 'linear-gradient(135deg, #312e81 0%, #3730a3 50%, #312e81 100%)',
    internal: false,
  },
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
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [adIndex, setAdIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
        } else {
          setAddress('Current Location');
        }
      },
      () => { setLoc({ lat: 33.749, lng: -84.388 }); setAddress('Atlanta, GA'); }
    );
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setAdIndex(i => (i + 1) % adBanners.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const firstName = profile?.full_name?.split(' ')[0] || '';
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const handleDragStart = (e: React.TouchEvent) => {
    const startY = e.touches[0].clientY;
    const handleMove = (ev: TouchEvent) => {
      const diff = startY - ev.touches[0].clientY;
      if (diff > 40) setSheetExpanded(true);
      if (diff < -40) setSheetExpanded(false);
    };
    const handleEnd = () => {
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  };

  const darkMapStyles = [
    { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6b6b80' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#252540' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#333355' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2d2d4a' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d0d1a' }] },
    { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  ];

  return (
    <div className="relative h-[100dvh] flex flex-col overflow-hidden" style={{ background: '#08080f' }}>

      {/* ════════ FULL-SCREEN MAP ════════ */}
      <div className="absolute inset-0 z-0">
        {GMAPS && loc ? (
          <APIProvider apiKey={GMAPS}>
            <Map
              defaultCenter={loc}
              defaultZoom={15}
              disableDefaultUI
              gestureHandling="greedy"
              className="w-full h-full"
              styles={darkMapStyles}
            >
              <Marker position={loc} />
            </Map>
          </APIProvider>
        ) : (
          /* Dark map placeholder */
          <div className="w-full h-full relative" style={{ background: 'linear-gradient(180deg, #0f1520 0%, #080810 40%, #0a0a18 100%)' }}>
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />
            {/* Glow beacon */}
            <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-[-40px] rounded-full animate-sos-ring" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
              <div className="absolute inset-[-20px] rounded-full animate-sos-ring" style={{ animationDelay: '0.6s', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)' }} />
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #f97316, #d97706)',
                boxShadow: '0 0 40px rgba(249,115,22,0.35), 0 0 80px rgba(249,115,22,0.15)',
              }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
            {/* Faux roads */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 400 800">
              <line x1="0" y1="300" x2="400" y2="280" stroke="white" strokeWidth="2" />
              <line x1="0" y1="500" x2="400" y2="520" stroke="white" strokeWidth="1.5" />
              <line x1="150" y1="0" x2="170" y2="800" stroke="white" strokeWidth="1.5" />
              <line x1="300" y1="0" x2="280" y2="800" stroke="white" strokeWidth="1" />
            </svg>
          </div>
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(180deg, rgba(8,8,15,0.65) 0%, rgba(8,8,15,0.15) 35%, rgba(8,8,15,0.5) 65%, rgba(8,8,15,0.95) 100%)',
        }} />
      </div>

      {/* ════════ TOP BAR ════════ */}
      <div className="relative z-20 px-5 pt-safe">
        <div className="py-3.5 flex items-center justify-between">
          <div>
            <h2 className="text-[19px] font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {greeting}{firstName ? `, ${firstName}` : ''}
            </h2>
            <button className="flex items-center gap-1.5 mt-0.5 group">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-[12px] text-white/60 group-hover:text-orange-400 transition-colors truncate max-w-[180px]">{address}</span>
              <ChevronDown className="w-3 h-3 text-white/30" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSafeMode(!safeMode)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                safeMode
                  ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                  : 'bg-white/[0.07] border border-white/[0.08] backdrop-blur-md'
              }`}
            >
              <Shield className={`w-4.5 h-4.5 ${safeMode ? 'text-white' : 'text-white/50'}`} />
            </button>
            <button
              onClick={() => setFemaleFirst(!femaleFirst)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                femaleFirst
                  ? 'bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)]'
                  : 'bg-white/[0.07] border border-white/[0.08] backdrop-blur-md'
              }`}
            >
              <UserCheck className={`w-4.5 h-4.5 ${femaleFirst ? 'text-white' : 'text-white/50'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* ════════ BOTTOM SHEET ════════ */}
      <div
        className={`relative z-20 mt-auto transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]`}
        style={{
          maxHeight: sheetExpanded ? '85dvh' : '54dvh',
          background: 'linear-gradient(180deg, rgba(12,12,20,0.97) 0%, rgba(8,8,14,0.99) 100%)',
          backdropFilter: 'blur(60px) saturate(1.2)',
          borderRadius: '24px 24px 0 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 -10px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Drag handle */}
        <div
          className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing"
          onTouchStart={handleDragStart}
          onClick={() => setSheetExpanded(!sheetExpanded)}
        >
          <div className="w-9 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Scrollable content — FIXED overflow */}
        <div
          ref={scrollRef}
          className="overflow-y-auto overscroll-y-contain"
          style={{
            height: sheetExpanded ? 'calc(85dvh - 24px)' : 'calc(54dvh - 24px)',
            paddingBottom: '100px',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* ── Quick Actions ── */}
          <div className="px-5 pb-4">
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.18em] mb-2.5">What do you need?</p>
            <div className="grid grid-cols-3 gap-2">
              {quickActions.map((svc, i) => (
                <button
                  key={svc.type}
                  onClick={() => onRequestService(svc.type)}
                  className="relative flex flex-col items-center gap-1.5 py-3.5 rounded-2xl transition-all active:scale-[0.95] group animate-fade-up"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity pointer-events-none"
                    style={{ boxShadow: `inset 0 0 25px ${svc.glow}12, 0 0 15px ${svc.glow}06` }} />
                  <span className="text-[26px] relative z-10 drop-shadow-sm">{svc.icon}</span>
                  <span className="text-[11px] font-semibold text-white/70 relative z-10">{svc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="px-5 pb-3">
            <button
              onClick={() => onRequestService('tow')}
              className="w-full h-[54px] relative overflow-hidden rounded-2xl text-white text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{
                background: 'linear-gradient(135deg, #ea580c 0%, #d97706 50%, #f97316 100%)',
                boxShadow: '0 0 30px rgba(249,115,22,0.25), 0 4px 16px rgba(249,115,22,0.2)',
              }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent"
                  style={{ animation: 'shimmer 3s infinite linear' }} />
              </div>
              <Zap className="w-4.5 h-4.5 relative z-10" fill="currentColor" />
              <span className="relative z-10">Call a Superhero</span>
            </button>
            <div className="flex items-center justify-center gap-3 mt-2.5">
              <button onClick={onOpenServices} className="text-orange-400/70 text-[12px] font-medium flex items-center gap-1 hover:text-orange-300 transition-colors">
                All Services <ChevronRight className="w-3 h-3" />
              </button>
              <span className="w-px h-3 bg-white/10" />
              <button onClick={onOpenServices} className="text-white/35 text-[12px] font-medium flex items-center gap-1 hover:text-white/50 transition-colors">
                Schedule <Clock className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ── AD BANNER ── */}
          <div className="px-5 pb-4">
            <div className="relative overflow-hidden rounded-2xl" style={{ height: '82px' }}>
              {adBanners.map((ad, i) => (
                <div
                  key={ad.id}
                  className={`absolute inset-0 flex items-center px-5 transition-all duration-600 ease-out ${
                    i === adIndex ? 'opacity-100 translate-x-0' : i < adIndex ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
                  }`}
                  style={{ background: ad.bg, borderRadius: '16px' }}
                >
                  {!ad.internal && (
                    <span className="absolute top-2 right-3 text-[8px] font-bold text-white/30 uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      Ad
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-[14px]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{ad.title}</p>
                    <p className="text-white/60 text-[11px] mt-0.5 truncate">{ad.subtitle}</p>
                  </div>
                  <button className="px-3.5 py-1.5 rounded-xl text-white text-[11px] font-semibold flex-shrink-0 hover:brightness-110 transition-all"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
                    {ad.cta}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-1.5 mt-2">
              {adBanners.map((_, i) => (
                <button key={i} onClick={() => setAdIndex(i)}
                  className={`h-[3px] rounded-full transition-all duration-300 ${i === adIndex ? 'w-4 bg-orange-500' : 'w-[3px] bg-white/15'}`} />
              ))}
            </div>
          </div>

          {/* ── SERVICE CATEGORIES (Block Grid) ── */}
          <div className="px-5 pb-3">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.18em]">All Services</p>
              <button onClick={onOpenServices} className="text-[11px] text-orange-400/60 font-medium">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {serviceCategories.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  className="relative overflow-hidden rounded-xl p-3.5 text-left transition-all active:scale-[0.97] animate-fade-up"
                  style={{
                    animationDelay: `${i * 50}ms`,
                    background: activeCategory === cat.id ? 'rgba(249,115,22,0.08)' : 'rgba(255,255,255,0.025)',
                    border: activeCategory === cat.id ? '1px solid rgba(249,115,22,0.2)' : '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[20px]">{cat.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-bold text-white/85 truncate">{cat.label}</p>
                      <p className="text-[10px] text-white/30">{cat.services.length} services</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-3 h-3 text-white/15 absolute top-3.5 right-3 transition-transform duration-200 ${activeCategory === cat.id ? 'rotate-90 text-orange-400/50' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ── Expanded Category ── */}
          {activeCategory && (
            <div className="px-5 pb-4 animate-fade-up">
              <div className="flex items-center justify-between mb-2.5 pt-1">
                <p className="text-[12px] font-bold text-white/60" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {serviceCategories.find(c => c.id === activeCategory)?.icon}{' '}
                  {serviceCategories.find(c => c.id === activeCategory)?.label}
                </p>
                <button onClick={() => setActiveCategory(null)} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-3.5 h-3.5 text-white/25" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {serviceCategories.find(c => c.id === activeCategory)?.services.map((svc, i) => (
                  <button
                    key={svc.type}
                    onClick={() => onRequestService(svc.type)}
                    className="flex flex-col gap-1 p-3 rounded-xl text-left transition-all active:scale-[0.97] animate-fade-up"
                    style={{
                      animationDelay: `${i * 35}ms`,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <span className="text-[20px]">{svc.icon}</span>
                    <p className="text-[11px] font-semibold text-white/80">{svc.label}</p>
                    <p className="text-[9px] text-white/30 leading-tight">{svc.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Trust Bar ── */}
          <div className="px-5 pb-4">
            <div className="flex items-center justify-around py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              {[
                { icon: Shield, label: 'Verified', value: '100%' },
                { icon: Clock, label: 'Avg ETA', value: '8 min' },
                { icon: Star, label: 'Rating', value: '4.9' },
                { icon: Zap, label: '24/7', value: 'Always' },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center gap-0.5">
                  <stat.icon className="w-3.5 h-3.5 text-orange-400/60" />
                  <span className="text-[13px] font-bold text-white/75" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{stat.value}</span>
                  <span className="text-[8px] text-white/25 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Emergency ── */}
          <div className="px-5 pb-6">
            <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)' }}>
                <Phone className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold text-white/70">Dangerous situation?</p>
                <p className="text-[10px] text-white/35 mt-0.5">Call 911 first. We'll get you help too.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;
