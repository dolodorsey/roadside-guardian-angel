import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, CheckCircle, Trophy } from 'lucide-react';
import EmergencyButton from '@/components/EmergencyButton';
import RoadsideBeacon from '@/components/RoadsideBeacon';

interface CompletionStepProps {
  verificationData: any;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ verificationData }) => {
  const navigate = useNavigate();

  const handleStartDriving = () => {
    navigate('/provider/dashboard');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      {/* Success Animation */}
      <div className="mb-8 animate-scale-in">
        <div className="relative mx-auto w-32 h-32 mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-green to-electric-blue flex items-center justify-center">
            <Shield className="w-16 h-16 text-foreground" />
          </div>
          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-4 border-neon-green/30 animate-ping scale-110"></div>
          <div className="absolute inset-0 rounded-full border-4 border-neon-green/20 animate-ping scale-125" style={{ animationDelay: '0.5s' }}></div>
          
          {/* Verified badge */}
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-neon-green rounded-full flex items-center justify-center border-4 border-background">
            <CheckCircle className="w-6 h-6 text-midnight-black" />
          </div>
        </div>
        
        <h2 className="font-guardian text-4xl text-foreground mb-4">
          Welcome to Roadside!
        </h2>
        <p className="text-neon-green text-lg font-tech mb-2">
          🎉 Verified Provider Seal Earned
        </p>
        <p className="text-muted-foreground">
          You're now part of our elite network of trusted service professionals
        </p>
      </div>

      {/* Provider Profile Summary */}
      <div className="mb-8 p-6 rounded-2xl tech-surface border border-neon-green/30 shadow-guardian">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-electric-blue to-neon-green flex items-center justify-center">
            <span className="text-foreground text-xl font-bold">
              {verificationData.fullName?.split(' ').map((n: string) => n[0]).join('') || 'JP'}
            </span>
          </div>
          <div className="text-left">
            <h3 className="font-guardian text-xl text-foreground">
              {verificationData.fullName || 'John Provider'}
            </h3>
            <p className="text-muted-foreground">{verificationData.vehicleType || 'Professional Service Vehicle'}</p>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-neon-green" />
              <span className="text-neon-green text-sm font-tech">Verified Provider</span>
            </div>
          </div>
        </div>

        {/* Service Types */}
        <div className="mb-4">
          <h4 className="text-foreground font-tech mb-3">Your Services:</h4>
          <div className="flex flex-wrap gap-2">
            {(verificationData.serviceTypes || ['tow', 'jumpstart']).map((service: string) => (
              <span 
                key={service}
                className="px-3 py-1 rounded-full bg-electric-blue/20 border border-electric-blue/30 text-electric-blue text-sm font-tech"
              >
                {service.charAt(0).toUpperCase() + service.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits & Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-neon-green/5 border border-neon-green/20">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neon-green/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-neon-green" />
          </div>
          <h4 className="font-tech text-foreground mb-2">Elite Network</h4>
          <p className="text-muted-foreground text-sm">
            Join top-rated professionals earning premium rates
          </p>
        </div>

        <div className="p-4 rounded-xl bg-electric-blue/5 border border-electric-blue/20">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-electric-blue/20 flex items-center justify-center">
            <Star className="w-6 h-6 text-electric-blue" />
          </div>
          <h4 className="font-tech text-foreground mb-2">Instant Payouts</h4>
          <p className="text-muted-foreground text-sm">
            Get paid immediately after each completed job
          </p>
        </div>

        <div className="p-4 rounded-xl bg-emergency-red/5 border border-emergency-red/20">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emergency-red/20 flex items-center justify-center">
            <RoadsideBeacon size="sm" variant="emergency" />
          </div>
          <h4 className="font-tech text-foreground mb-2">24/7 Support</h4>
          <p className="text-muted-foreground text-sm">
            Always backed by our dedicated support team
          </p>
        </div>
      </div>

      {/* Getting Started Tips */}
      <div className="mb-8 p-6 rounded-xl bg-metallic-silver/5 border border-metallic-silver/20">
        <h4 className="font-guardian text-lg text-foreground mb-4">Getting Started Tips</h4>
        <ul className="text-left space-y-2 text-muted-foreground text-sm">
          <li className="flex items-start gap-2">
            <span className="text-neon-green">•</span>
            Set your service radius and go online to start receiving jobs
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-green">•</span>
            Maintain a 4.8+ star rating to access premium job opportunities
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-green">•</span>
            Check your earnings dashboard to track daily and weekly performance
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-green">•</span>
            Complete jobs quickly to earn time-based bonuses
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <EmergencyButton
        variant="primary"
        size="lg"
        onClick={handleStartDriving}
        className="px-12"
        showBeacon={true}
      >
        Start Accepting Jobs
      </EmergencyButton>

      <p className="text-muted-foreground text-sm mt-4">
        Ready to help drivers in need and earn great money doing it
      </p>
    </div>
  );
};

export default CompletionStep;