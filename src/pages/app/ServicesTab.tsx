import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getServiceIcon } from '@/components/app/ServiceIcons';
import { Clock, Wrench, Sparkles, ChevronRight } from 'lucide-react';

interface ServicesTabProps {
  onRequestService: (serviceType: string) => void;
}

const modeConfig = {
  request_now: { label: 'Request Now', icon: Wrench, desc: 'Emergency services' },
  schedule: { label: 'Schedule', icon: Clock, desc: 'Book in advance' },
  consult_first: { label: 'Specialist', icon: Sparkles, desc: 'Custom work + quotes' },
};

const ServicesTab: React.FC<ServicesTabProps> = ({ onRequestService }) => {
  const [activeMode, setActiveMode] = useState<string>('request_now');
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('service_catalog').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { if (data) setServices(data); });
  }, []);

  const filtered = services.filter(s => s.mode === activeMode);

  return (
    <div className="min-h-screen bg-black pt-safe">
      <div className="px-5 py-6">
        <h1 className="text-2xl font-bold text-white">Services</h1>
        <p className="text-zinc-500 text-sm mt-1">Everything your car needs</p>
      </div>

      {/* Mode Tabs */}
      <div className="px-5 flex gap-2 mb-5">
        {Object.entries(modeConfig).map(([mode, cfg]) => (
          <button
            key={mode}
            onClick={() => setActiveMode(mode)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
              activeMode === mode
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {/* Service List */}
      <div className="px-5 space-y-3 pb-24">
        {filtered.map(svc => (
          <button
            key={svc.service_type}
            onClick={() => onRequestService(svc.service_type)}
            className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800/50 flex items-center gap-4 text-left hover:border-orange-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
              {(() => { const { Icon, gradient } = getServiceIcon(svc.service_type); return <div className={`w-full h-full rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}><Icon className="text-white" size={20} /></div>; })()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">{svc.display_name}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{svc.description || `${svc.pricing_model} pricing`}</p>
            </div>
            <div className="text-right flex-shrink-0">
              {svc.pricing_model === 'quote_required' ? (
                <span className="text-orange-400 text-xs font-medium">Get Quote</span>
              ) : (
                <span className="text-orange-400 text-sm font-semibold">
                  ${(svc.base_fee_cents / 100).toFixed(0)}{svc.pricing_model === 'base_plus_miles' ? '+' : ''}
                </span>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700 flex-shrink-0" />
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-zinc-500">No services available in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesTab;
