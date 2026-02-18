import React, { useState, useEffect } from 'react';
import { supabase, createJob, startMatching } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MapPin, Car, Camera, MessageSquare, ChevronDown, Navigation } from 'lucide-react';

interface Props {
  serviceType: string;
  onClose: () => void;
  onJobCreated: (jobId: string) => void;
}

const RequestFlow: React.FC<Props> = ({ serviceType, onClose, onJobCreated }) => {
  const { user } = useAuth();
  const [service, setService] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [address, setAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [lat, setLat] = useState(33.749);
  const [lng, setLng] = useState(-84.388);
  const [dropLat, setDropLat] = useState<number | undefined>();
  const [dropLng, setDropLng] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);
  const [showVehicles, setShowVehicles] = useState(false);

  useEffect(() => {
    // Load service
    supabase.from('service_catalog').select('*').eq('service_type', serviceType).single()
      .then(({ data }) => { if (data) setService(data); });
    // Load vehicles
    supabase.from('vehicles').select('*').eq('customer_id', user?.id).then(({ data }) => {
      if (data?.length) { setVehicles(data); setSelectedVehicle(data[0].id); }
    });
    // GPS
    navigator.geolocation?.getCurrentPosition(pos => {
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
      const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (key) {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${pos.coords.latitude},${pos.coords.longitude}&key=${key}`)
          .then(r => r.json()).then(d => { if (d.results?.[0]) setAddress(d.results[0].formatted_address.split(',').slice(0,2).join(',')); })
          .catch(() => setAddress('Current Location'));
      } else setAddress('Current Location');
    });
  }, [serviceType, user?.id]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const payload: any = {
        service_type: serviceType,
        pickup_lat: lat, pickup_lng: lng,
        pickup_address: address || 'Current Location',
        notes,
      };
      if (selectedVehicle) payload.vehicle_id = selectedVehicle;
      if (dropLat && dropLng) {
        payload.dropoff_lat = dropLat;
        payload.dropoff_lng = dropLng;
        payload.dropoff_address = dropoffAddress;
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
    } finally {
      setLoading(false);
    }
  };

  const price = service?.pricing_model === 'quote_required'
    ? null
    : service?.base_fee_cents ? service.base_fee_cents / 100 : null;

  const selectedCar = vehicles.find(v => v.id === selectedVehicle);

  const modeLabel = service?.mode === 'request_now' ? '⚡ Dispatch Hero' : service?.mode === 'schedule' ? '📅 Book Mission' : '💬 Request Quote';

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF5]">
      {/* Header */}
      <div className="px-5 pt-safe pb-4 bg-white border-b border-gray-100 flex items-center gap-3">
        <button onClick={onClose} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-[18px] font-display font-bold text-gray-900">{service?.display_name || 'Loading...'}</h1>
          {service?.description && <p className="text-[13px] text-gray-400 mt-0.5">{service.description}</p>}
        </div>
        {price && <span className="text-[20px] font-bold text-gray-900">${price}</span>}
      </div>

      <div className="px-5 pt-5 space-y-4 pb-32">
        {/* Location */}
        <div className="bg-white rounded-2xl p-4 ring-1 ring-gray-100 shadow-sm">
          <label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <MapPin className="w-3.5 h-3.5 text-red-500" /> Pickup Location
          </label>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <Navigation className="w-5 h-5 text-red-500 flex-shrink-0" />
            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
              placeholder="Enter address or use GPS"
              className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none" />
          </div>
          {serviceType === 'tow' && (
            <>
              <label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3 mt-4">
                <MapPin className="w-3.5 h-3.5 text-blue-500" /> Drop-off Location
              </label>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <input type="text" value={dropoffAddress} onChange={e => setDropoffAddress(e.target.value)}
                  placeholder="Where should we tow it?"
                  className="flex-1 bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none" />
              </div>
            </>
          )}
        </div>

        {/* Vehicle Selector */}
        <div className="bg-white rounded-2xl p-4 ring-1 ring-gray-100 shadow-sm">
          <label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <Car className="w-3.5 h-3.5 text-blue-500" /> Vehicle
          </label>
          {vehicles.length > 0 ? (
            <button onClick={() => setShowVehicles(!showVehicles)}
              className="w-full flex items-center justify-between bg-gray-50 rounded-xl p-3">
              <span className="text-[15px] text-gray-900">
                {selectedCar ? `${selectedCar.year} ${selectedCar.make} ${selectedCar.model}` : 'Select vehicle'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showVehicles ? 'rotate-180' : ''}`} />
            </button>
          ) : (
            <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
              <span className="text-[14px] text-gray-400">No vehicles saved</span>
              <button className="text-[13px] text-red-500 font-semibold">+ Add</button>
            </div>
          )}
          {showVehicles && vehicles.map(v => (
            <button key={v.id} onClick={() => { setSelectedVehicle(v.id); setShowVehicles(false); }}
              className={`w-full mt-2 flex items-center gap-3 p-3 rounded-xl transition-all ${
                v.id === selectedVehicle ? 'bg-red-50 ring-2 ring-red-400' : 'bg-gray-50'
              }`}>
              <span className="text-[20px]">🚗</span>
              <span className="text-[14px] font-medium text-gray-800">{v.year} {v.make} {v.model}</span>
              {v.color && <span className="text-[12px] text-gray-400 ml-auto">{v.color}</span>}
            </button>
          ))}
        </div>

        {/* Notes + Photos */}
        <div className="bg-white rounded-2xl p-4 ring-1 ring-gray-100 shadow-sm">
          <label className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
            <MessageSquare className="w-3.5 h-3.5 text-gray-400" /> Notes & Photos (optional)
          </label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Describe the issue, special instructions, etc."
            rows={3}
            className="w-full bg-gray-50 rounded-xl p-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none resize-none focus:ring-2 focus:ring-red-200 transition-all" />
          <button className="mt-3 flex items-center gap-2 px-4 py-2.5 bg-gray-50 rounded-xl text-[13px] text-gray-500 font-medium">
            <Camera className="w-4 h-4" /> Add Photos
          </button>
        </div>

        {/* Price Summary */}
        {price && (
          <div className="bg-white rounded-2xl p-4 ring-1 ring-gray-100 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-gray-500">{service?.display_name}</span>
              <span className="text-[14px] font-medium text-gray-900">${price.toFixed(2)}</span>
            </div>
            {service?.pricing_model === 'base_plus_miles' && (
              <p className="text-[12px] text-gray-400 mt-1">+ ${(service?.per_mile_cents || 0) / 100}/mile after base distance</p>
            )}
            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
              <span className="text-[15px] font-semibold text-gray-900">Estimated Total</span>
              <span className="text-[18px] font-bold text-gray-900">${price.toFixed(2)}</span>
            </div>
            {service?.included_text && (
              <p className="text-[12px] text-green-600 mt-2">✓ {service.included_text}</p>
            )}
          </div>
        )}

        {/* Safety Features */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-[13px] font-semibold text-green-800 mb-1">🛡️ Your safety is non-negotiable</p>
          <p className="text-[12px] text-green-600">Verified pros · Real-time GPS · Share rescue link · Panic button · 24/7 support</p>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-5 py-4 pb-safe z-30">
        <button onClick={handleConfirm} disabled={loading}
          className="w-full h-[58px] bg-gradient-to-r from-red-600 to-red-700 text-white text-[16px] font-bold rounded-2xl shadow-[0_4px_24px_rgba(220,38,38,0.25)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Finding your Superhero...
            </span>
          ) : (
            <>
              {modeLabel}
              {price ? ` — $${price.toFixed(2)}` : ''}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RequestFlow;
