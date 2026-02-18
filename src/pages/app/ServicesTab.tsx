import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Zap, CalendarClock, Wrench } from 'lucide-react';

interface Props { onRequestService: (t: string) => void; }

const modeConfig: Record<string, { label: string; icon: React.FC<any>; desc: string }> = {
  request_now: { label: 'Emergency', icon: Zap, desc: 'Get help right now' },
  schedule: { label: 'Schedule', icon: CalendarClock, desc: 'Book for later' },
  consult_first: { label: 'Specialist', icon: Wrench, desc: 'Custom work' },
};

const icon = (t: string) => t === 'tow' ? '🚛' : t === 'jump' ? '⚡' : t === 'flat' ? '🔧' : t === 'lockout' ? '🔑' : t === 'fuel' ? '⛽' : t === 'winch' ? '🪝' : t === 'oil_change' ? '🛢️' : t === 'brakes' ? '🔴' : t === 'detailing' ? '✨' : t === 'inspection' ? '🔍' : t === 'wrap' ? '🎨' : t === 'performance' ? '🏎️' : t === 'audio' ? '🔊' : '🔧';

const ServicesTab: React.FC<Props> = ({ onRequestService }) => {
  const [mode, setMode] = useState('request_now');
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('service_catalog').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { if (data) setServices(data); });
  }, []);

  const filtered = services.filter(s => s.mode === mode);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-safe">
      <div className="px-5 py-6">
        <h1 className="font-display text-[24px] font-bold text-gray-900">Services</h1>
        <p className="text-[14px] text-gray-400 mt-0.5">Everything your car needs</p>
      </div>

      {/* Mode tabs */}
      <div className="px-5 flex gap-2 mb-5">
        {Object.entries(modeConfig).map(([k, cfg]) => {
          const active = mode === k;
          return (
            <button key={k} onClick={() => setMode(k)}
              className={`flex-1 py-3.5 rounded-2xl text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
                active ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_4px_20px_rgba(220,38,38,0.2)]' : 'bg-white text-gray-500 border border-gray-200'
              }`}>
              <cfg.icon className="w-4 h-4" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Description */}
      <div className="px-5 mb-4">
        <p className="text-[13px] text-gray-400">{modeConfig[mode]?.desc}</p>
      </div>

      {/* Service List */}
      <div className="px-5 space-y-2 pb-24">
        {filtered.map((svc, i) => (
          <button key={svc.service_type} onClick={() => onRequestService(svc.service_type)}
            className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-card flex items-center gap-4 text-left hover:shadow-card-hover active:scale-[0.99] transition-all animate-fade-up"
            style={{ animationDelay: `${i * 40}ms` }}>
            <div className="w-13 h-13 rounded-2xl bg-gray-50 flex items-center justify-center text-[26px] flex-shrink-0 w-[52px] h-[52px]">
              {icon(svc.service_type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-gray-900">{svc.display_name}</p>
              <p className="text-[13px] text-gray-400 mt-0.5 truncate">{svc.description || 'Professional service'}</p>
            </div>
            <div className="text-right flex-shrink-0 mr-1">
              {svc.pricing_model === 'quote_required' ? (
                <span className="text-[13px] text-red-600 font-semibold">Get Quote</span>
              ) : (
                <span className="text-[17px] font-bold text-red-600">${(svc.base_fee_cents / 100).toFixed(0)}{svc.pricing_model === 'base_plus_miles' ? '+' : ''}</span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-gray-300 text-[14px]">No services in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesTab;
