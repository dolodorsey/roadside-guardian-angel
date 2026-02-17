import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { supabase, subscribeToJob, subscribeToProviderLocation, STATUS_LABELS, jobSafety, cancelJob } from '@/lib/supabase';
import { Phone, MessageCircle, Share2, AlertTriangle, Shield, X, Star, DollarSign, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface LiveRescueProps {
  jobId: string;
  onComplete: () => void;
  onClose: () => void;
}

const LiveRescue: React.FC<LiveRescueProps> = ({ jobId, onComplete, onClose }) => {
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [providerLoc, setProviderLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [pickupLoc, setPickupLoc] = useState<{ lat: number; lng: number }>({ lat: 33.749, lng: -84.388 });
  const [showSafety, setShowSafety] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [rating, setRating] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);

  useEffect(() => {
    if (jobId.startsWith('demo-')) {
      // Demo mode
      setJob({ status: 'matching', service_type: 'tow', price_cents: 8900 });
      setTimeout(() => setJob((j: any) => ({ ...j, status: 'assigned' })), 3000);
      setTimeout(() => setJob((j: any) => ({ ...j, status: 'en_route' })), 6000);
      setTimeout(() => setJob((j: any) => ({ ...j, status: 'on_site' })), 12000);
      setTimeout(() => setJob((j: any) => ({ ...j, status: 'in_progress' })), 15000);
      return;
    }

    // Fetch job
    supabase.from('jobs').select('*').eq('id', jobId).single().then(({ data }) => {
      if (data) {
        setJob(data);
        setPickupLoc({ lat: data.pickup_lat, lng: data.pickup_lng });
      }
    });

    // Subscribe to job updates
    const jobSub = subscribeToJob(jobId, (payload) => {
      setJob(payload.new);
      if (payload.new.status === 'completed') {
        setShowTip(true);
      }
    });

    // Subscribe to provider location
    const locSub = subscribeToProviderLocation(jobId, (payload) => {
      const loc = payload.new;
      setProviderLoc({ lat: loc.lat, lng: loc.lng });
    });

    return () => {
      supabase.removeChannel(jobSub);
      supabase.removeChannel(locSub);
    };
  }, [jobId]);

  // Fetch provider when assigned
  useEffect(() => {
    if (job?.status && ['assigned', 'en_route', 'on_site', 'in_progress', 'completed'].includes(job.status)) {
      supabase.from('job_assignments').select('provider_id').eq('job_id', jobId).single().then(async ({ data }) => {
        if (data) {
          const { data: prof } = await supabase.from('profiles').select('*').eq('id', data.provider_id).single();
          const { data: pp } = await supabase.from('provider_profiles').select('*').eq('provider_id', data.provider_id).single();
          if (prof && pp) setProvider({ ...prof, ...pp });
        }
      });
    }
  }, [job?.status, jobId]);

  const handlePanic = async () => {
    if (confirm('This will alert our operations team and create a safety incident. Continue?')) {
      await jobSafety(jobId, 'panic');
    }
  };

  const handleCancel = async () => {
    if (confirm('Cancel this rescue?')) {
      await cancelJob(jobId, 'customer_request');
      onClose();
    }
  };

  const status = job?.status || 'matching';
  const statusLabel = STATUS_LABELS[status] || status;
  const isActive = ['matching', 'offered', 'assigned', 'en_route', 'on_site', 'in_progress'].includes(status);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Map */}
      <div className="flex-1 relative">
        {GOOGLE_MAPS_KEY ? (
          <APIProvider apiKey={GOOGLE_MAPS_KEY}>
            <Map defaultCenter={pickupLoc} defaultZoom={14} disableDefaultUI colorScheme="DARK" className="w-full h-full" gestureHandling="greedy">
              <Marker position={pickupLoc} />
              {providerLoc && <Marker position={providerLoc} />}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full bg-zinc-900" />
        )}

        {/* Close / Cancel */}
        <button
          onClick={isActive ? handleCancel : onClose}
          className="absolute top-safe left-5 mt-4 w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Safety Controls */}
        <div className="absolute top-safe right-5 mt-4 flex flex-col gap-2">
          <button
            onClick={() => jobSafety(jobId, 'share', { contacts: [] })}
            className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur flex items-center justify-center"
          >
            <Share2 className="w-4.5 h-4.5 text-blue-400" />
          </button>
          <button
            onClick={handlePanic}
            className="w-10 h-10 rounded-full bg-red-600/80 backdrop-blur flex items-center justify-center"
          >
            <AlertTriangle className="w-4.5 h-4.5 text-white" />
          </button>
          <button
            onClick={() => jobSafety(jobId, 'safe_mode', { enabled: true })}
            className="w-10 h-10 rounded-full bg-zinc-900/80 backdrop-blur flex items-center justify-center"
          >
            <Shield className="w-4.5 h-4.5 text-orange-400" />
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`px-5 py-3 ${
        ['matching', 'offered'].includes(status) ? 'bg-orange-500' :
        ['assigned', 'en_route'].includes(status) ? 'bg-blue-600' :
        ['on_site', 'in_progress'].includes(status) ? 'bg-green-600' :
        status === 'completed' ? 'bg-emerald-600' : 'bg-zinc-800'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {['matching', 'offered'].includes(status) && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
            <span className="text-white font-semibold text-sm">{statusLabel}</span>
          </div>
          {job?.price_cents && (
            <span className="text-white/80 text-sm">${(job.price_cents / 100).toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-zinc-950 border-t border-zinc-800/50">
        {/* Provider Card (when assigned) */}
        {provider && ['assigned', 'en_route', 'on_site', 'in_progress'].includes(status) && (
          <div className="px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-2xl overflow-hidden">
                {provider.photo_url ? (
                  <img src={provider.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-400 font-bold text-lg">
                    {(provider.full_name || 'S')[0]}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{provider.full_name || 'Your Superhero'}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-zinc-400 text-xs">{provider.rating_avg || '5.0'}</span>
                  </div>
                  <span className="text-zinc-700">•</span>
                  <span className="text-zinc-400 text-xs">{provider.jobs_completed || 0} rescues</span>
                  {provider.is_female_first_eligible && (
                    <>
                      <span className="text-zinc-700">•</span>
                      <Shield className="w-3 h-3 text-pink-400" />
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center">
                  <Phone className="w-4.5 h-4.5 text-green-400" />
                </button>
                <button className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center">
                  <MessageCircle className="w-4.5 h-4.5 text-blue-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Matching animation */}
        {['matching', 'offered'].includes(status) && (
          <div className="px-5 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-orange-500 animate-ping" />
            </div>
            <p className="text-white font-medium">Finding a Superhero...</p>
            <p className="text-zinc-500 text-sm mt-1">Searching for the closest available provider</p>
          </div>
        )}

        {/* Completed: Rate + Tip */}
        {status === 'completed' && (
          <div className="px-5 py-6 text-center">
            <p className="text-emerald-400 font-semibold text-lg mb-4">Rescue Complete!</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setRating(i)}>
                  <Star className={`w-8 h-8 ${i <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-700'}`} />
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-center mb-4">
              {[0, 300, 500, 1000].map(cents => (
                <button
                  key={cents}
                  onClick={() => setTipAmount(cents)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    tipAmount === cents ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {cents === 0 ? 'No tip' : `$${(cents / 100).toFixed(0)}`}
                </button>
              ))}
            </div>
            <button
              onClick={onComplete}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-xl"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveRescue;
