import React from 'react';
import { Home, Grid3X3, Clock, Wallet, User } from 'lucide-react';

type Tab = 'home' | 'services' | 'activity' | 'wallet' | 'account';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.FC<any> }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'services', label: 'Services', icon: Grid3X3 },
  { id: 'activity', label: 'Activity', icon: Clock },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'account', label: 'Account', icon: User },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-16 py-1 transition-all ${
                active ? 'text-orange-500' : 'text-zinc-500'
              }`}
            >
              <Icon className={`w-5 h-5 transition-all ${active ? 'scale-110' : ''}`} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[10px] font-medium ${active ? 'text-orange-500' : 'text-zinc-600'}`}>
                {label}
              </span>
              {active && (
                <div className="absolute top-0 w-8 h-0.5 bg-orange-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
export type { Tab };
