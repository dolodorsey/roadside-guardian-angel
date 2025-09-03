import { useState } from 'react';
import LandingScreen from '@/components/LandingScreen';
import HeroSection from '@/components/HeroSection';
import ServicesGrid from '@/components/ServicesGrid';
import TrustSection from '@/components/TrustSection';

const Index = () => {
  const [showMainApp, setShowMainApp] = useState(false);

  if (!showMainApp) {
    return <LandingScreen />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesGrid />
      <TrustSection />
    </div>
  );
};

export default Index;
