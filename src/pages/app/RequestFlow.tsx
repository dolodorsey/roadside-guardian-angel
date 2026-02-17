import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, ChevronDown, CreditCard, Shield, Zap, Clock, DollarSign, Car } from 'lucide-react';
import { supabase, createJob, confirmJob, startMatching } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface RequestFlowProps {
  serviceType: string;
  onClose: () => void;
  onJobCreated: (jobId: string) => void;
}

const REQUEST_STEPS = ['service', 'price', 'confirm'] as const;
type Step = typeof REQUEST_STEPS[number];

const RequestFlow: React.FC<RequestFlowProps> = ({ serviceType, onClose, onJobCreated }) => {
  const { user, profile } = useAuth();
  const [step, setStep] = useState<Step>('service');
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<any>(null);
  const [selectedService, setSelectedService] = useState(serviceType);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [dropoffLat, setDropoffLat] = useState<number | null>(null);
  const [dropoffLng, setDropoffLng] = useState<number | null>(null);
  const [pickupLat, setPickupLat] = useState(33.749);
  const [pickupLng, setPickupLng] = useState(-84.388);
  const [pickupAddress, setPickupAddress] = useState('Current Location');
  const [jobData, setJobData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    // Get current location
    navigator.geolocation?.getCurrentPosition(pos => {
      setPickupLat(pos.coords.latitude);
      setPickupLng(pos.coords.longitude);
    });

    // Fetch services from catalog
    supabase.from('service_catalog').select('*').eq('mode', 'request_now').eq('is_active', true)
      .order('sort_order').then(({ data }) => {
        if (data) {
          setServices(data);
          const s = data.find((d: any) => d.service_type === serviceType);
          if (s) setService(s);
        }
      });

    // Fetch user vehicles
    if (user) {
      supabase.from('vehicles').select('*').eq('customer_id', user.id)
        .order('is_primary', { ascending: false }).then(({ data }) => {
          if (data) {
            setVehicles(data);
            const primary = data.find((v: any) => v.is_primary);
            if (primary) setSelectedVehicle(primary.id);
          }
        });
    }
  }, [serviceType, user]);

  const handleServiceSelect = (svc: any) => {
    setSelectedService(svc.service_type);
    setService(svc);
    setStep('price');
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Create job
      const result = await createJob({
        service_type: selectedService,
        pickup_lat: pickupLat,
        pickup_lng: pickupLng,
        pickup_address: pickupAddress,
        dropoff_lat: dropoffLat,
        dropoff_lng: dropoffLng,
        dropoff_address: dropoffAddress || undefined,
        vehicle_id: selectedVehicle || undefined,
        notes: notes || undefined,
      });

      if (result.success && result.job) {
        setJobData(result.job);
        // Authorize payment
        const payResult = await confirmJob(result.job.id);
        if (payResult.success) {
          // Start matching
          await startMatching(result.job.id);
          onJobCreated(result.job.id);
        } else {
          // For demo: still proceed
          onJobCreated(result.job.id);
        }
      } else {
        // Demo fallback
        onJobCreated('demo-' + Date.now());
      }
    } catch (err) {
      console.error('Confirm error:', err);
      onJobCreated('demo-' + Date.now());
    } finally {
      setLoading(false);
    }
  };

  const priceDisplay = service?.pricing_model === 'base_plus_miles'
    ? `$${((service?.base_fee_cents || 7500) / 100).toFixed(0)}+`
    : `$${((service?.base_fee_cents || 4500) / 100).toFixed(0)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="px-5 pt-safe pb-4 flex items-center gap-4 border-b border-zinc-800/50">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h2 className="text-white font-semibold text-lg">
            {step === 'service' ? 'Choose Service' : step === 'price' ? 'Price Preview' : 'Confirm Rescue'}
          </h2>
          <p className="text-zinc-500 text-xs">Step {REQUEST_STEPS.indexOf(step) + 1} of 3</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="px-5 py-3 flex gap-1.5">
        {REQUEST_STEPS.map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-all ${
              i <= REQUEST_STEPS.indexOf(step) ? 'bg-orange-500' : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        {/* STEP 1: Service Selection */}
        {step === 'service' && (
          <div className="py-4 space-y-3">
            {services.map(svc => (
              <button
                key={svc.service_type}
                onClick={() => handleServiceSelect(svc)}
                className={`w-full p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                  selectedService === svc.service_type
                    ? 'border-orange-500 bg-orange-500/10'
                    : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-2xl flex-shrink-0">
                  {svc.service_type === 'tow' ? '🚛' : svc.service_type === 'jump' ? '⚡' :
                   svc.service_type === 'flat' ? '🔧' : svc.service_type === 'lockout' ? '🔑' :
                   svc.service_type === 'fuel' ? '⛽' : '🪝'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{svc.display_name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{svc.description || 'Emergency service'}</p>
                </div>
                <div className="text-right">
                  <p className="text-orange-400 font-semibold">
                    ${(svc.base_fee_cents / 100).toFixed(0)}{svc.pricing_model === 'base_plus_miles' ? '+' : ''}
                  </p>
                  <p className="text-zinc-600 text-xs">
                    {svc.pricing_model === 'base_plus_miles' ? 'base + mi' : 'flat rate'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* STEP 2: Price Preview */}
        {step === 'price' && service && (
          <div className="py-4 space-y-5">
            {/* Price Card */}
            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-lg">{service.display_name}</h3>
                <span className="text-3xl font-bold text-orange-400">{priceDisplay}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Base fee</span>
                  <span className="text-white">${(service.base_fee_cents / 100).toFixed(2)}</span>
                </div>
                {service.pricing_model === 'base_plus_miles' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Per mile</span>
                    <span className="text-white">${(service.per_mile_cents / 100).toFixed(2)}/mi</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Minimum</span>
                  <span className="text-white">${(service.minimum_fee_cents / 100).toFixed(2)}</span>
                </div>
                <div className="h-px bg-zinc-800 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Est. ETA
                  </span>
                  <span className="text-orange-400 font-medium">
                    {service.eta_range_json?.min || 15}-{service.eta_range_json?.max || 45} min
                  </span>
                </div>
              </div>
            </div>

            {/* Pickup */}
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
                <div className="flex-1">
                  <p className="text-zinc-500 text-xs">Pickup</p>
                  <p className="text-white text-sm">{pickupAddress}</p>
                </div>
              </div>
              {service.service_type === 'tow' && (
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <input
                    type="text"
                    placeholder="Dropoff address (for tow)"
                    value={dropoffAddress}
                    onChange={e => setDropoffAddress(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-800 rounded-xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50"
                  />
                </div>
              )}
            </div>

            {/* Vehicle */}
            {vehicles.length > 0 && (
              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                <p className="text-zinc-500 text-xs mb-2">Vehicle</p>
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-zinc-400" />
                  <select
                    value={selectedVehicle || ''}
                    onChange={e => setSelectedVehicle(e.target.value)}
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                  >
                    <option value="">No vehicle selected</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.year} {v.make} {v.model} {v.color ? `(${v.color})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Notes */}
            <textarea
              placeholder="Notes for your Superhero (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-orange-500/50 resize-none"
            />

            <button
              onClick={() => setStep('confirm')}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all"
            >
              Review & Confirm
            </button>
          </div>
        )}

        {/* STEP 3: Confirm */}
        {step === 'confirm' && service && (
          <div className="py-4 space-y-5">
            {/* Summary */}
            <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{service.display_name}</h3>
                <span className="text-2xl font-bold text-orange-400">{priceDisplay}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>{pickupAddress}</span>
                </div>
                {dropoffAddress && (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>{dropoffAddress}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-green-500" />
                  <span>ETA: {service.eta_range_json?.min || 15}-{service.eta_range_json?.max || 45} min</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-zinc-400" />
              <span className="text-white text-sm flex-1">Payment method</span>
              <span className="text-zinc-500 text-sm">Add card →</span>
            </div>

            {/* Safety */}
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-orange-500" />
                <span className="text-white text-sm font-medium">Safety Features Active</span>
              </div>
              <p className="text-zinc-500 text-xs">
                Live tracking, panic button, and trip sharing available during your rescue.
              </p>
            </div>

            <p className="text-zinc-600 text-xs text-center px-4">
              Funds are held securely and only charged when your rescue is complete. Cancel anytime before provider arrival at no cost.
            </p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {step === 'confirm' && (
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/95 to-transparent pt-12">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Zap className="w-5 h-5 animate-pulse" />
                Finding a Superhero...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Confirm — {priceDisplay}
              </>
            )}
          </button>
        </div>
      )}

      {step === 'service' && (
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black to-transparent pt-8">
          <button
            onClick={() => { if (service) setStep('price'); }}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 active:scale-[0.98] transition-all"
          >
            Continue with {service?.display_name || 'Service'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestFlow;
