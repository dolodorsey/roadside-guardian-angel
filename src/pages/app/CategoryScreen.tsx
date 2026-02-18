import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Zap, CalendarClock, MessageSquare, ChevronRight, Clock, DollarSign } from 'lucide-react';

const CAT_META: Record<string, { title: string; desc: string; icon: string; gradient: string }> = {
  sos_rescue:        { title: 'SOS Rescue',        desc: '24/7 Emergency Roadside',    icon: '🚨', gradient: 'from-red-600 to-red-700' },
  mobile_mechanic:   { title: 'Mobile Mechanic',   desc: 'Repairs where you are',      icon: '🔧', gradient: 'from-blue-600 to-blue-700' },
  body_glass:        { title: 'Body & Glass',       desc: 'Repair, restore, protect',   icon: '🛡️', gradient: 'from-cyan-600 to-cyan-700' },
  detail_unit:       { title: 'Detail Unit',        desc: 'Clean, sanitized, ready',    icon: '✨', gradient: 'from-purple-600 to-purple-700' },
  convenience:       { title: 'Convenience Ops',    desc: 'We handle the annoying stuff', icon: '📦', gradient: 'from-orange-600 to-orange-700' },
  fleet_command:     { title: 'Fleet Command',      desc: 'On-site service for teams',  icon: '🏢', gradient: 'from-slate-600 to-slate-700' },
  seasonal:          { title: 'Seasonal Ops',       desc: 'Prep + recovery',            icon: '🌡️', gradient: 'from-teal-600 to-teal-700' },
  premium_concierge: { title: 'Premium Concierge',  desc: 'White-glove vehicle care',   icon: '👑', gradient: 'from-amber-600 to-amber-700' },
};

const MODE_CHIPS: { key: string; label: string; Icon: any }[] = [
  { key: 'all',           label: 'All',   Icon: null },
  { key: 'request_now',   label: 'NOW',   Icon: Zap },
  { key: 'schedule',      label: 'LATER', Icon: CalendarClock },
  { key: 'consult_first', label: 'QUOTE', Icon: MessageSquare },
];

interface Props {
  category: string;
  onBack: () => void;
  onSelectMission: (serviceType: string) => void;
}

const CategoryScreen: React.FC<Props> = ({ category, onBack, onSelectMission }) => {
  const [services, setServices] = useState<any[]>([]);
  const [mode, setMode] = useState('all');
  const meta = CAT_META[category] || { title: category, desc: '', icon: '📋', gradient: 'from-gray-600 to-gray-700' };

  useEffect(() => {
    supabase.from('service_catalog')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => { if (data) setServices(data); });
  }, [category]);

  // Filter: parent services only (no subcategories unless user drills down)
  const parents = services.filter(s => !s.parent_service);
  const filtered = mode === 'all' ? parents : parents.filter(s => s.mode === mode);

  // Get available modes for this category
  const availableModes = new Set(parents.map(s => s.mode));

  const formatPrice = (s: any) => {
    if (s.pricing_model === 'quote_required') return 'Get Quote';
    if (s.base_fee_cents) return `$${s.base_fee_cents / 100}`;
    return 'Free';
  };

  const modeColor = (m: string) => {
    if (m === 'request_now') return 'text-red-600 bg-red-50';
    if (m === 'schedule') return 'text-blue-600 bg-blue-50';
    return 'text-purple-600 bg-purple-50';
  };

  const modeLabel = (m: string) => {
    if (m === 'request_now') return 'NOW';
    if (m === 'schedule') return 'BOOK';
    return 'QUOTE';
  };

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF5] pb-24">
      {/* Hero Header */}
      <div className={`bg-gradient-to-r ${meta.gradient} pt-safe pb-6 px-5 relative overflow-hidden`}>
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/[0.05] rounded-full blur-2xl" />
        <button onClick={onBack} className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-3">
          <span className="text-[40px]">{meta.icon}</span>
          <div>
            <h1 className="text-[24px] font-display font-bold text-white">{meta.title}</h1>
            <p className="text-white/70 text-[14px] mt-0.5">{meta.desc}</p>
          </div>
        </div>
        <p className="text-white/50 text-[13px] mt-3">{parents.length} missions available</p>
      </div>

      {/* Mode Filter Chips */}
      <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide sticky top-0 bg-[#FFFBF5]/90 backdrop-blur-sm z-20 border-b border-gray-100/50">
        {MODE_CHIPS.filter(c => c.key === 'all' || availableModes.has(c.key)).map(chip => {
          const active = mode === chip.key;
          return (
            <button key={chip.key} onClick={() => setMode(chip.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all ${
                active ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-500 ring-1 ring-gray-200'
              }`}>
              {chip.Icon && <chip.Icon className="w-3.5 h-3.5" />}
              {chip.label}
              {chip.key !== 'all' && <span className="ml-1 text-[11px] opacity-60">
                {parents.filter(s => s.mode === chip.key).length}
              </span>}
            </button>
          );
        })}
      </div>

      {/* Mission List */}
      <div className="px-5 pt-3 space-y-2.5">
        {filtered.map((svc, i) => {
          const subs = services.filter(s => s.parent_service === svc.service_type);
          return (
            <button key={svc.service_type} onClick={() => onSelectMission(svc.service_type)}
              className="w-full bg-white rounded-2xl p-4 ring-1 ring-gray-100 shadow-sm hover:shadow-card active:scale-[0.98] transition-all text-left flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: `${i * 30}ms` }}>
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-[24px]">{svc.icon || '🔧'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-semibold text-gray-900 truncate">{svc.display_name}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${modeColor(svc.mode)}`}>
                    {modeLabel(svc.mode)}
                  </span>
                </div>
                {svc.description && <p className="text-[12px] text-gray-400 mt-0.5 truncate">{svc.description}</p>}
                {svc.included_text && <p className="text-[11px] text-green-600 mt-1">✓ {svc.included_text}</p>}
                {subs.length > 0 && <p className="text-[11px] text-gray-400 mt-1">{subs.length} options →</p>}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className="text-[15px] font-bold text-gray-900">{formatPrice(svc)}</span>
                {svc.eta_text && <span className="text-[11px] text-gray-400 flex items-center gap-0.5"><Clock className="w-3 h-3" />{svc.eta_text}</span>}
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-[15px]">No missions in this mode</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryScreen;
