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
      <div className="min-h-[100dvh] bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="relative mx-auto mb-4">
            <div className="absolute inset-[-16px] bg-red-500/10 rounded-full animate-sos-ring" />
            <img src="/roadside-guardian-angel/sos-logo.png" alt="S.O.S" className="w-28 h-28 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;
  if (activeJob) return <LiveRescue jobId={activeJob} onComplete={() => { setActiveJob(null); setTab('activity'); }} onClose={() => setActiveJob(null)} />;
  if (reqService) return <RequestFlow serviceType={reqService} onClose={() => setReqService(null)} onJobCreated={id => { setReqService(null); setActiveJob(id); }} />;

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
