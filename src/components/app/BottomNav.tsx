import React from 'react';
import { Home, LayoutGrid, Clock, Wallet, User } from 'lucide-react';

export type Tab = 'home' | 'services' | 'activity' | 'wallet' | 'account';

const tabs: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'home',     label: 'Home',     icon: Home },
  { id: 'services', label: 'Services', icon: LayoutGrid },
  { id: 'activity', label: 'Activity', icon: Clock },
  { id: 'wallet',   label: 'Wallet',   icon: Wallet },
  { id: 'account',  label: 'Account',  icon: User },
];

const BottomNav: React.FC<{ activeTab: Tab; onTabChange: (t: Tab) => void }> = ({ activeTab, onTabChange }) => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
    style={{
      background: 'linear-gradient(180deg, rgba(8,8,14,0.92) 0%, rgba(8,8,14,0.98) 100%)',
      backdropFilter: 'blur(40px) saturate(1.3)',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}
  >
    <div className="flex items-center justify-around h-[60px] max-w-lg mx-auto">
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[52px] py-1 transition-all active:scale-95"
          >
            <div className={`relative p-1.5 rounded-xl transition-all ${active ? '' : ''}`}
              style={active ? { background: 'rgba(249,115,22,0.12)' } : {}}
            >
              <Icon
                className={`w-[20px] h-[20px] transition-colors ${active ? 'text-orange-400' : 'text-white/25'}`}
                strokeWidth={active ? 2.2 : 1.5}
              />
              {active && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#f97316', boxShadow: '0 0 6px rgba(249,115,22,0.6)' }} />
              )}
            </div>
            <span className={`text-[9px] font-semibold transition-colors ${active ? 'text-orange-400' : 'text-white/25'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
