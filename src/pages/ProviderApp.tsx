import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProviderOnboarding from '@/components/provider/ProviderOnboarding';
import ProviderDashboard from '@/components/provider/ProviderDashboard';
import EarningsDashboard from '@/components/provider/EarningsDashboard';
import ProviderProfile from '@/components/provider/ProviderProfile';
import ActiveJob from '@/components/provider/ActiveJob';

const ProviderApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-black to-asphalt-gray">
      <Routes>
        <Route path="/onboarding" element={<ProviderOnboarding />} />
        <Route path="/dashboard" element={<ProviderDashboard />} />
        <Route path="/earnings" element={<EarningsDashboard />} />
        <Route path="/profile" element={<ProviderProfile />} />
        <Route path="/job/:jobId" element={<ActiveJob />} />
        <Route path="/" element={<ProviderDashboard />} />
      </Routes>
    </div>
  );
};

export default ProviderApp;