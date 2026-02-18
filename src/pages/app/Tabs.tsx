import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, ChevronRight, CreditCard, Gift, Car, Shield, Bell, LogOut, Settings, Star, ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

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
    completed: 'text-green-600 bg-green-50', in_progress: 'text-blue-600 bg-blue-50',
    en_route: 'text-blue-600 bg-blue-50', canceled_by_user: 'text-gray-500 bg-gray-100',
  };

  const icon = (t: string) => t === 'tow' ? '🚛' : t === 'jump' ? '⚡' : t === 'flat' ? '🔧' : t === 'lockout' ? '🔑' : t === 'fuel' ? '⛽' : '🪝';

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-safe">
      <div className="px-5 py-6">
        <h1 className="font-display text-[24px] font-bold text-gray-900">Activity</h1>
        <p className="text-[14px] text-gray-400 mt-0.5">Your rescue history</p>
      </div>
      {loading ? (
        <div className="px-5 space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />)}</div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center"><History className="w-7 h-7 text-gray-300" /></div>
          <p className="text-[16px] font-semibold text-gray-400">No rescues yet</p>
          <p className="text-[14px] text-gray-300 mt-1">Your rescue history will appear here</p>
        </div>
      ) : (
        <div className="px-5 space-y-2 pb-24">
          {jobs.map((job, i) => (
            <button key={job.id}
              className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-card flex items-center gap-4 text-left hover:shadow-card-hover transition-all animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}>
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[24px]">{icon(job.service_type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-gray-900">{job.service_catalog?.display_name || job.service_type}</p>
                <p className="text-[13px] text-gray-400 mt-0.5 truncate">{job.pickup_address || 'Unknown location'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[15px] font-bold text-gray-900">{job.price_cents ? `$${(job.price_cents/100).toFixed(2)}` : '—'}</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${stColor[job.status] || 'text-gray-500 bg-gray-50'}`}>
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
    <div className="min-h-screen bg-[#FFFBF5] pt-safe">
      <div className="px-5 py-6"><h1 className="font-display text-[24px] font-bold text-gray-900">Wallet</h1></div>

      {/* Balance Card */}
      <div className="mx-5 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-6 shadow-[0_8px_40px_rgba(220,38,38,0.25)]">
        <p className="text-orange-100 text-[13px] font-medium">S.O.S Balance</p>
        <p className="text-white text-[40px] font-display font-bold mt-1">${(Math.abs(balance) / 100).toFixed(2)}</p>
        <div className="mt-5 flex gap-3">
          <button className="flex-1 h-[44px] bg-white/20 backdrop-blur rounded-xl text-white text-[14px] font-semibold flex items-center justify-center gap-1.5">
            <CreditCard className="w-4 h-4" /> Add Card
          </button>
          <button className="flex-1 h-[44px] bg-white/20 backdrop-blur rounded-xl text-white text-[14px] font-semibold flex items-center justify-center gap-1.5">
            <Gift className="w-4 h-4" /> Promo Code
          </button>
        </div>
      </div>

      <div className="px-5 mt-6">
        <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Transactions</h3>
        {ledger.length === 0 ? (
          <p className="text-gray-300 text-[14px] py-10 text-center">No transactions yet</p>
        ) : (
          <div className="space-y-1 pb-24">
            {ledger.map(e => (
              <div key={e.id} className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${e.amount_cents >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                  {e.amount_cents >= 0 ? <ArrowDownLeft className="w-4 h-4 text-green-500" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1"><p className="text-[14px] text-gray-800 font-medium">{e.description || e.type}</p><p className="text-[12px] text-gray-400">{new Date(e.created_at).toLocaleDateString()}</p></div>
                <p className={`font-semibold text-[14px] ${e.amount_cents >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
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
    { icon: Car, label: 'My Vehicles', desc: 'Add or manage vehicles', color: 'bg-blue-50 text-blue-500' },
    { icon: Shield, label: 'Safety Preferences', desc: 'Safe mode, Female-First', color: 'bg-red-50 text-red-600' },
    { icon: Star, label: 'S.O.S+ Membership', desc: 'Unlock unlimited roadside', color: 'bg-amber-50 text-amber-500' },
    { icon: Gift, label: 'Refer a Friend', desc: 'Give $10, get $10', color: 'bg-green-50 text-green-500' },
    { icon: Bell, label: 'Notifications', desc: 'Push, SMS, email', color: 'bg-purple-50 text-purple-500' },
    { icon: Settings, label: 'Settings', desc: 'Account & privacy', color: 'bg-gray-50 text-gray-500' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-safe">
      {/* Profile */}
      <div className="px-5 py-6 flex items-center gap-4">
        <div className="w-[68px] h-[68px] rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center overflow-hidden">
          {profile?.photo_url
            ? <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
            : <span className="text-[28px] font-bold text-red-500">{(profile?.full_name || 'U')[0]}</span>
          }
        </div>
        <div>
          <h1 className="font-display text-[22px] font-bold text-gray-900">{profile?.full_name || 'User'}</h1>
          <p className="text-[14px] text-gray-400">{profile?.email}</p>
        </div>
      </div>

      <div className="px-5 space-y-2 pb-24">
        {menu.map(item => (
          <button key={item.label}
            className="w-full flex items-center gap-4 py-4 px-4 bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all active:scale-[0.99]">
            <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-left"><p className="text-[15px] font-semibold text-gray-900">{item.label}</p><p className="text-[13px] text-gray-400">{item.desc}</p></div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}

        <button onClick={signOut}
          className="w-full flex items-center gap-4 py-4 px-4 mt-4 bg-red-50 rounded-2xl border border-red-100 transition-all active:scale-[0.99]">
          <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center"><LogOut className="w-5 h-5 text-red-500" /></div>
          <span className="text-[15px] font-semibold text-red-500">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
