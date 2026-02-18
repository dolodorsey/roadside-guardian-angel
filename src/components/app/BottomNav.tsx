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
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe">
    <div className="flex items-center justify-around h-[64px] max-w-lg mx-auto">
      {tabs.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className="flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 transition-all active:scale-95"
          >
            <div className={`relative p-1.5 rounded-xl transition-all ${active ? 'bg-orange-50' : ''}`}>
              <Icon
                className={`w-[22px] h-[22px] transition-colors ${active ? 'text-orange-500' : 'text-gray-400'}`}
                strokeWidth={active ? 2.2 : 1.6}
              />
              {active && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-orange-500 rounded-full" />
              )}
            </div>
            <span className={`text-[10px] font-semibold transition-colors ${active ? 'text-orange-500' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
