import React, { useState, useEffect } from 'react';
import { X, Shield, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmergencyDispatchFlow from './EmergencyDispatchFlow';
import LowBatteryMode from './LowBatteryMode';
import SilentSOS from './SilentSOS';
import CinematicBeacon from './CinematicBeacon';

interface EmergencyModeProps {
  isActive: boolean;
  onClose: () => void;
  batteryLevel?: number;
  userLocation?: { lat: number; lng: number };
  isSilentMode?: boolean;
}

const EmergencyMode: React.FC<EmergencyModeProps> = ({
  isActive,
  onClose,
  batteryLevel = 100,
  userLocation,
  isSilentMode = false
}) => {
  const [currentStep, setCurrentStep] = useState<'activation' | 'dispatch' | 'tracking'>('activation');
  const [provider, setProvider] = useState<any>(null);
  const [eta, setEta] = useState<number>(0);

  useEffect(() => {
    if (isActive) {
      // Reset state when emergency mode activates
      setCurrentStep('activation');
      setProvider(null);
      setEta(0);
    }
  }, [isActive]);

  if (!isActive) return null;

  // Silent SOS Mode
  if (isSilentMode) {
    return <SilentSOS onDispatch={(providerData) => {
      setProvider(providerData);
      setCurrentStep('tracking');
    }} />;
  }

  // Low Battery Mode
  if (batteryLevel < 15) {
    return (
      <LowBatteryMode
        provider={provider}
        eta={eta}
        onClose={onClose}
        userLocation={userLocation}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-midnight-black z-50 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight-black via-asphalt-gray/50 to-midnight-black">
        <div className="absolute inset-0 bg-gradient-beacon opacity-30" />
      </div>

      {/* Close Button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="absolute top-6 right-6 z-10 text-muted-foreground hover:text-foreground"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {currentStep === 'activation' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {/* Cinematic Activation Animation */}
            <div className="text-center mb-8 animate-fade-in">
              <CinematicBeacon size="lg" />
              <h1 className="font-guardian text-4xl md:text-5xl text-foreground mt-8 mb-4">
                Emergency Mode Activated
              </h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Your location has been captured. Choose your emergency type or skip to dispatch help immediately.
              </p>
            </div>

            {/* Emergency Type Selection */}
            <div className="w-full max-w-md space-y-3 mb-8">
              <Button
                onClick={() => setCurrentStep('dispatch')}
                className="w-full h-16 emergency-cta font-guardian text-lg"
              >
                Send Help Immediately
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                {['Tow', 'Jump', 'Tire', 'Fuel', 'Lockout', 'Other'].map((service) => (
                  <Button
                    key={service}
                    onClick={() => setCurrentStep('dispatch')}
                    className="h-12 tech-surface border border-border hover:border-electric-blue/50 text-foreground font-tech"
                  >
                    {service}
                  </Button>
                ))}
              </div>
            </div>

            {/* Safety Features */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-neon-green/30 text-neon-green hover:bg-neon-green/10"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Share Location
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'dispatch' && (
          <EmergencyDispatchFlow
            onProviderMatched={(providerData, estimatedEta) => {
              setProvider(providerData);
              setEta(estimatedEta);
              setCurrentStep('tracking');
            }}
            userLocation={userLocation}
          />
        )}

        {currentStep === 'tracking' && provider && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <CinematicBeacon size="md" />
            
            <div className="text-center mt-8 mb-6">
              <h2 className="font-guardian text-3xl text-foreground mb-2">
                Help is on the way
              </h2>
              <p className="text-muted-foreground">
                Your provider will arrive in approximately {eta} minutes
              </p>
            </div>

            {/* Provider Card */}
            <div className="tech-surface rounded-2xl p-6 max-w-sm w-full mb-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <h3 className="font-tech text-lg text-foreground">{provider.name}</h3>
                  <p className="text-muted-foreground text-sm">{provider.vehicle}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button className="flex-1 bg-neon-green/20 text-neon-green hover:bg-neon-green/30">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button className="flex-1 bg-electric-blue/20 text-electric-blue hover:bg-electric-blue/30">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </div>

            {/* Location Display */}
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              Location shared and verified
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyMode;