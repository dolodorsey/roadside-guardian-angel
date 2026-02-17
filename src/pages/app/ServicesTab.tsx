import React, { useState } from 'react';
import { ChevronRight, Zap, CalendarClock, Wrench, Search, X } from 'lucide-react';

interface Props { onRequestService: (t: string) => void; }

const categories = [
  {
    id: 'emergency', label: 'Emergency', icon: '🚨', color: '#ef4444',
    services: [
      { type: 'tow', label: 'Towing', icon: '🚛', desc: 'Short & long distance', price: '$89+' },
      { type: 'flat', label: 'Flat Tire', icon: '🔧', desc: 'Spare install or patch', price: '$49' },
      { type: 'jump', label: 'Jump Start', icon: '⚡', desc: 'Portable power packs', price: '$39' },
      { type: 'fuel', label: 'Fuel Delivery', icon: '⛽', desc: 'Gas, diesel, EV charge', price: '$45' },
      { type: 'lockout', label: 'Lockout', icon: '🔑', desc: 'Non-destructive unlock', price: '$49' },
      { type: 'winch', label: 'Winch Out', icon: '🪝', desc: 'Snow, sand, mud rescue', price: '$79' },
      { type: 'accident', label: 'Accident Help', icon: '🚨', desc: 'Cleanup & temp fixes', price: 'Quote' },
      { type: 'tire_concierge', label: 'Tire Concierge', icon: '🛞', desc: 'Pick up, install, deliver', price: '$99+' },
    ],
  },
  {
    id: 'maintenance', label: 'Maintenance & Repairs', icon: '🔧', color: '#3b82f6',
    services: [
      { type: 'oil_change', label: 'Oil Change', icon: '🛢️', desc: 'At home or office', price: '$69' },
      { type: 'battery', label: 'Battery Swap', icon: '🔋', desc: 'Delivered + installed', price: '$149+' },
      { type: 'brakes', label: 'Brake Pads', icon: '🔴', desc: 'Mobile installs', price: '$199+' },
      { type: 'diagnostic', label: 'Diagnostic', icon: '📟', desc: 'OBD-II scan + report', price: '$49' },
      { type: 'fluids', label: 'Fluid Top-Up', icon: '💧', desc: 'Brake, coolant, wiper', price: '$35' },
      { type: 'bulbs', label: 'Bulb Replace', icon: '💡', desc: 'Head/brake/turn signal', price: '$29+' },
      { type: 'belts', label: 'Belt & Hose', icon: '🔗', desc: 'Mobile mechanic fixes', price: 'Quote' },
      { type: 'minor_engine', label: 'Minor Repairs', icon: '🔧', desc: 'Quick fixes', price: 'Quote' },
    ],
  },
  {
    id: 'detailing', label: 'Car Wash & Detailing', icon: '✨', color: '#10b981',
    services: [
      { type: 'exterior_wash', label: 'Exterior Wash', icon: '🚿', desc: 'Waterless or traditional', price: '$29' },
      { type: 'full_detail', label: 'Full Detail', icon: '✨', desc: 'Interior + exterior', price: '$149' },
      { type: 'ceramic', label: 'Ceramic Coating', icon: '🛡️', desc: 'Premium protection', price: '$299+' },
      { type: 'upholstery', label: 'Upholstery', icon: '🧽', desc: 'Carpet & seat shampoo', price: '$79' },
      { type: 'pet_hair', label: 'Pet Hair Removal', icon: '🐾', desc: 'Deep clean add-on', price: '$39+' },
      { type: 'sanitize', label: 'Air Sanitization', icon: '🌬️', desc: 'Ozone / antibacterial', price: '$49' },
    ],
  },
  {
    id: 'glass', label: 'Glass & Body', icon: '🪟', color: '#8b5cf6',
    services: [
      { type: 'windshield', label: 'Windshield', icon: '🪟', desc: 'Chips & cracks', price: '$99+' },
      { type: 'side_window', label: 'Window Replace', icon: '🪟', desc: 'Side & rear', price: '$149+' },
      { type: 'tinting', label: 'Window Tint', icon: '🕶️', desc: 'Mobile tinting', price: '$199+' },
      { type: 'dent_remove', label: 'Dent Removal', icon: '🔨', desc: 'Paintless repair', price: '$89+' },
      { type: 'scratch', label: 'Scratch Fix', icon: '🎨', desc: 'Buffing & touch-ups', price: '$59+' },
    ],
  },
  {
    id: 'convenience', label: 'Convenience', icon: '📦', color: '#f59e0b',
    services: [
      { type: 'errand', label: 'Errand Assist', icon: '📦', desc: 'Pick up parts for you', price: '$25+' },
      { type: 'dashcam', label: 'Tech Install', icon: '📱', desc: 'CarPlay / dash cams', price: '$49+' },
      { type: 'key_fob', label: 'Key Fob', icon: '🔐', desc: 'Program & replace', price: '$99+' },
      { type: 'safety_kit', label: 'Safety Kit', icon: '🧰', desc: 'Emergency kit delivery', price: '$39' },
      { type: 'accessories', label: 'Accessories', icon: '🛒', desc: 'Seat covers, racks', price: 'Varies' },
    ],
  },
  {
    id: 'premium', label: 'Premium Concierge', icon: '👑', color: '#f97316',
    services: [
      { type: 'valet_wash', label: 'Valet Fuel+Wash', icon: '🏎️', desc: 'While you work/shop', price: '$59' },
      { type: 'parking_detail', label: 'Parking Detail', icon: '🅿️', desc: 'Wash while parked', price: '$49' },
      { type: 'pickup_return', label: 'Pickup & Return', icon: '🔄', desc: 'To shop and back', price: '$99+' },
      { type: 'upgrade', label: 'Upgrade Concierge', icon: '⭐', desc: 'Tires, rims, parts', price: 'Quote' },
      { type: 'inspection', label: 'Inspection Escort', icon: '📋', desc: 'State insp + return', price: '$79' },
    ],
  },
  {
    id: 'seasonal', label: 'Seasonal & Specialty', icon: '🌡️', color: '#0ea5e9',
    services: [
      { type: 'winter_prep', label: 'Winter Prep', icon: '❄️', desc: 'Antifreeze, tire swap', price: '$99+' },
      { type: 'summer_prep', label: 'Summer Prep', icon: '☀️', desc: 'AC check, coolant', price: '$89' },
      { type: 'ac_recharge', label: 'AC Recharge', icon: '🌡️', desc: 'On-site A/C refresh', price: '$69' },
      { type: 'tire_swap', label: 'Seasonal Tires', icon: '🔄', desc: 'Winter/summer swap', price: '$79' },
      { type: 'storm_cleanup', label: 'Storm Cleanup', icon: '🌪️', desc: 'Debris removal', price: '$49+' },
    ],
  },
  {
    id: 'fleet', label: 'Fleet & Business', icon: '🚚', color: '#64748b',
    services: [
      { type: 'fleet_fuel', label: 'Fleet Fueling', icon: '⛽', desc: 'Gas/diesel delivery', price: 'Custom' },
      { type: 'fleet_wash', label: 'Fleet Detail', icon: '🚿', desc: 'On-site group service', price: 'Custom' },
      { type: 'fleet_check', label: 'Fleet Checkup', icon: '📊', desc: 'Tire, fluids, diag', price: 'Custom' },
      { type: 'fleet_maint', label: 'Fleet Maint.', icon: '🔧', desc: 'Bulk discount', price: 'Custom' },
    ],
  },
];

const modes = [
  { id: 'all', label: 'All', icon: Zap },
  { id: 'emergency', label: 'Now', icon: Zap },
  { id: 'schedule', label: 'Schedule', icon: CalendarClock },
  { id: 'specialist', label: 'Specialist', icon: Wrench },
];

const ServicesTab: React.FC<Props> = ({ onRequestService }) => {
  const [mode, setMode] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  const filteredCategories = categories.filter(cat => {
    if (mode === 'emergency') return cat.id === 'emergency';
    if (mode === 'schedule') return ['maintenance', 'detailing', 'glass', 'seasonal'].includes(cat.id);
    if (mode === 'specialist') return ['premium', 'fleet', 'convenience'].includes(cat.id);
    return true;
  }).map(cat => ({
    ...cat,
    services: search
      ? cat.services.filter(s => s.label.toLowerCase().includes(search.toLowerCase()) || s.desc.toLowerCase().includes(search.toLowerCase()))
      : cat.services,
  })).filter(cat => cat.services.length > 0);

  return (
    <div className="min-h-screen pt-safe" style={{ background: '#08080f' }}>
      {/* Header */}
      <div className="px-5 py-5">
        <h1 className="text-[22px] font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Services</h1>
        <p className="text-[13px] text-white/35 mt-0.5">Everything your car needs. One tap away.</p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            type="text" placeholder="Search services..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-[44px] pl-11 pr-10 rounded-xl text-[14px] text-white placeholder-white/25 outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
              <X className="w-4 h-4 text-white/30" />
            </button>
          )}
        </div>
      </div>

      {/* Mode tabs */}
      <div className="px-5 flex gap-2 mb-5 overflow-x-auto no-scrollbar">
        {modes.map(m => {
          const active = mode === m.id;
          return (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
                active ? 'text-white' : 'text-white/40'
              }`}
              style={{
                background: active ? 'linear-gradient(135deg, #ea580c, #d97706)' : 'rgba(255,255,255,0.03)',
                border: active ? 'none' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: active ? '0 4px 20px rgba(249,115,22,0.2)' : 'none',
              }}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* Categories + Services */}
      <div className="px-5 space-y-4 pb-28">
        {filteredCategories.map((cat, ci) => (
          <div key={cat.id} className="animate-fade-up" style={{ animationDelay: `${ci * 60}ms` }}>
            {/* Category header */}
            <button
              onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
              className="w-full flex items-center justify-between mb-2.5"
            >
              <div className="flex items-center gap-2">
                <span className="text-[18px]">{cat.icon}</span>
                <span className="text-[14px] font-bold text-white/80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{cat.label}</span>
                <span className="text-[11px] text-white/25 ml-1">{cat.services.length}</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-white/20 transition-transform ${expandedCat === cat.id || !expandedCat ? 'rotate-90' : ''}`} />
            </button>

            {/* Service blocks */}
            {(expandedCat === cat.id || !expandedCat) && (
              <div className="grid grid-cols-2 gap-2">
                {cat.services.map((svc, i) => (
                  <button
                    key={svc.type}
                    onClick={() => onRequestService(svc.type)}
                    className="flex flex-col p-3.5 rounded-xl text-left transition-all active:scale-[0.97] group animate-fade-up"
                    style={{
                      animationDelay: `${i * 35}ms`,
                      background: 'rgba(255,255,255,0.025)',
                      border: '1px solid rgba(255,255,255,0.04)',
                    }}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <span className="text-[22px]">{svc.icon}</span>
                      <span className="text-[11px] font-bold text-orange-400/70">{svc.price}</span>
                    </div>
                    <p className="text-[12px] font-semibold text-white/80 mb-0.5">{svc.label}</p>
                    <p className="text-[10px] text-white/30 leading-tight">{svc.desc}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-white/20 text-[14px]">No services match your search</p>
          </div>
        )}
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
};

export default ServicesTab;
