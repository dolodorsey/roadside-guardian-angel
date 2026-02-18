import React from 'react';
import { Home, History, Wallet, User } from 'lucide-react';

export type Tab = 'home' | 'activity' | 'wallet' | 'account';

const tabs: { key: Tab; icon: any; label: string }[] = [
  { key: 'home',     icon: Home,    label: 'Mission Control' },
  { key: 'activity', icon: History, label: 'History' },
  { key: 'wallet',   icon: Wallet,  label: 'Wallet' },
  { key: 'account',  icon: User,    label: 'Account' },
];

interface Props { activeTab: Tab; onTabChange: (tab: Tab) => void; }

const BottomNav: React.FC<Props> = ({ activeTab, onTabChange }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 pb-safe z-40">
    <div className="flex items-center justify-around h-[64px]">
      {tabs.map(t => {
        const active = activeTab === t.key;
        return (
          <button key={t.key} onClick={() => onTabChange(t.key)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[64px] ${active ? 'text-red-600' : 'text-gray-400'}`}>
            {active && <div className="w-5 h-0.5 bg-red-500 rounded-full absolute top-0" />}
            <t.icon className={`w-[22px] h-[22px] ${active ? 'text-red-600' : 'text-gray-400'}`} strokeWidth={active ? 2.2 : 1.8} />
            <span className="text-[10px] font-medium">{t.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
