import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/app/BottomNav';
import type { Tab } from '@/components/app/BottomNav';
import AuthScreen from './AuthScreen';
import HomeScreen from './HomeScreen';
import RequestFlow from './RequestFlow';
import LiveRescue from './LiveRescue';
import ServicesTab from './ServicesTab';
import { ActivityTab, WalletTab, AccountTab } from './Tabs';

const AppShell: React.FC = () => {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('home');
  const [reqService, setReqService] = useState<string | null>(null);
  const [activeJob, setActiveJob] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FFFBF5] flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 bg-orange-200/40 rounded-[24px] animate-sos-ring" />
            <div className="relative w-20 h-20 rounded-[24px] bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-sos-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h2 className="font-display text-[22px] font-bold text-gray-900">S.O.S</h2>
          <p className="text-[14px] text-gray-400 mt-1">Superheros On Standby</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  if (activeJob) {
    return <LiveRescue jobId={activeJob} onComplete={() => { setActiveJob(null); setTab('activity'); }} onClose={() => setActiveJob(null)} />;
  }

  if (reqService) {
    return <RequestFlow serviceType={reqService} onClose={() => setReqService(null)} onJobCreated={id => { setReqService(null); setActiveJob(id); }} />;
  }

  return (
    <div className="min-h-[100dvh] bg-[#FFFBF5]">
      {tab === 'home' && <HomeScreen onRequestService={setReqService} onOpenServices={() => setTab('services')} />}
      {tab === 'services' && <ServicesTab onRequestService={setReqService} />}
      {tab === 'activity' && <ActivityTab />}
      {tab === 'wallet' && <WalletTab />}
      {tab === 'account' && <AccountTab />}
      <BottomNav activeTab={tab} onTabChange={setTab} />
    </div>
  );
};

export default AppShell;
