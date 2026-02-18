import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LOGO } from '@/lib/assets';
import { History, ArrowDownLeft, ArrowUpRight, Car, Shield, Star, Gift, Bell, Settings, LogOut, ChevronRight, Plus, Wallet, Clock, Zap } from 'lucide-react';

// ═══════════════════════════════
// ACTIVITY TAB
// ═══════════════════════════════
export const ActivityTab: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from('jobs').select('*, service_catalog(display_name, category)')
      .eq('customer_id', user.id).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => { if (data) setJobs(data); });
  }, [user]);

  const statusColor: Record<string, string> = {
    completed: 'bg-green-50 text-green-600', canceled_by_user: 'bg-gray-100 text-gray-500',
    in_progress: 'bg-blue-50 text-blue-600', en_route: 'bg-blue-50 text-blue-600',
    matching: 'bg-amber-50 text-amber-600', created: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-safe pb-24">
      <div className="px-5 py-5">
        <h1 className="font-display text-[24px] font-bold text-gray-900">Mission Log</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">{jobs.length} missions</p>
      </div>
      <div className="px-5 space-y-2">
        {jobs.length === 0 && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-[16px] font-semibold text-gray-400">No missions yet</p>
            <p className="text-[13px] text-gray-300 mt-1">Your rescue history will appear here</p>
          </div>
        )}
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-[18px]">🚛</div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-900 truncate">{job.service_catalog?.display_name || job.service_type}</p>
              <p className="text-[12px] text-gray-400 truncate">{job.pickup_address || 'Unknown location'}</p>
            </div>
            <div className="text-right flex-shrink-0">
              {job.price_cents > 0 && <p className="text-[14px] font-bold text-gray-900">${(job.price_cents / 100).toFixed(0)}</p>}
              <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusColor[job.status] || 'bg-gray-100 text-gray-500'}`}>
                {job.status?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════
// WALLET TAB
// ═══════════════════════════════
export const WalletTab: React.FC = () => (
  <div className="min-h-screen bg-[#FFFBF5] pt-safe pb-24">
    <div className="px-5 py-5">
      <h1 className="font-display text-[24px] font-bold text-gray-900">Wallet</h1>
    </div>
    <div className="px-5">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-5 shadow-[0_8px_40px_rgba(220,38,38,0.25)]">
        <p className="text-red-200 text-[13px] font-medium">S.O.S Balance</p>
        <p className="text-white text-[36px] font-bold font-display mt-1">$0.00</p>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-3 bg-white/20 backdrop-blur rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-1.5">
            <Plus className="w-4 h-4" /> Add Card
          </button>
          <button className="flex-1 py-3 bg-white/20 backdrop-blur rounded-xl text-white text-[13px] font-semibold flex items-center justify-center gap-1.5">
            <Gift className="w-4 h-4" /> Promo Code
          </button>
        </div>
      </div>
      <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-card">
        <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Transactions</p>
        <p className="text-[14px] text-gray-400 text-center py-4">No transactions yet</p>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════
// ACCOUNT TAB
// ═══════════════════════════════
export const AccountTab: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [sub, setSub] = useState<any>(null);

  useEffect(() => {
    if (!profile) return;
    supabase.from('vehicles').select('*').eq('customer_id', profile.id).order('is_default', { ascending: false })
      .then(({ data }) => { if (data) setVehicles(data); });
    supabase.from('subscriptions').select('*, plans(name, price_cents)').eq('customer_id', profile.id).eq('status', 'active').maybeSingle()
      .then(({ data }) => { if (data) setSub(data); });
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-safe pb-24">
      <div className="px-5 py-5">
        {/* Profile Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-[24px] font-bold">
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <h1 className="font-display text-[20px] font-bold text-gray-900">{profile?.full_name || 'User'}</h1>
            <p className="text-[13px] text-gray-400">{profile?.email}</p>
          </div>
        </div>

        {/* Hero Pass Status */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <Star className="w-8 h-8 text-white" fill="white" />
          <div className="flex-1">
            <p className="text-white text-[15px] font-bold">{sub ? sub.plans?.name : 'Hero Pass'}</p>
            <p className="text-red-200 text-[12px]">{sub ? 'Active membership' : 'Unlock priority dispatch + discounts'}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-red-200" />
        </div>

        {/* Vehicles */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-card mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12px] text-gray-400 font-semibold uppercase tracking-wider">My Vehicles</p>
            <button className="text-[12px] text-red-600 font-semibold flex items-center gap-0.5">
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          {vehicles.length === 0 ? (
            <button className="w-full py-4 bg-gray-50 rounded-xl flex items-center justify-center gap-2 text-[14px] text-gray-400">
              <Car className="w-5 h-5" /> Add your first vehicle
            </button>
          ) : vehicles.map(v => (
            <div key={v.id} className="flex items-center gap-3 py-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-gray-900">{v.year} {v.make} {v.model}</p>
                <p className="text-[12px] text-gray-400">{v.color}{v.license_plate ? ` • ${v.license_plate}` : ''}</p>
              </div>
              {v.is_default && <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded">Default</span>}
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
          {[
            { icon: Shield, label: 'Safety & Trust', desc: 'Emergency contacts, safe mode', color: 'bg-red-50 text-red-500' },
            { icon: Bell, label: 'Notifications', desc: 'Push, SMS, email settings', color: 'bg-purple-50 text-purple-500' },
            { icon: Wallet, label: 'Payment Methods', desc: 'Cards, promo codes', color: 'bg-green-50 text-green-500' },
            { icon: Settings, label: 'Settings', desc: 'Account, privacy, preferences', color: 'bg-gray-50 text-gray-500' },
          ].map((item, i) => (
            <button key={item.label} className={`w-full px-4 py-3.5 flex items-center gap-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
              <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[14px] font-medium text-gray-900">{item.label}</p>
                <p className="text-[11px] text-gray-400">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200" />
            </button>
          ))}
        </div>

        {/* Sign Out */}
        <button onClick={signOut} className="w-full mt-4 bg-red-50 rounded-2xl py-4 flex items-center justify-center gap-2 text-red-500 text-[14px] font-semibold">
          <LogOut className="w-5 h-5" /> Sign Out
        </button>
      </div>
    </div>
  );
};
