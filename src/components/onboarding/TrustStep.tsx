import React from 'react';
import EmergencyButton from '../EmergencyButton';
import { Shield, Clock, MapPin, Headphones, CheckCircle } from 'lucide-react';

interface TrustStepProps {
  onNext: () => void;
  onBack?: () => void;
  isLastStep: boolean;
}

const TrustStep: React.FC<TrustStepProps> = ({ onNext, onBack }) => {
  const trustFeatures = [
    {
      icon: <Shield className="w-6 h-6 text-neon-green" />,
      title: "Verified Providers",
      description: "Licensed, insured, and background-checked"
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-electric-blue" />,
      title: "Insurance Coverage",
      description: "Full protection for you and your vehicle"
    },
    {
      icon: <MapPin className="w-6 h-6 text-emergency-red" />,
      title: "Real-time Tracking",
      description: "Live location sharing and accurate ETAs"
    },
    {
      icon: <Headphones className="w-6 h-6 text-neon-green" />,
      title: "24/7 Support",
      description: "Always here when you need us most"
    }
  ];

  return (
    <div className="animate-fade-in text-center">
      {/* Header */}
      <div className="mb-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-neon/10 border border-neon-green/20 flex items-center justify-center">
          <Shield className="w-10 h-10 text-neon-green" />
        </div>
        
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          Trust & Safety
        </h2>
        <p className="text-muted-foreground">
          Your safety comes first — every provider is vetted, tracked, and insured.
        </p>
      </div>

      {/* Trust Features Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {trustFeatures.map((feature, index) => (
          <div 
            key={feature.title}
            className="p-4 rounded-xl tech-surface border border-border/50 text-left animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="mb-3">
              {feature.icon}
            </div>
            <h3 className="font-tech text-sm font-medium text-foreground mb-1">
              {feature.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Safety Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-center">
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="font-guardian text-2xl text-neon-green mb-1">98%</div>
          <div className="text-xs text-muted-foreground">Safety Rating</div>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="font-guardian text-2xl text-electric-blue mb-1">15min</div>
          <div className="text-xs text-muted-foreground">Avg Response</div>
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="font-guardian text-2xl text-emergency-red mb-1">24/7</div>
          <div className="text-xs text-muted-foreground">Available</div>
        </div>
      </div>

      {/* Final Message */}
      <div className="p-4 rounded-xl bg-gradient-neon/5 border border-neon-green/20 mb-8 animate-fade-in" style={{ animationDelay: '0.7s' }}>
        <p className="text-sm text-muted-foreground">
          Welcome to S.O.S. One tap away from peace of mind.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        {onBack && (
          <EmergencyButton
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </EmergencyButton>
        )}
        <EmergencyButton
          variant="primary"
          size="lg"
          onClick={onNext}
          className="flex-1"
          showBeacon={true}
        >
          Got It, Let's Roll
        </EmergencyButton>
      </div>
    </div>
  );
};

export default TrustStep;