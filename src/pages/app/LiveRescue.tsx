import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { supabase, subscribeToJob, subscribeToProviderLocation, STATUS_LABELS, jobSafety, cancelJob, rateJob } from '@/lib/supabase';
import { Phone, MessageCircle, Share2, AlertTriangle, Shield, X, Star } from 'lucide-react';

const GMAPS = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

interface Props { jobId: string; onComplete: () => void; onClose: () => void; }

const LiveRescue: React.FC<Props> = ({ jobId, onComplete, onClose }) => {
  const [job, setJob] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [provLoc, setProvLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [pickLoc] = useState({ lat: 33.749, lng: -84.388 });
  const [rating, setRating] = useState(0);
  const [tipCents, setTipCents] = useState(0);

  useEffect(() => {
    if (jobId.startsWith('demo-')) {
      setJob({ status: 'matching', service_type: 'tow', price_cents: 8900 });
      const t1 = setTimeout(() => setJob((j: any) => ({ ...j, status: 'assigned' })), 3000);
      const t2 = setTimeout(() => { setJob((j: any) => ({ ...j, status: 'en_route' })); setProvider({ full_name: 'Marcus T.', rating_avg: 4.9, jobs_completed: 127 }); }, 5000);
      const t3 = setTimeout(() => setJob((j: any) => ({ ...j, status: 'on_site' })), 10000);
      const t4 = setTimeout(() => setJob((j: any) => ({ ...j, status: 'in_progress' })), 13000);
      const t5 = setTimeout(() => setJob((j: any) => ({ ...j, status: 'completed' })), 18000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
    }
    supabase.from('jobs').select('*').eq('id', jobId).single().then(({ data }) => { if (data) setJob(data); });
    const s1 = subscribeToJob(jobId, p => { setJob(p.new); });
    const s2 = subscribeToProviderLocation(jobId, p => { setProvLoc({ lat: p.new.lat, lng: p.new.lng }); });
    return () => { supabase.removeChannel(s1); supabase.removeChannel(s2); };
  }, [jobId]);

  useEffect(() => {
    if (!job || jobId.startsWith('demo-')) return;
    if (['assigned','en_route','on_site','in_progress','completed'].includes(job.status)) {
      supabase.from('job_assignments').select('provider_id').eq('job_id', jobId).single().then(async ({ data }) => {
        if (!data) return;
        const [{ data: p }, { data: pp }] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', data.provider_id).single(),
          supabase.from('provider_profiles').select('*').eq('provider_id', data.provider_id).single(),
        ]);
        if (p && pp) setProvider({ ...p, ...pp });
      });
    }
  }, [job?.status]);

  const status = job?.status || 'matching';
  const label = STATUS_LABELS[status] || status;
  const isSearching = ['matching', 'offered'].includes(status);
  const isActive = ['assigned', 'en_route', 'on_site', 'in_progress'].includes(status);
  const isDone = status === 'completed';

  const statusColor = isSearching ? 'bg-amber-500' : isActive ? 'bg-blue-500' : isDone ? 'bg-green-500' : 'bg-gray-400';

  const handleRate = async () => {
    if (rating > 0 && !jobId.startsWith('demo-')) {
      await rateJob(jobId, rating, undefined, tipCents);
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FFFBF5] flex flex-col">
      {/* Map */}
      <div className="flex-1 relative">
        {GMAPS ? (
          <APIProvider apiKey={GMAPS}>
            <Map defaultCenter={pickLoc} defaultZoom={14} disableDefaultUI gestureHandling="greedy" className="w-full h-full">
              <Marker position={pickLoc} />
              {provLoc && <Marker position={provLoc} />}
            </Map>
          </APIProvider>
        ) : (
          <div className="w-full h-full bg-orange-50/30" />
        )}

        {/* Top controls */}
        <div className="absolute top-safe left-0 right-0 px-5 mt-4 flex justify-between">
          <button onClick={isActive || isSearching ? () => { if (confirm('Cancel this rescue?')) { cancelJob(jobId, 'user').catch(()=>{}); onClose(); } } : onClose}
            className="w-11 h-11 rounded-2xl bg-white border border-gray-200 shadow-card flex items-center justify-center">
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => jobSafety(jobId, 'share', { contacts: [] }).catch(()=>{})}
              className="w-11 h-11 rounded-2xl bg-white border border-gray-200 shadow-card flex items-center justify-center">
              <Share2 className="w-4.5 h-4.5 text-blue-500" />
            </button>
            <button onClick={() => { if (confirm('Trigger panic alert?')) jobSafety(jobId, 'panic').catch(()=>{}); }}
              className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 shadow-card flex items-center justify-center">
              <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
            </button>
            <button onClick={() => jobSafety(jobId, 'safe_mode', { enabled: true }).catch(()=>{})}
              className="w-11 h-11 rounded-2xl bg-white border border-gray-200 shadow-card flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-orange-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Pill */}
      <div className={`${statusColor} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {isSearching && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
          <span className="text-white text-[15px] font-bold">{label}</span>
        </div>
        {job?.price_cents && <span className="text-white/80 text-[14px] font-medium">${(job.price_cents / 100).toFixed(2)}</span>}
      </div>

      {/* Bottom Panel */}
      <div className="bg-white border-t border-gray-100">
        {/* Searching animation */}
        {isSearching && (
          <div className="py-10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 bg-orange-200/40 rounded-full animate-sos-ring" />
              <div className="absolute inset-2 bg-orange-100 rounded-full animate-sos-ring" style={{ animationDelay: '0.5s' }} />
              <div className="relative w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
                <span className="text-[36px] animate-truck-bounce">🚛</span>
              </div>
            </div>
            <p className="text-[17px] font-bold text-gray-900">Finding your Superhero...</p>
            <p className="text-[14px] text-gray-400 mt-1">Searching for the closest available provider</p>
          </div>
        )}

        {/* Provider card */}
        {(isActive || isDone) && provider && (
          <div className="px-5 py-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border-2 border-orange-200 flex items-center justify-center overflow-hidden">
                {provider.photo_url
                  ? <img src={provider.photo_url} alt="" className="w-full h-full object-cover" />
                  : <span className="text-[24px] font-bold text-orange-400">{(provider.full_name || 'S')[0]}</span>
                }
              </div>
              <div className="flex-1">
                <p className="text-[17px] font-bold text-gray-900">{provider.full_name || 'Your Superhero'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-[14px] text-gray-600 font-medium">{provider.rating_avg || '5.0'}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-[14px] text-gray-400">{provider.jobs_completed || 0} rescues</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-12 h-12 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </button>
                <button className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                </button>
              </div>
            </div>

            {/* Status steps */}
            {isActive && (
              <div className="mt-5 flex items-center gap-0">
                {['assigned', 'en_route', 'on_site', 'in_progress'].map((s, i) => {
                  const reached = ['assigned','en_route','on_site','in_progress'].indexOf(status) >= i;
                  return (
                    <React.Fragment key={s}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${reached ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {i + 1}
                      </div>
                      {i < 3 && <div className={`flex-1 h-[2px] ${reached ? 'bg-orange-500' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Completed: rate + tip */}
        {isDone && (
          <div className="px-5 pb-8 pt-2 text-center">
            <div className="w-16 h-16 mx-auto mb-3 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-[20px] font-bold text-gray-900 mb-4">Rescue Complete!</p>

            <p className="text-[14px] text-gray-500 mb-2">How was your experience?</p>
            <div className="flex justify-center gap-2 mb-5">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)} className="p-1 transition-transform active:scale-90">
                  <Star className={`w-9 h-9 ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} transition-colors`} />
                </button>
              ))}
            </div>

            <p className="text-[14px] text-gray-500 mb-2">Add a tip?</p>
            <div className="flex gap-2 justify-center mb-5">
              {[0, 300, 500, 1000, 2000].map(c => (
                <button key={c} onClick={() => setTipCents(c)}
                  className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all ${
                    tipCents === c ? 'bg-orange-500 text-white shadow-sos' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {c === 0 ? 'None' : `$${c / 100}`}
                </button>
              ))}
            </div>

            <button onClick={handleRate}
              className="w-full h-[56px] bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[16px] font-bold rounded-2xl shadow-sos active:scale-[0.98] transition-all">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveRescue;
