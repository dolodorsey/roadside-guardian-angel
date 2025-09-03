import React, { useState } from 'react';
import EmergencyButton from './EmergencyButton';
import RoadsideBeacon from './RoadsideBeacon';
import OnboardingFlow from './OnboardingFlow';

const LandingScreen: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Background - Night Map Interface */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-black via-asphalt-gray/50 to-midnight-black">
        {/* Road Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
              linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        {/* Ambient Road Textures */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-asphalt-gray/30 to-transparent"></div>
        
        {/* Glowing Road Lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-green/30 to-transparent animate-pulse"></div>
          <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emergency-red/30 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
      
      {/* User's Beacon - Pulsing at Center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <RoadsideBeacon size="lg" variant="emergency" />
          {/* Expanding Beacon Waves */}
          <div className="absolute inset-0 rounded-full border-2 border-emergency-red/30 animate-ping scale-150"></div>
          <div className="absolute inset-0 rounded-full border-2 border-emergency-red/20 animate-ping scale-200" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
      
      {/* App Logo - Top Left */}
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-center gap-3">
          <RoadsideBeacon size="sm" variant="guardian" />
          <span className="font-guardian text-xl text-foreground">ROADSIDE</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Primary CTA */}
        <div className="mb-8">
          <EmergencyButton 
            variant="primary" 
            size="lg"
            showBeacon={true}
            className="text-xl px-16 py-6 mb-4 animate-pulse"
            onClick={() => setShowOnboarding(true)}
          >
            Request Help Now
          </EmergencyButton>
          
          {/* Microcopy */}
          <p className="text-metallic-silver text-sm font-tech">
            Trusted help in minutes. Anytime. Anywhere.
          </p>
        </div>
        
        {/* Secondary Action */}
        <button className="text-muted-foreground text-sm hover:text-neon-green transition-colors duration-300 font-tech">
          Sign In / Create Account
        </button>
      </div>
      
      {/* Bottom Trust Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse"></div>
          <span>Verified Providers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-electric-blue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <span>24/7 Support</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-emergency-red rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <span>Real-time Tracking</span>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;