import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, CreditCard, Gift, Car, Shield, Bell, LogOut, Settings, Star, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

const BG = '#08080f';

// ═══════════════ ACTIVITY ═══════════════
export const ActivityTab: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from('jobs').select('*, service_catalog(display_name)').eq('customer_id', user.id)
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => { setJobs(data || []); setLoading(false); });
  }, [user]);

  const stColor: Record<string, string> = {
    completed: 'text-emerald-400 bg-emerald-400/10', in_progress: 'text-blue-400 bg-blue-400/10',
    en_route: 'text-blue-400 bg-blue-400/10', canceled_by_user: 'text-white/30 bg-white/5',
  };

  const icon = (t: string) => t === 'tow' ? '🚛' : t === 'jump' ? '⚡' : t === 'flat' ? '🔧' : t === 'lockout' ? '🔑' : t === 'fuel' ? '⛽' : '🪝';

  return (
    <div className="min-h-screen pt-safe" style={{ background: BG }}>
      <div className="px-5 py-5">
        <h1 className="text-[22px] font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Activity</h1>
        <p className="text-[13px] text-white/35 mt-0.5">Your rescue history</p>
      </div>
      {loading ? (
        <div className="px-5 space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)}</div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <History className="w-7 h-7 text-white/15" />
          </div>
          <p className="text-[16px] font-semibold text-white/25">No rescues yet</p>
          <p className="text-[14px] text-white/15 mt-1">Your rescue history will appear here</p>
        </div>
      ) : (
        <div className="px-5 space-y-2 pb-24">
          {jobs.map((job, i) => (
            <button key={job.id}
              className="w-full rounded-xl p-4 flex items-center gap-4 text-left transition-all active:scale-[0.99] animate-fade-up"
              style={{ animationDelay: `${i * 40}ms`, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[24px]" style={{ background: 'rgba(255,255,255,0.03)' }}>{icon(job.service_type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-white/80">{job.service_catalog?.display_name || job.service_type}</p>
                <p className="text-[12px] text-white/30 mt-0.5 truncate">{job.pickup_address || 'Unknown location'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[15px] font-bold text-white/80">{job.price_cents ? `$${(job.price_cents/100).toFixed(2)}` : '—'}</p>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${stColor[job.status] || 'text-white/30 bg-white/5'}`}>
                  {job.status?.replace(/_/g, ' ')}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════ WALLET ═══════════════
export const WalletTab: React.FC = () => {
  const { user } = useAuth();
  const [ledger, setLedger] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase.from('wallet_ledger').select('*').eq('customer_id', user.id)
      .order('created_at', { ascending: false }).limit(30)
      .then(({ data }) => { if (data) { setLedger(data); setBalance(data.reduce((s: number, e: any) => s + e.amount_cents, 0)); } });
  }, [user]);

  return (
    <div className="min-h-screen pt-safe" style={{ background: BG }}>
      <div className="px-5 py-5"><h1 className="text-[22px] font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Wallet</h1></div>

      {/* Balance Card */}
      <div className="mx-5 rounded-2xl p-6 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #ea580c 0%, #d97706 50%, #f97316 100%)',
        boxShadow: '0 8px 40px rgba(249,115,22,0.2)',
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)',
        }} />
        <p className="text-orange-100/70 text-[12px] font-medium relative z-10">S.O.S Balance</p>
        <p className="text-white text-[36px] font-bold mt-1 relative z-10" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          ${(Math.abs(balance) / 100).toFixed(2)}
        </p>
        <div className="mt-5 flex gap-3 relative z-10">
          <button className="flex-1 h-[40px] rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            <CreditCard className="w-4 h-4" /> Add Card
          </button>
          <button className="flex-1 h-[40px] rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            <Gift className="w-4 h-4" /> Promo Code
          </button>
        </div>
      </div>

      <div className="px-5 mt-6">
        <h3 className="text-[10px] font-bold text-white/25 uppercase tracking-[0.15em] mb-3">Transactions</h3>
        {ledger.length === 0 ? (
          <p className="text-white/15 text-[13px] py-10 text-center">No transactions yet</p>
        ) : (
          <div className="space-y-1 pb-24">
            {ledger.map(e => (
              <div key={e.id} className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center`}
                  style={{ background: e.amount_cents >= 0 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)' }}>
                  {e.amount_cents >= 0 ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] text-white/70 font-medium">{e.description || e.type}</p>
                  <p className="text-[11px] text-white/25">{new Date(e.created_at).toLocaleDateString()}</p>
                </div>
                <p className={`font-semibold text-[13px] ${e.amount_cents >= 0 ? 'text-emerald-400' : 'text-white/60'}`}>
                  {e.amount_cents >= 0 ? '+' : ''}${(e.amount_cents / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════ ACCOUNT ═══════════════
export const AccountTab: React.FC = () => {
  const { profile, signOut } = useAuth();

  const menu = [
    { icon: Car, label: 'My Vehicles', desc: 'Add or manage vehicles', color: '#3b82f6' },
    { icon: Shield, label: 'Safety Preferences', desc: 'Safe mode, Female-First', color: '#f97316' },
    { icon: Star, label: 'S.O.S+ Membership', desc: 'Unlock unlimited roadside', color: '#f59e0b' },
    { icon: Gift, label: 'Refer a Friend', desc: 'Give $10, get $10', color: '#22c55e' },
    { icon: Bell, label: 'Notifications', desc: 'Push, SMS, email', color: '#a855f7' },
    { icon: Settings, label: 'Settings', desc: 'Account & privacy', color: '#64748b' },
  ];

  return (
    <div className="min-h-screen pt-safe" style={{ background: BG }}>
      {/* Profile */}
      <div className="px-5 py-5 flex items-center gap-4">
        <div className="w-[62px] h-[62px] rounded-xl flex items-center justify-center overflow-hidden"
          style={{ background: 'rgba(249,115,22,0.08)', border: '2px solid rgba(249,115,22,0.2)' }}>
          {profile?.photo_url
            ? <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-[26px] font-bold text-orange-400/60">{(profile?.full_name || 'U')[0]}</span>
          }
        </div>
        <div>
          <h1 className="text-[20px] font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{profile?.full_name || 'User'}</h1>
          <p className="text-[13px] text-white/35">{profile?.email}</p>
        </div>
      </div>

      <div className="px-5 space-y-2 pb-24">
        {menu.map(item => (
          <button key={item.label}
            className="w-full flex items-center gap-3.5 py-3.5 px-4 rounded-xl transition-all active:scale-[0.99]"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${item.color}10` }}>
              <item.icon className="w-4.5 h-4.5" style={{ color: item.color }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-semibold text-white/80">{item.label}</p>
              <p className="text-[11px] text-white/30">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-white/10" />
          </button>
        ))}

        <button onClick={signOut}
          className="w-full flex items-center gap-3.5 py-3.5 px-4 mt-4 rounded-xl transition-all active:scale-[0.99]"
          style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.08)' }}>
            <LogOut className="w-4.5 h-4.5 text-red-400" />
          </div>
          <span className="text-[14px] font-semibold text-red-400">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
