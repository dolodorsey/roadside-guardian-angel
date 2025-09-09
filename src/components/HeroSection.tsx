import React from 'react';
import EmergencyButton from './EmergencyButton';
import RoadsideBeacon from './RoadsideBeacon';
import heroImage from '@/assets/roadside-hero.jpg';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-midnight-black/60 via-midnight-black/40 to-midnight-black/80"></div>
      </div>
      
      {/* Beacon Grid Background Effect */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20">
          <RoadsideBeacon size="sm" variant="guardian" />
        </div>
        <div className="absolute top-40 right-32">
          <RoadsideBeacon size="sm" variant="tech" />
        </div>
        <div className="absolute bottom-32 left-40">
          <RoadsideBeacon size="sm" variant="emergency" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Logo/Beacon */}
        <div className="mb-8 flex justify-center">
          <RoadsideBeacon size="lg" variant="emergency" />
        </div>
        
        {/* Tagline */}
        <div className="mb-6 flex justify-center">
          <img 
            src="/lovable-uploads/faf67814-8153-400b-a3ea-b4203d7bf2c8.png"
            alt="Roadside"
            className="h-16 md:h-20 lg:h-24 object-contain animate-guardian-enter"
          />
        </div>
        
        <div className="neon-accent w-32 mx-auto mb-8"></div>
        
        <p className="font-tech text-xl md:text-2xl text-metallic-silver mb-4 animate-guardian-enter">
          Peace of mind on demand
        </p>
        
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto leading-relaxed animate-guardian-enter">
          When the road stops, Roadside starts. Real-time assistance, verified providers, transparent pricing. 
          Your guardian angel in your pocket.
        </p>
        
        {/* CTA */}
        <div className="space-y-4 animate-guardian-enter">
          <EmergencyButton 
            variant="primary" 
            size="lg" 
            showBeacon={true}
            className="mr-4"
          >
            Request Help Now
          </EmergencyButton>
          
          <EmergencyButton 
            variant="ghost" 
            size="lg"
          >
            Learn More
          </EmergencyButton>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 flex justify-center items-center gap-8 text-muted-foreground text-sm animate-guardian-enter">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-green rounded-full"></div>
            <span>Verified Providers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
            <span>Real-time Tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emergency-red rounded-full"></div>
            <span>24/7 Support</span>
          </div>
        </div>
      </div>
      
      {/* Ambient Light Effects */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-beacon opacity-30 rounded-full blur-3xl"></div>
    </section>
  );
};

export default HeroSection;