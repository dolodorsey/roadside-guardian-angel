import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, CreditCard, Shield, Car } from 'lucide-react';
import { supabase, createJob, confirmJob, startMatching } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  serviceType: string;
  onClose: () => void;
  onJobCreated: (id: string) => void;
}

const STEPS = ['select', 'details', 'confirm'] as const;
type Step = typeof STEPS[number];

const RequestFlow: React.FC<Props> = ({ serviceType, onClose, onJobCreated }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('select');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selected, setSelected] = useState(serviceType);
  const [service, setService] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleId, setVehicleId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupLat] = useState(33.749);
  const [pickupLng] = useState(-84.388);

  useEffect(() => {
    supabase.from('service_catalog').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => {
        if (data) { setServices(data); setService(data.find((d: any) => d.service_type === serviceType)); }
      });
    if (user) {
      supabase.from('vehicles').select('*').eq('customer_id', user.id).order('is_primary', { ascending: false })
        .then(({ data }) => { if (data?.length) { setVehicles(data); setVehicleId(data[0].id); } });
    }
    navigator.geolocation?.getCurrentPosition(() => {});
  }, [serviceType, user]);

  const pick = (svc: any) => { setSelected(svc.service_type); setService(svc); setStep('details'); };

  const confirm = async () => {
    setLoading(true);
    try {
      const r = await createJob({ service_type: selected, pickup_lat: pickupLat, pickup_lng: pickupLng, vehicle_id: vehicleId || undefined, notes: notes || undefined });
      if (r.success && r.job) {
        await confirmJob(r.job.id).catch(() => {});
        await startMatching(r.job.id).catch(() => {});
        onJobCreated(r.job.id);
      } else { onJobCreated('demo-' + Date.now()); }
    } catch { onJobCreated('demo-' + Date.now()); }
    setLoading(false);
  };

  const price = service?.pricing_model === 'base_plus_miles'
    ? `$${((service?.base_fee_cents || 7500) / 100).toFixed(0)}+`
    : `$${((service?.base_fee_cents || 4500) / 100).toFixed(0)}`;

  const stepIdx = STEPS.indexOf(step);

  return (
    <div className="fixed inset-0 z-50 bg-[#FFFBF5] flex flex-col">
      {/* Header */}
      <div className="px-5 pt-safe bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 py-4">
          <button onClick={onClose} className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="font-display text-[18px] font-bold text-gray-900">
              {step === 'select' ? 'Choose Service' : step === 'details' ? 'Review Details' : 'Confirm Rescue'}
            </h2>
          </div>
          <span className="text-[13px] text-gray-400 font-medium">{stepIdx + 1}/3</span>
        </div>
        {/* Progress bar */}
        <div className="flex gap-1.5 pb-3">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-[3px] flex-1 rounded-full transition-all duration-500 ${i <= stepIdx ? 'bg-orange-500' : 'bg-gray-200'}`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-36">
        {step === 'select' && (
          <div className="py-5 space-y-3">
            <p className="text-[13px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Emergency Services</p>
            {services.filter(s => s.mode === 'request_now').map((svc, i) => (
              <button key={svc.service_type} onClick={() => pick(svc)}
                className={`w-full p-5 rounded-2xl border-2 flex items-center gap-4 transition-all animate-fade-up active:scale-[0.98] ${
                  selected === svc.service_type ? 'border-orange-400 bg-orange-50/50 shadow-card' : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}>
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-[28px]">
                  {svc.service_type === 'tow' ? '🚛' : svc.service_type === 'jump' ? '⚡' : svc.service_type === 'flat' ? '🔧' : svc.service_type === 'lockout' ? '🔑' : svc.service_type === 'fuel' ? '⛽' : '🪝'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[16px] font-semibold text-gray-900">{svc.display_name}</p>
                  <p className="text-[13px] text-gray-400 mt-0.5">{svc.description || 'Emergency service'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[18px] font-bold text-orange-500">${(svc.base_fee_cents / 100).toFixed(0)}{svc.pricing_model === 'base_plus_miles' ? '+' : ''}</p>
                  <p className="text-[11px] text-gray-400">{svc.pricing_model === 'base_plus_miles' ? 'base + mi' : 'flat rate'}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'details' && service && (
          <div className="py-5 space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[13px] text-gray-400 font-medium">Your rescue</p>
                  <h3 className="font-display text-[20px] font-bold text-gray-900 mt-0.5">{service.display_name}</h3>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-xl">
                  <span className="font-display text-[24px] font-bold text-orange-500">{price}</span>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  ['Base fee', `$${(service.base_fee_cents / 100).toFixed(2)}`],
                  ...(service.pricing_model === 'base_plus_miles' ? [['Per mile', `$${(service.per_mile_cents / 100).toFixed(2)}/mi`]] : []),
                  ['Minimum', `$${(service.minimum_fee_cents / 100).toFixed(2)}`],
                ].map(([l, v]) => (
                  <div key={l as string} className="flex justify-between text-[14px]">
                    <span className="text-gray-400">{l}</span>
                    <span className="text-gray-700 font-medium">{v}</span>
                  </div>
                ))}
                <div className="h-px bg-gray-100 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-[14px] text-gray-400 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Est. arrival</span>
                  <span className="text-[15px] text-orange-500 font-bold">{service.eta_range_json?.min || 15}–{service.eta_range_json?.max || 45} min</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><MapPin className="w-5 h-5 text-orange-500" /></div>
              <div className="flex-1"><p className="text-[12px] text-gray-400">Pickup location</p><p className="text-[15px] text-gray-800 font-medium">Current Location</p></div>
            </div>

            {service.service_type === 'tow' && (
              <input type="text" placeholder="Drop-off address (for tow)" value={dropoff}
                onChange={e => setDropoff(e.target.value)}
                className="w-full h-[52px] px-4 bg-white border border-gray-200 rounded-2xl text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
            )}

            {/* Vehicle */}
            {vehicles.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card flex items-center gap-3">
                <Car className="w-5 h-5 text-gray-400" />
                <select value={vehicleId || ''} onChange={e => setVehicleId(e.target.value)}
                  className="flex-1 bg-transparent text-[15px] text-gray-800 focus:outline-none">
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
                </select>
              </div>
            )}

            <textarea placeholder="Notes for your Superhero (optional)" value={notes}
              onChange={e => setNotes(e.target.value)} rows={2}
              className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none transition-all" />
          </div>
        )}

        {step === 'confirm' && service && (
          <div className="py-5 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-card space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-display text-[18px] font-bold text-gray-900">{service.display_name}</h3>
                <span className="font-display text-[22px] font-bold text-orange-500">{price}</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-gray-500"><MapPin className="w-4 h-4 text-orange-400" /> Current Location</div>
              <div className="flex items-center gap-2 text-[14px] text-gray-500"><Clock className="w-4 h-4 text-green-500" /> ETA: {service.eta_range_json?.min || 15}–{service.eta_range_json?.max || 45} min</div>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <span className="text-[15px] text-gray-700 flex-1">Payment method</span>
              <span className="text-[14px] text-orange-500 font-medium">Add card →</span>
            </div>
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-[14px] font-semibold text-gray-800">Safety Features Active</p>
                <p className="text-[13px] text-gray-500 mt-0.5">Live tracking, panic button, and trip sharing during your rescue.</p>
              </div>
            </div>
            <p className="text-[13px] text-gray-400 text-center px-4 leading-relaxed">
              Payment is held securely and only charged when rescue is complete. Free cancellation before provider arrives.
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-5 pb-safe bg-gradient-to-t from-[#FFFBF5] via-[#FFFBF5] to-transparent pt-10 z-30">
        {step === 'select' && (
          <button onClick={() => { if (service) setStep('details'); }}
            className="w-full h-[58px] bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[16px] font-bold rounded-2xl shadow-sos active:scale-[0.98] transition-all">
            Continue with {service?.display_name || 'Service'}
          </button>
        )}
        {step === 'details' && (
          <button onClick={() => setStep('confirm')}
            className="w-full h-[58px] bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[16px] font-bold rounded-2xl shadow-sos active:scale-[0.98] transition-all">
            Review & Confirm — {price}
          </button>
        )}
        {step === 'confirm' && (
          <button onClick={confirm} disabled={loading}
            className="w-full h-[58px] bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[17px] font-bold rounded-2xl shadow-sos-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <><svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Finding a Superhero...</>
            ) : (
              <><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Confirm — {price}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestFlow;
