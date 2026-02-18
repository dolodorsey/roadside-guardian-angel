import React, { useState, useEffect } from 'react';
import { supabase, subscribeToJob, rateJob, cancelJob } from '@/lib/supabase';
import { STATUS_LABELS } from '@/lib/supabase';
import { X, Phone, MessageSquare, Share2, Shield, AlertTriangle, Star, ChevronRight, Clock, MapPin, Zap, CheckCircle } from 'lucide-react';

interface Props {
  jobId: string;
  onComplete: () => void;
  onClose: () => void;
}

const TIMELINE_STEPS = [
  { key: 'assigned', label: 'Hero Assigned', icon: Star },
  { key: 'en_route', label: 'En Route', icon: MapPin },
  { key: 'on_site', label: 'On Site', icon: Zap },
  { key: 'in_progress', label: 'In Progress', icon: Clock },
  { key: 'completed', label: 'Complete', icon: CheckCircle },
];

const LiveRescue: React.FC<Props> = ({ jobId, onComplete, onClose }) => {
  const [job, setJob] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [tipCents, setTipCents] = useState(500);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showUpsell, setShowUpsell] = useState(false);

  const isDemo = jobId.startsWith('demo-');

  // Demo simulation
  useEffect(() => {
    if (!isDemo) {
      supabase.from('jobs').select('*, service_catalog(display_name, icon_name)').eq('id', jobId).single()
        .then(({ data }) => setJob(data));
      const sub = subscribeToJob(jobId, payload => setJob(payload.new));
      return () => { sub.then(s => supabase.removeChannel(s)); };
    } else {
      // Demo mode
      const statuses = ['matching','assigned','en_route','on_site','in_progress','completed'];
      const delays = [0, 2000, 4000, 7000, 10000, 15000];
      statuses.forEach((s, i) => {
        setTimeout(() => {
          setJob((prev: any) => ({ ...prev, status: s, price_cents: 4500 }));
          if (s === 'assigned') {
            setProvider({ full_name: 'Marcus J.', rating_avg: 4.9, jobs_completed: 247, 
              hero_level: 'elite', response_time_avg: 8, badges_json: ['Verified','Top Rated','Fast Response'],
              bio: '5+ years roadside experience. ASE certified.' });
          }
        }, delays[i]);
      });
      setJob({ status: 'matching', price_cents: 4500, service_type: 'jump_standard' });
    }
  }, [jobId]);

  const handleRate = async () => {
    if (!isDemo) await rateJob(jobId, rating, '', tipCents).catch(() => {});
    setShowUpsell(true);
  };

  const handleDone = () => onComplete();

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages(m => [...m, { sender_role: 'customer', message: chatInput, created_at: new Date().toISOString() }]);
    setChatInput('');
    // Simulate provider response
    setTimeout(() => {
      setMessages(m => [...m, { sender_role: 'provider', message: 'On my way! I\'ll be there soon.', created_at: new Date().toISOString() }]);
    }, 2000);
  };

  const status = job?.status || 'matching';
  const isSearching = ['matching', 'offered', 'created', 'requested'].includes(status);
  const isActive = ['assigned', 'en_route', 'on_site', 'in_progress'].includes(status);
  const isDone = status === 'completed';
  const stepIdx = TIMELINE_STEPS.findIndex(s => s.key === status);

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF5] flex flex-col">
      {/* Header */}
      <div className="pt-safe bg-white border-b border-gray-100">
        <div className="px-5 py-3 flex items-center gap-3">
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-gray-900">
              {STATUS_LABELS[status] || status}
            </p>
            <p className="text-[11px] text-gray-400">Mission #{jobId.slice(0, 8)}</p>
          </div>
          <div className="flex gap-1.5">
            <button className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center"><Share2 className="w-4 h-4 text-blue-500" /></button>
            <button className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-red-500" /></button>
            <button className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center"><Shield className="w-4 h-4 text-red-500" /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* SEARCHING STATE */}
        {isSearching && (
          <div className="px-5 py-12 text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-red-200/40 rounded-full animate-sos-ring" />
              <div className="absolute inset-2 bg-red-100/60 rounded-full animate-sos-ring" style={{ animationDelay: '0.5s' }} />
              <div className="relative w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                <span className="text-[40px] animate-truck-bounce">🚛</span>
              </div>
            </div>
            <p className="text-[20px] font-bold text-gray-900 mb-2">Finding Your Hero</p>
            <p className="text-[14px] text-gray-400">Matching you with the fastest verified hero nearby...</p>
            <div className="mt-6 flex items-center justify-center gap-6 text-[12px] text-gray-400">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-red-500" /> Verified</span>
              <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-red-500" /> Fastest Match</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-red-500" /> Top Rated</span>
            </div>
          </div>
        )}

        {/* ACTIVE: Hero Profile + Timeline */}
        {isActive && provider && (
          <div className="px-5 py-4 space-y-4">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-[20px] font-bold">
                  {provider.full_name?.charAt(0) || 'H'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[17px] font-bold text-gray-900">{provider.full_name}</p>
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[9px] font-bold rounded uppercase">{provider.hero_level}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-0.5 text-[12px] text-gray-500">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {provider.rating_avg}
                    </span>
                    <span className="text-[12px] text-gray-400">{provider.jobs_completed} missions</span>
                    <span className="text-[12px] text-gray-400">{provider.response_time_avg}min avg</span>
                  </div>
                </div>
              </div>
              {/* Badges */}
              {provider.badges_json?.length > 0 && (
                <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-50">
                  {provider.badges_json.map((b: string) => (
                    <span key={b} className="px-2 py-1 bg-gray-50 text-[10px] font-medium text-gray-600 rounded-lg">{b}</span>
                  ))}
                </div>
              )}
              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button className="flex-1 h-[44px] bg-green-50 text-green-600 rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold">
                  <Phone className="w-4 h-4" /> Call
                </button>
                <button onClick={() => setShowChat(!showChat)}
                  className="flex-1 h-[44px] bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold">
                  <MessageSquare className="w-4 h-4" /> Chat
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
              <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Mission Progress</p>
              <div className="space-y-0">
                {TIMELINE_STEPS.map((step, i) => {
                  const isCompleted = stepIdx >= i;
                  const isCurrent = stepIdx === i;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCompleted ? 'bg-red-600' : 'bg-gray-100'
                        } ${isCurrent ? 'ring-4 ring-red-100' : ''}`}>
                          <Icon className={`w-4 h-4 ${isCompleted ? 'text-white' : 'text-gray-300'}`} />
                        </div>
                        {i < TIMELINE_STEPS.length - 1 && (
                          <div className={`w-0.5 h-6 ${isCompleted ? 'bg-red-600' : 'bg-gray-100'}`} />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <p className={`text-[13px] font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
                <div className="max-h-[200px] overflow-y-auto p-3 space-y-2">
                  {messages.length === 0 && <p className="text-[13px] text-gray-400 text-center py-4">No messages yet</p>}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-xl text-[14px] ${
                        m.sender_role === 'customer' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-800'
                      }`}>{m.message}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 p-3 border-t border-gray-100">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..." 
                    className="flex-1 h-[40px] px-3 bg-gray-50 rounded-xl text-[14px] border-0 focus:outline-none" />
                  <button onClick={sendMessage} className="px-4 h-[40px] bg-red-600 text-white rounded-xl text-[13px] font-semibold">Send</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMPLETED: Rate + Tip + Upsell */}
        {isDone && !showUpsell && (
          <div className="px-5 py-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <p className="text-[22px] font-bold text-gray-900 mb-1">Mission Complete!</p>
            <p className="text-[14px] text-gray-400 mb-6">How was your experience?</p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-5">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)} className="p-1 active:scale-90 transition-transform">
                  <Star className={`w-10 h-10 transition-colors ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                </button>
              ))}
            </div>

            {/* Tip */}
            <p className="text-[13px] text-gray-500 mb-3">Add a tip for your hero?</p>
            <div className="flex gap-2 justify-center mb-6">
              {[0, 300, 500, 1000, 2000].map(c => (
                <button key={c} onClick={() => setTipCents(c)}
                  className={`px-5 py-3 rounded-xl text-[14px] font-semibold transition-all ${
                    tipCents === c ? 'bg-red-600 text-white shadow-[0_4px_20px_rgba(220,38,38,0.25)]' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {c === 0 ? 'None' : `$${c / 100}`}
                </button>
              ))}
            </div>

            {/* Receipt Summary */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card text-left mb-6 mx-2">
              <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Receipt</p>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[14px]">
                  <span className="text-gray-600">Service</span>
                  <span className="font-semibold text-gray-900">${((job?.price_cents || 4500) / 100).toFixed(2)}</span>
                </div>
                {tipCents > 0 && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-gray-600">Tip</span>
                    <span className="font-semibold text-gray-900">${(tipCents / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[15px] pt-2 border-t border-gray-100">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">${(((job?.price_cents || 4500) + tipCents) / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button onClick={handleRate}
              className="w-full h-[56px] bg-gradient-to-r from-red-600 to-red-700 text-white text-[16px] font-bold rounded-2xl shadow-[0_4px_24px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all">
              Submit & Continue
            </button>
          </div>
        )}

        {/* HERO PASS UPSELL */}
        {showUpsell && (
          <div className="px-5 py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
              <Star className="w-8 h-8 text-white" fill="white" />
            </div>
            <p className="text-[20px] font-bold text-gray-900 mb-1">Save on every mission</p>
            <p className="text-[14px] text-gray-400 mb-6">Hero Pass members get priority dispatch + up to 25% off</p>
            
            <div className="space-y-2 mb-6">
              {[
                { name: 'Hero Pass', price: '$9.99/mo', desc: '10% off + priority dispatch' },
                { name: 'Hero Pass+', price: '$19.99/mo', desc: '4 free tows + 15% off everything' },
                { name: 'Hero Pass Family', price: '$29.99/mo', desc: '5 vehicles + 20% off' },
              ].map(p => (
                <button key={p.name} className="w-full bg-white rounded-xl p-4 border border-gray-100 shadow-card flex items-center gap-3 text-left">
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-gray-900">{p.name}</p>
                    <p className="text-[12px] text-gray-400">{p.desc}</p>
                  </div>
                  <span className="text-[14px] font-bold text-red-600">{p.price}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>

            <button onClick={handleDone}
              className="w-full h-[56px] bg-gradient-to-r from-red-600 to-red-700 text-white text-[16px] font-bold rounded-2xl shadow-[0_4px_24px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all mb-3">
              Explore Hero Pass
            </button>
            <button onClick={handleDone} className="text-[14px] text-gray-400 font-medium">Maybe later</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveRescue;
