import React, { useEffect, useState } from 'react';
import { Crown, Shield, Check } from 'lucide-react';
import RoadsideBeacon from '@/components/RoadsideBeacon';
import EmergencyButton from '@/components/EmergencyButton';

interface MembershipConfirmationProps {
  planId: string;
  onComplete: () => void;
}

const MembershipConfirmation: React.FC<MembershipConfirmationProps> = ({ planId, onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  const planDetails = {
    free: {
      name: 'Shield Free',
      icon: <Shield className="w-12 h-12" />,
      color: 'metallic-silver',
      message: 'Welcome to S.O.S',
      subMessage: 'You\'re now protected on every journey'
    },
    basic: {
      name: 'Shield Plan',
      icon: <Shield className="w-12 h-12" />,
      color: 'electric-blue',
      message: 'Welcome to S.O.S Shield',
      subMessage: 'Your guardian angel is now active'
    },
    premium: {
      name: 'Shield Pro',
      icon: <Crown className="w-12 h-12" />,
      color: 'neon-green',
      message: 'Welcome to S.O.S Shield Pro',
      subMessage: 'Drive without fear. You\'re fully covered.'
    }
  };

  const plan = planDetails[planId as keyof typeof planDetails];

  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationPhase(1), 500),
      setTimeout(() => setAnimationPhase(2), 1500),
      setTimeout(() => setAnimationPhase(3), 2500),
      setTimeout(() => setAnimationPhase(4), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-midnight-black to-asphalt-gray flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        {/* Cinematic Shield Animation */}
        <div className="mb-12 relative">
          {animationPhase >= 1 && (
            <div className="animate-scale-in">
              <div className={`w-32 h-32 mx-auto rounded-full bg-${plan.color}/20 border-2 border-${plan.color} flex items-center justify-center mb-6`}>
                <div className={`text-${plan.color}`}>
                  {plan.icon}
                </div>
                
                <div className="absolute inset-0 rounded-full border-2 border-neon-green/30 animate-ping scale-110"></div>
                <div className="absolute inset-0 rounded-full border-2 border-neon-green/20 animate-ping scale-125" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-0 rounded-full border-2 border-neon-green/10 animate-ping scale-150" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <div className="flex justify-center">
                <RoadsideBeacon size="md" variant="guardian" />
              </div>
            </div>
          )}
        </div>

        {animationPhase >= 2 && (
          <div className="mb-12 animate-fade-in">
            <h1 className="font-guardian text-4xl md:text-5xl text-foreground mb-4">
              {plan.message}
            </h1>
            <p className="text-muted-foreground text-xl">
              {plan.subMessage}
            </p>
          </div>
        )}

        {animationPhase >= 3 && (
          <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl tech-surface border border-border/50">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-neon-green" />
                </div>
                <h3 className="font-tech text-foreground mb-2">Instant Activation</h3>
                <p className="text-muted-foreground text-sm">
                  Your protection is active immediately
                </p>
              </div>
              
              <div className="p-6 rounded-xl tech-surface border border-border/50">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-electric-blue/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-electric-blue" />
                </div>
                <h3 className="font-tech text-foreground mb-2">Verified Network</h3>
                <p className="text-muted-foreground text-sm">
                  Access to thousands of trusted Heroes
                </p>
              </div>
              
              <div className="p-6 rounded-xl tech-surface border border-border/50">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emergency-red/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-emergency-red" />
                </div>
                <h3 className="font-tech text-foreground mb-2">24/7 Coverage</h3>
                <p className="text-muted-foreground text-sm">
                  Round-the-clock protection anywhere
                </p>
              </div>
            </div>
          </div>
        )}

        {animationPhase >= 3 && (
          <div className="mb-12 p-8 rounded-2xl bg-neon-green/5 border border-neon-green/20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-4 h-4 bg-neon-green rounded-full animate-pulse"></div>
              <span className="font-tech text-neon-green text-lg">Protection Status: ACTIVE</span>
            </div>
            <p className="text-muted-foreground">
              You're now part of the S.O.S family. Drive with confidence knowing help is always just one tap away.
            </p>
          </div>
        )}

        {animationPhase >= 4 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <EmergencyButton
              variant="primary"
              size="lg"
              onClick={onComplete}
              className="mb-4"
              showBeacon={true}
            >
              Start Using S.O.S
            </EmergencyButton>
            
            <p className="text-muted-foreground text-sm">
              Ready to request help anytime, anywhere
            </p>
          </div>
        )}

        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-beacon opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-neon opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default MembershipConfirmation;
