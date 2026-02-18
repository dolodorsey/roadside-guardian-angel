import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Zap, CalendarClock, MessageSquare, ChevronRight, Clock } from 'lucide-react';

const CATEGORY_META: Record<string, { title: string; desc: string; icon: string; color: string }> = {
  sos_rescue: { title: 'SOS Rescue', desc: '24/7 Emergency Roadside', icon: '🚨', color: 'from-red-500 to-red-600' },
  mobile_mechanic: { title: 'Mobile Mechanic', desc: 'Repairs where you are', icon: '🔧', color: 'from-blue-500 to-blue-600' },
  body_glass: { title: 'Body & Glass', desc: 'Repair, restore, protect', icon: '🛡️', color: 'from-cyan-500 to-cyan-600' },
  detail_unit: { title: 'Detail Unit', desc: 'Clean, sanitized, ready', icon: '✨', color: 'from-purple-500 to-purple-600' },
  convenience: { title: 'Convenience Ops', desc: 'We handle the annoying stuff', icon: '📦', color: 'from-orange-500 to-orange-600' },
  fleet_command: { title: 'Fleet Command', desc: 'On-site service for teams', icon: '🏢', color: 'from-slate-500 to-slate-600' },
  seasonal: { title: 'Seasonal Ops', desc: 'Prep + recovery', icon: '🌡️', color: 'from-teal-500 to-teal-600' },
  premium_concierge: { title: 'Premium Concierge', desc: 'White-glove vehicle care', icon: '👑', color: 'from-amber-500 to-amber-600' },
};

const MODE_CONFIG = {
  request_now: { label: 'NOW', icon: Zap, desc: 'Immediate dispatch' },
  schedule: { label: 'LATER', icon: CalendarClock, desc: 'Book for later' },
  consult_first: { label: 'QUOTE', icon: MessageSquare, desc: 'Get custom quote' },
};

interface Props {
  category: string;
  onBack: () => void;
  onSelectMission: (serviceType: string) => void;
}

const CategoryScreen: React.FC<Props> = ({ category, onBack, onSelectMission }) => {
  const [services, setServices] = useState<any[]>([]);
  const [modeFilter, setModeFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const meta = CATEGORY_META[category] || { title: category, desc: '', icon: '🔧', color: 'from-gray-500 to-gray-600' };

  useEffect(() => {
    supabase.from('service_catalog').select('*')
      .eq('category', category).eq('is_active', true).order('sort_order')
      .then(({ data }) => { setServices(data || []); setLoading(false); });
  }, [category]);

  const modes = [...new Set(services.map(s => s.mode))];
  const filtered = modeFilter ? services.filter(s => s.mode === modeFilter) : services;

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF5] pb-24">
      {/* Header */}
      <div className="pt-safe bg-white border-b border-gray-100">
        <div className="px-5 py-3 flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center active:scale-95">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-[18px] font-bold text-gray-900">{meta.title}</h1>
            <p className="text-[12px] text-gray-400">{meta.desc}</p>
          </div>
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center`}>
            <span className="text-[20px]">{meta.icon}</span>
          </div>
        </div>

        {/* Mode chips */}
        {modes.length > 1 && (
          <div className="px-5 pb-3 flex gap-2">
            <button onClick={() => setModeFilter(null)}
              className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all ${!modeFilter ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
              All
            </button>
            {modes.map(mode => {
              const cfg = MODE_CONFIG[mode as keyof typeof MODE_CONFIG];
              if (!cfg) return null;
              return (
                <button key={mode} onClick={() => setModeFilter(mode)}
                  className={`px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all flex items-center gap-1.5 ${modeFilter === mode ? 'bg-red-600 text-white shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                  <cfg.icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Mission List */}
      <div className="px-5 pt-4 space-y-2">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)
        ) : filtered.map((svc, i) => (
          <button key={svc.service_type} onClick={() => onSelectMission(svc.service_type)}
            className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-card flex items-center gap-4 text-left active:scale-[0.99] transition-all animate-fade-up hover:shadow-card-hover"
            style={{ animationDelay: `${i * 30}ms` }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-gray-900">{svc.display_name}</p>
                {svc.mode === 'request_now' && (
                  <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold rounded-md uppercase">Now</span>
                )}
              </div>
              <p className="text-[12px] text-gray-400 mt-0.5">{svc.description}</p>
              {svc.included_text && (
                <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full" /> {svc.included_text}
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              {svc.pricing_model === 'quote_required' ? (
                <span className="text-[13px] text-red-600 font-semibold">Get Quote</span>
              ) : (
                <span className="text-[17px] font-bold text-gray-900">${(svc.base_fee_cents / 100).toFixed(0)}{svc.pricing_model === 'base_plus_miles' ? '+' : ''}</span>
              )}
              {svc.eta_range_json?.min > 0 && (
                <p className="text-[10px] text-gray-400 mt-0.5 flex items-center justify-end gap-0.5">
                  <Clock className="w-3 h-3" /> {svc.eta_range_json.min}–{svc.eta_range_json.max}m
                </p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryScreen;
