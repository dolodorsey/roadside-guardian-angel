import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, MapPin, Shield } from 'lucide-react';
import CinematicBeacon from './CinematicBeacon';

interface EmergencyDispatchFlowProps {
  onProviderMatched: (provider: any, eta: number) => void;
  userLocation?: { lat: number; lng: number };
}

const EmergencyDispatchFlow: React.FC<EmergencyDispatchFlowProps> = ({
  onProviderMatched,
  userLocation
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'location', label: 'Capturing Location', icon: MapPin },
    { id: 'dispatch', label: 'Finding Provider', icon: Clock },
    { id: 'match', label: 'Provider Matched', icon: CheckCircle },
    { id: 'verified', label: 'Verified & Dispatched', icon: Shield }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // Simulate provider match
        const mockProvider = {
          name: 'Alex Rodriguez',
          vehicle: '2023 Ford F-150 Tow Truck',
          plate: 'TOW-247',
          rating: 4.9,
          photo: '/api/placeholder/80/80'
        };
        onProviderMatched(mockProvider, 8);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentStep, onProviderMatched, steps.length]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Cinematic Beacon */}
      <CinematicBeacon size="lg" />

      {/* Dispatch Status */}
      <div className="text-center mt-8 mb-12">
        <h2 className="font-guardian text-3xl text-foreground mb-2 animate-fade-in">
          {steps[currentStep].label}
        </h2>
        <p className="text-muted-foreground animate-fade-in" style={{animationDelay: '0.2s'}}>
          Connecting you with the nearest verified provider
        </p>
      </div>

      {/* Progress Steps */}
      <div className="w-full max-w-md">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div
                key={step.id}
                className={`flex items-center p-4 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'tech-surface border border-emergency-red/30 shadow-emergency'
                    : isCompleted
                    ? 'tech-surface border border-neon-green/30'
                    : 'bg-asphalt-gray/30 border border-border/30'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all duration-300 ${
                    isActive
                      ? 'bg-emergency-red/20 text-emergency-red animate-pulse'
                      : isCompleted
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-muted/20 text-muted-foreground'
                  }`}
                >
                  <StepIcon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h3
                    className={`font-tech ${
                      isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </h3>
                  {isActive && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Please wait...
                    </p>
                  )}
                  {isCompleted && (
                    <p className="text-sm text-neon-green mt-1">
                      Completed
                    </p>
                  )}
                </div>

                {isCompleted && (
                  <CheckCircle className="w-5 h-5 text-neon-green" />
                )}
              </div>
            );
          })}
        </div>

        {/* Location Display */}
        {userLocation && (
          <div className="mt-6 p-3 rounded-lg bg-midnight-black/50 border border-border/30">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2 text-electric-blue" />
              Location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyDispatchFlow;