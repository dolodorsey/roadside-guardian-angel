import React, { useState, useEffect } from 'react';
import { ServiceRequest } from '../ServiceRequestFlow';
import EmergencyButton from '../EmergencyButton';
import RoadsideBeacon from '../RoadsideBeacon';
import { Star, Shield, Phone, MessageCircle, Car, CheckCircle } from 'lucide-react';

interface ProviderMatchStepProps {
  onNext: () => void;
  serviceRequest: ServiceRequest;
  onProviderMatch: (provider: any) => void;
}

const ProviderMatchStep: React.FC<ProviderMatchStepProps> = ({
  onNext,
  serviceRequest,
  onProviderMatch
}) => {
  const [isMatching, setIsMatching] = useState(true);
  const [provider, setProvider] = useState<any>(null);
  const [isDispatched, setIsDispatched] = useState(false);

  useEffect(() => {
    // Simulate provider matching
    const timer = setTimeout(() => {
      const matchedProvider = {
        id: 'provider-123',
        name: 'John Martinez',
        photo: '/api/placeholder/80/80',
        rating: 4.9,
        reviews: 127,
        vehicle: '2022 RAM Tow Truck',
        company: 'Elite Roadside Services',
        verified: true,
        license: 'RSA-9847',
        insurance: 'Fully Insured',
        eta: serviceRequest.pricing.eta
      };
      
      setProvider(matchedProvider);
      onProviderMatch(matchedProvider);
      setIsMatching(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [serviceRequest.pricing.eta, onProviderMatch]);

  const handleDispatch = () => {
    setIsDispatched(true);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  if (isMatching) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          {/* Pulsing Beacon Animation */}
          <div className="mb-8 relative">
            <RoadsideBeacon size="lg" variant="emergency" />
            <div className="absolute inset-0 rounded-full border-2 border-emergency-red/30 animate-ping scale-150"></div>
            <div className="absolute inset-0 rounded-full border-2 border-emergency-red/20 animate-ping scale-200" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute inset-0 rounded-full border-2 border-emergency-red/10 animate-ping scale-300" style={{ animationDelay: '1s' }}></div>
          </div>

          <h2 className="font-guardian text-2xl text-foreground mb-4">
            Finding Your Hero
          </h2>
          <p className="text-muted-foreground mb-6">
            Matching you with the best verified Hero in your area...
          </p>

          {/* Matching Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Scanning nearby Heroes</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-electric-blue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-muted-foreground">Verifying credentials</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-emergency-red rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span className="text-muted-foreground">Calculating optimal route</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isDispatched) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-neon-green" />
          </div>
          
          <h2 className="font-guardian text-2xl text-foreground mb-4">
            {provider.name} is on the way!
          </h2>
          <p className="text-muted-foreground">
            Your Hero has been dispatched and will arrive in {provider.eta} minutes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          Your Hero
        </h2>
        <p className="text-muted-foreground">
          Verified, trusted, and on the way
        </p>
      </div>

      {/* Provider Card */}
      <div className="mb-8 animate-fade-in">
        <div className="p-6 rounded-2xl tech-surface border border-neon-green/30 shadow-guardian">
          {/* Provider Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-green to-electric-blue flex items-center justify-center">
                <span className="text-foreground text-2xl font-bold">
                  {provider.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              {provider.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center border-2 border-background">
                  <Shield className="w-4 h-4 text-midnight-black" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-guardian text-xl text-foreground mb-1">
                {provider.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-2">
                {provider.company}
              </p>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-neon-green fill-current" />
                  <span className="text-neon-green font-tech">{provider.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({provider.reviews} reviews)
                </span>
              </div>
            </div>

            {/* ETA Badge */}
            <div className="text-center">
              <div className="px-3 py-1 rounded-full bg-emergency-red/20 border border-emergency-red/30 mb-1">
                <span className="text-emergency-red font-tech text-sm">
                  {provider.eta} min
                </span>
              </div>
              <span className="text-muted-foreground text-xs">ETA</span>
            </div>
          </div>

          {/* Provider Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-electric-blue/5 border border-electric-blue/20">
              <div className="flex items-center gap-2 mb-1">
                <Car className="w-4 h-4 text-electric-blue" />
                <span className="text-electric-blue text-sm font-tech">Vehicle</span>
              </div>
              <span className="text-foreground text-sm">{provider.vehicle}</span>
            </div>
            
            <div className="p-3 rounded-lg bg-neon-green/5 border border-neon-green/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green text-sm font-tech">License</span>
              </div>
              <span className="text-foreground text-sm">{provider.license}</span>
            </div>
          </div>

          {/* Insurance Badge */}
          <div className="flex items-center justify-center p-3 rounded-lg bg-metallic-silver/5 border border-metallic-silver/20 mb-6">
            <Shield className="w-4 h-4 text-neon-green mr-2" />
            <span className="text-foreground text-sm font-tech">{provider.insurance}</span>
          </div>

          {/* Communication Options */}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-electric-blue/30 bg-electric-blue/5 hover:bg-electric-blue/10 transition-colors">
              <Phone className="w-4 h-4 text-electric-blue" />
              <span className="text-electric-blue font-tech">Call</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-neon-green/30 bg-neon-green/5 hover:bg-neon-green/10 transition-colors">
              <MessageCircle className="w-4 h-4 text-neon-green" />
              <span className="text-neon-green font-tech">Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Service Summary */}
      <div className="mb-8 p-4 rounded-xl tech-surface border border-border/50">
        <div className="text-foreground font-tech mb-2">Service Summary</div>
        <div className="text-muted-foreground text-sm">
          {provider.name} is on the way with a {provider.vehicle}. ETA: {provider.eta} minutes.
        </div>
      </div>

      {/* Dispatch Button */}
      <div className="mt-auto">
        <EmergencyButton
          variant="primary"
          size="lg"
          onClick={handleDispatch}
          className="w-full"
          showBeacon={true}
        >
          Confirm Dispatch
        </EmergencyButton>
      </div>
    </div>
  );
};

export default ProviderMatchStep;