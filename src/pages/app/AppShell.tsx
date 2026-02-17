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
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [requestingService, setRequestingService] = useState<string | null>(null);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-zinc-500 text-sm">Loading S.O.S...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <AuthScreen />;
  }

  // Live rescue active
  if (activeJobId) {
    return (
      <LiveRescue
        jobId={activeJobId}
        onComplete={() => {
          setActiveJobId(null);
          setActiveTab('activity');
        }}
        onClose={() => setActiveJobId(null)}
      />
    );
  }

  // Service request flow
  if (requestingService) {
    return (
      <RequestFlow
        serviceType={requestingService}
        onClose={() => setRequestingService(null)}
        onJobCreated={(jobId) => {
          setRequestingService(null);
          setActiveJobId(jobId);
        }}
      />
    );
  }

  // Main app with tabs
  return (
    <div className="min-h-screen bg-black">
      {activeTab === 'home' && (
        <HomeScreen
          onRequestService={(type) => setRequestingService(type)}
          onOpenServices={() => setActiveTab('services')}
        />
      )}
      {activeTab === 'services' && (
        <ServicesTab onRequestService={(type) => setRequestingService(type)} />
      )}
      {activeTab === 'activity' && <ActivityTab />}
      {activeTab === 'wallet' && <WalletTab />}
      {activeTab === 'account' && <AccountTab />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default AppShell;
