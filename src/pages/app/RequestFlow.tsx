import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, createJob, startMatching } from '@/lib/supabase';
import { ArrowLeft, MapPin, Car, Camera, ChevronDown, Clock, Shield, Zap, Plus, X } from 'lucide-react';

interface Props {
  serviceType: string;
  onClose: () => void;
  onJobCreated: (id: string) => void;
}

const RequestFlow: React.FC<Props> = ({ serviceType, onClose, onJobCreated }) => {
  const { user, profile } = useAuth();
  const [svc, setSvc] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(33.749);
  const [lng, setLng] = useState(-84.388);
  const [dropAddress, setDropAddress] = useState('');
  const [dropLat, setDropLat] = useState<number | null>(null);
  const [dropLng, setDropLng] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from('service_catalog').select('*').eq('service_type', serviceType).single()
      .then(({ data }) => setSvc(data));
    if (user) {
      supabase.from('vehicles').select('*').eq('customer_id', user.id).order('is_default', { ascending: false })
        .then(({ data }) => { if (data?.length) { setVehicles(data); setSelectedVehicle(data[0].id); }});
    }
    navigator.geolocation?.getCurrentPosition(pos => {
      setLat(pos.coords.latitude); setLng(pos.coords.longitude);
      setAddress('Current Location');
    });
  }, [serviceType, user]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (reader.result) setPhotos(p => [...p, reader.result as string]); };
    reader.readAsDataURL(file);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload: any = {
        service_type: serviceType,
        pickup_lat: lat, pickup_lng: lng,
        pickup_address: address || 'Current Location',
        notes: notes || undefined,
        vehicle_id: selectedVehicle || undefined,
      };
      if (dropLat && dropLng) {
        payload.dropoff_lat = dropLat;
        payload.dropoff_lng = dropLng;
        payload.dropoff_address = dropAddress;
      }
      const r = await createJob(payload);
      if (r.job?.id) {
        await startMatching(r.job.id).catch(() => {});
        onJobCreated(r.job.id);
      } else {
        onJobCreated('demo-' + Date.now());
      }
    } catch {
      onJobCreated('demo-' + Date.now());
    }
  };

  const vehicle = vehicles.find(v => v.id === selectedVehicle);
  const isNow = svc?.mode === 'request_now';
  const isQuote = svc?.pricing_model === 'quote_required';
  const needsDropoff = svc?.pricing_model === 'base_plus_miles';

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF5] flex flex-col">
      {/* Header */}
      <div className="pt-safe bg-white border-b border-gray-100">
        <div className="px-5 py-3 flex items-center gap-3">
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-display text-[17px] font-bold text-gray-900">{svc?.display_name || 'Loading...'}</h1>
            <p className="text-[12px] text-gray-400">{svc?.description}</p>
          </div>
          {isNow && (
            <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg">NOW</span>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Price Banner */}
        {svc && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">
                  {isQuote ? 'Custom Quote' : 'Estimated Price'}
                </p>
                {!isQuote && (
                  <p className="text-[28px] font-bold text-gray-900 font-display">
                    ${(svc.base_fee_cents / 100).toFixed(0)}
                    {needsDropoff && <span className="text-[16px] text-gray-400 font-normal">+/mi</span>}
                  </p>
                )}
                {isQuote && <p className="text-[18px] font-bold text-red-600 font-display">Request a Quote</p>}
              </div>
              {svc.eta_range_json?.min > 0 && (
                <div className="text-right">
                  <p className="text-[12px] text-gray-400">ETA</p>
                  <p className="text-[16px] font-bold text-gray-700 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-red-500" />
                    {svc.eta_range_json.min}–{svc.eta_range_json.max}m
                  </p>
                </div>
              )}
            </div>
            {svc.included_text && (
              <p className="mt-2 text-[12px] text-green-600 flex items-center gap-1 pt-2 border-t border-gray-50">
                <Shield className="w-3.5 h-3.5" /> {svc.included_text}
              </p>
            )}
          </div>
        )}

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card space-y-3">
          <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider">Location</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-red-500" />
            </div>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Pickup address" 
              className="flex-1 h-[44px] px-3 bg-gray-50 rounded-xl text-[15px] text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-red-100" />
          </div>
          {needsDropoff && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-blue-500" />
              </div>
              <input type="text" value={dropAddress} onChange={e => setDropAddress(e.target.value)}
                placeholder="Drop-off address"
                className="flex-1 h-[44px] px-3 bg-gray-50 rounded-xl text-[15px] text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-red-100" />
            </div>
          )}
        </div>

        {/* Vehicle */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
          <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Vehicle</p>
          {vehicle ? (
            <button onClick={() => setShowVehicles(!showVehicles)}
              className="w-full flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[15px] font-semibold text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                {vehicle.color && <p className="text-[12px] text-gray-400">{vehicle.color}</p>}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-300" />
            </button>
          ) : (
            <button className="w-full flex items-center gap-3 py-3 bg-gray-50 rounded-xl px-3">
              <Plus className="w-5 h-5 text-gray-400" />
              <span className="text-[14px] text-gray-500">Add vehicle (optional)</span>
            </button>
          )}
        </div>

        {/* Notes + Photos */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card space-y-3">
          <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider">Notes & Photos</p>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Describe the issue, location details, special instructions..."
            rows={3}
            className="w-full px-3 py-3 bg-gray-50 rounded-xl text-[15px] text-gray-900 placeholder-gray-400 border-0 resize-none focus:outline-none focus:ring-2 focus:ring-red-100" />
          <div className="flex gap-2 flex-wrap">
            {photos.map((p, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden">
                <img src={p} className="w-full h-full object-cover" />
                <button onClick={() => setPhotos(photos.filter((_, j) => j !== i))}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
            <button onClick={() => fileRef.current?.click()}
              className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-0.5">
              <Camera className="w-5 h-5 text-gray-300" />
              <span className="text-[9px] text-gray-300">Add</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
          </div>
        </div>

        {/* Safety Features */}
        <div className="bg-red-50 rounded-2xl p-3 border border-red-100 flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-gray-800">Safety features enabled</p>
            <p className="text-[11px] text-gray-500">Verified providers • GPS tracking • Trip sharing</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-4 pb-safe bg-white border-t border-gray-100">
        <button onClick={handleConfirm} disabled={loading}
          className="w-full h-[58px] bg-gradient-to-r from-red-600 to-red-700 text-white text-[16px] font-bold rounded-2xl shadow-[0_4px_24px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Dispatching...
            </span>
          ) : (
            <>
              <Zap className="w-5 h-5" fill="white" />
              {isQuote ? 'Request Quote' : isNow ? 'Dispatch Hero' : 'Book Mission'}
              {!isQuote && svc && <span className="opacity-70">— ${(svc.base_fee_cents / 100).toFixed(0)}{needsDropoff ? '+' : ''}</span>}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RequestFlow;
