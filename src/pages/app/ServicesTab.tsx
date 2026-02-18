import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronRight, Clock, Search } from 'lucide-react';

const CATS: Record<string, { title: string; icon: string; color: string }> = {
  sos_rescue: { title: 'SOS Rescue', icon: '🚨', color: 'from-red-500 to-red-600' },
  mobile_mechanic: { title: 'Mobile Mechanic', icon: '🔧', color: 'from-blue-500 to-blue-600' },
  body_glass: { title: 'Body & Glass', icon: '🛡️', color: 'from-cyan-500 to-cyan-600' },
  detail_unit: { title: 'Detail Unit', icon: '✨', color: 'from-purple-500 to-purple-600' },
  convenience: { title: 'Convenience Ops', icon: '📦', color: 'from-orange-500 to-orange-600' },
  fleet_command: { title: 'Fleet Command', icon: '🏢', color: 'from-slate-500 to-slate-600' },
  seasonal: { title: 'Seasonal Ops', icon: '🌡️', color: 'from-teal-500 to-teal-600' },
  premium_concierge: { title: 'Premium Concierge', icon: '👑', color: 'from-amber-500 to-amber-600' },
};

interface Props { onRequestService: (t: string) => void; }

const ServicesTab: React.FC<Props> = ({ onRequestService }) => {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('service_catalog').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => { if (data) setServices(data); });
  }, []);

  const filtered = search
    ? services.filter(s => s.display_name.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase()))
    : services;

  const grouped = Object.entries(CATS).map(([catId, meta]) => ({
    ...meta, catId,
    services: filtered.filter(s => s.category === catId),
  })).filter(g => g.services.length > 0);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-safe pb-24">
      <div className="px-5 py-5">
        <h1 className="font-display text-[24px] font-bold text-gray-900">All Missions</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">64 services across 8 categories</p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
          <input type="text" placeholder="Search missions..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-[48px] pl-11 pr-4 bg-white border border-gray-200 rounded-2xl text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all" />
        </div>
      </div>

      {/* Grouped List */}
      <div className="px-5 space-y-4">
        {grouped.map(group => (
          <div key={group.catId}>
            <button onClick={() => setExpandedCat(expandedCat === group.catId ? null : group.catId)}
              className="w-full flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${group.color} flex items-center justify-center`}>
                <span className="text-[16px]">{group.icon}</span>
              </div>
              <span className="text-[14px] font-bold text-gray-900 flex-1 text-left">{group.title}</span>
              <span className="text-[12px] text-gray-400 mr-1">{group.services.length}</span>
              <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${expandedCat === group.catId || search ? 'rotate-90' : ''}`} />
            </button>
            {(expandedCat === group.catId || search) && (
              <div className="space-y-1.5 ml-12 mb-2">
                {group.services.map(svc => (
                  <button key={svc.service_type} onClick={() => onRequestService(svc.service_type)}
                    className="w-full bg-white rounded-xl p-3 border border-gray-100 flex items-center gap-3 text-left active:scale-[0.99] transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-gray-800">{svc.display_name}</p>
                      {svc.included_text && <p className="text-[11px] text-green-600 mt-0.5">{svc.included_text}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      {svc.pricing_model === 'quote_required'
                        ? <span className="text-[12px] text-red-600 font-semibold">Quote</span>
                        : <span className="text-[14px] font-bold text-gray-900">${(svc.base_fee_cents/100).toFixed(0)}{svc.pricing_model==='base_plus_miles'?'+':''}</span>
                      }
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
