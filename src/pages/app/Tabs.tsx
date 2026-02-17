import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getServiceIcon } from '@/components/app/ServiceIcons';
import { Clock, ChevronRight, CreditCard, Plus, Gift, Car, Shield, Bell, LogOut, Settings, Star, DollarSign, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

// ═══════════════════════════════════════
// ACTIVITY TAB
// ═══════════════════════════════════════
export const ActivityTab: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('jobs')
      .select('*, service_catalog(display_name)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setJobs(data || []);
        setLoading(false);
      });
  }, [user]);

  const statusColor: Record<string, string> = {
    completed: 'text-emerald-400',
    in_progress: 'text-blue-400',
    en_route: 'text-blue-400',
    canceled_by_user: 'text-zinc-500',
    no_provider_found: 'text-red-400',
  };

  return (
    <div className="min-h-screen bg-black pt-safe">
      <div className="px-5 py-6">
        <h1 className="text-2xl font-bold text-white">Activity</h1>
        <p className="text-zinc-500 text-sm mt-1">Your rescue history</p>
      </div>

      {loading ? (
        <div className="px-5 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-zinc-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400 font-medium">No rescues yet</p>
          <p className="text-zinc-600 text-sm mt-1">Your rescue history will appear here</p>
        </div>
      ) : (
        <div className="px-5 space-y-3 pb-24">
          {jobs.map(job => (
            <button
              key={job.id}
              className="w-full bg-zinc-900 rounded-2xl p-4 border border-zinc-800/50 flex items-center gap-4 text-left hover:border-zinc-700 transition-all"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {(() => { const { Icon, gradient } = getServiceIcon(job.service_type); return <div className={`w-full h-full rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}><Icon className="text-white" size={18} /></div>; })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">
                  {job.service_catalog?.display_name || job.service_type}
                </p>
                <p className="text-zinc-500 text-xs mt-0.5 truncate">{job.pickup_address || 'Unknown location'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white text-sm font-medium">
                  {job.price_cents ? `$${(job.price_cents / 100).toFixed(2)}` : '--'}
                </p>
                <p className={`text-xs ${statusColor[job.status] || 'text-zinc-500'}`}>
                  {job.status?.replace(/_/g, ' ')}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700 flex-shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════
// WALLET TAB
// ═══════════════════════════════════════
export const WalletTab: React.FC = () => {
  const { user } = useAuth();
  const [ledger, setLedger] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('wallet_ledger')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data) {
          setLedger(data);
          const bal = data.reduce((sum: number, entry: any) => sum + entry.amount_cents, 0);
          setBalance(bal);
        }
      });
  }, [user]);

  return (
    <div className="min-h-screen bg-black pt-safe">
      <div className="px-5 py-6">
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="mx-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg shadow-orange-500/20">
        <p className="text-orange-200 text-sm font-medium">Balance</p>
        <p className="text-white text-4xl font-bold mt-1">${(Math.abs(balance) / 100).toFixed(2)}</p>
        <div className="mt-4 flex gap-3">
          <button className="flex-1 py-2.5 bg-white/20 rounded-xl text-white text-sm font-medium backdrop-blur">
            <CreditCard className="w-4 h-4 inline mr-1.5" /> Add Card
          </button>
          <button className="flex-1 py-2.5 bg-white/20 rounded-xl text-white text-sm font-medium backdrop-blur">
            <Gift className="w-4 h-4 inline mr-1.5" /> Promo Code
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-5 mt-6">
        <h3 className="text-zinc-400 text-xs font-medium tracking-wide uppercase mb-3">Transactions</h3>
        {ledger.length === 0 ? (
          <p className="text-zinc-600 text-sm py-8 text-center">No transactions yet</p>
        ) : (
          <div className="space-y-2 pb-24">
            {ledger.map(entry => (
              <div key={entry.id} className="flex items-center gap-3 py-3 border-b border-zinc-800/50">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  entry.amount_cents >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
                }`}>
                  {entry.amount_cents >= 0
                    ? <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                    : <ArrowUpRight className="w-4 h-4 text-red-400" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{entry.description || entry.type}</p>
                  <p className="text-zinc-500 text-xs">{new Date(entry.created_at).toLocaleDateString()}</p>
                </div>
                <p className={`font-medium text-sm ${entry.amount_cents >= 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {entry.amount_cents >= 0 ? '+' : ''}${(entry.amount_cents / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// ACCOUNT TAB
// ═══════════════════════════════════════
export const AccountTab: React.FC = () => {
  const { profile, signOut } = useAuth();

  const menuItems = [
    { icon: Car, label: 'My Vehicles', desc: 'Add or manage your vehicles' },
    { icon: Shield, label: 'Safety Preferences', desc: 'Safe mode, Female-First dispatch' },
    { icon: Star, label: 'Subscription', desc: 'S.O.S+ membership plans' },
    { icon: Gift, label: 'Refer a Friend', desc: 'Earn $10 for each referral' },
    { icon: Bell, label: 'Notifications', desc: 'Push, SMS, email preferences' },
    { icon: Settings, label: 'Settings', desc: 'Account, privacy, app settings' },
  ];

  return (
    <div className="min-h-screen bg-black pt-safe">
      {/* Profile Header */}
      <div className="px-5 py-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
          {profile?.photo_url ? (
            <img src={profile.photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-zinc-500">
              {(profile?.full_name || 'U')[0]}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{profile?.full_name || 'User'}</h1>
          <p className="text-zinc-500 text-sm">{profile?.email}</p>
        </div>
      </div>

      {/* Menu */}
      <div className="px-5 space-y-1 pb-24">
        {menuItems.map(item => (
          <button
            key={item.label}
            className="w-full flex items-center gap-4 py-4 border-b border-zinc-800/50 text-left hover:bg-zinc-900/50 transition-colors rounded-xl px-2"
          >
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{item.label}</p>
              <p className="text-zinc-600 text-xs">{item.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-700" />
          </button>
        ))}

        <button
          onClick={signOut}
          className="w-full flex items-center gap-4 py-4 mt-4 text-left px-2"
        >
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-400" />
          </div>
          <span className="text-red-400 text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
