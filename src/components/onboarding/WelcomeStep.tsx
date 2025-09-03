import React, { useEffect, useState } from 'react';
import RoadsideBeacon from '../RoadsideBeacon';
import EmergencyButton from '../EmergencyButton';

interface WelcomeStepProps {
  onNext: () => void;
  onBack?: () => void;
  isLastStep: boolean;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Cinematic intro animation
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center animate-fade-in">
      {/* Cinematic Logo Animation */}
      <div className="mb-12 flex justify-center">
        <div className={`transform transition-all duration-1000 ${isAnimating ? 'scale-150 opacity-60' : 'scale-100 opacity-100'}`}>
          {/* Hazard Triangle → R Logo → Map Grid effect */}
          <div className="relative">
            <RoadsideBeacon size="lg" variant="emergency" />
            
            {/* Map Grid Expanding Effect */}
            <div className="absolute inset-0 -z-10">
              <div className={`w-32 h-32 border border-neon-green/20 rounded transition-all duration-1000 ${isAnimating ? 'scale-0' : 'scale-100'}`}
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, hsl(var(--neon-green)) 1px, transparent 1px),
                    linear-gradient(hsl(var(--neon-green)) 1px, transparent 1px)
                  `,
                  backgroundSize: '16px 16px',
                  opacity: '0.2'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Headline */}
      <h1 className="font-guardian text-4xl md:text-5xl text-foreground mb-6 leading-tight">
        Help at the Speed of Now
      </h1>

      {/* Subtext */}
      <p className="text-muted-foreground text-lg mb-12 leading-relaxed max-w-sm mx-auto">
        24/7 roadside assistance. One tap. Real-time tracking. Verified providers.
      </p>

      {/* CTA */}
      <EmergencyButton
        variant="primary"
        size="lg"
        showBeacon={true}
        onClick={onNext}
        className="w-full"
      >
        Get Started
      </EmergencyButton>

      {/* Feature Pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {['15min avg response', 'Verified providers', 'Transparent pricing'].map((feature, index) => (
          <div 
            key={feature}
            className="px-3 py-1 rounded-full bg-metallic-silver/10 border border-metallic-silver/20 text-metallic-silver text-xs animate-fade-in"
            style={{ animationDelay: `${1.5 + index * 0.2}s` }}
          >
            {feature}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeStep;