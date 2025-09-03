import React, { useEffect } from 'react';
import { Battery, MapPin, Clock, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LowBatteryModeProps {
  provider?: any;
  eta?: number;
  onClose: () => void;
  userLocation?: { lat: number; lng: number };
}

const LowBatteryMode: React.FC<LowBatteryModeProps> = ({
  provider,
  eta,
  onClose,
  userLocation
}) => {
  useEffect(() => {
    // Auto-send emergency contact notification
    const sendEmergencyText = () => {
      // Simulate sending text to emergency contact
      console.log('Auto-text sent: "I\'ve requested Roadside help. ETA 10 mins."');
    };

    if (provider && eta) {
      sendEmergencyText();
    }
  }, [provider, eta]);

  return (
    <div className="fixed inset-0 bg-midnight-black z-50 overflow-hidden">
      {/* Minimal Dark Interface */}
      <div className="h-full flex flex-col">
        {/* Header - Battery Status */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <div className="flex items-center">
            <Battery className="w-5 h-5 text-emergency-red mr-2 animate-pulse" />
            <span className="font-tech text-sm text-emergency-red">Low Battery Mode</span>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content - Minimal Info */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {provider ? (
            <div className="text-center max-w-sm">
              {/* Simple Beacon */}
              <div className="w-16 h-16 bg-emergency-red/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <div className="w-8 h-8 bg-emergency-red rounded-full" />
              </div>

              <h1 className="font-guardian text-2xl text-foreground mb-2">
                Help is Coming
              </h1>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center text-neon-green">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="font-tech text-lg">{eta} minutes</span>
                </div>
                
                <div className="text-center">
                  <p className="font-tech text-foreground">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">{provider.vehicle}</p>
                </div>
              </div>

              {/* Essential Actions Only */}
              <div className="space-y-3">
                <Button className="w-full bg-neon-green/20 text-neon-green hover:bg-neon-green/30">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Provider
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  Emergency contact notified automatically
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center max-w-sm">
              {/* Loading State */}
              <div className="w-16 h-16 bg-emergency-red/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <div className="w-8 h-8 bg-emergency-red rounded-full animate-ping" />
              </div>

              <h1 className="font-guardian text-2xl text-foreground mb-2">
                Finding Help
              </h1>
              <p className="text-muted-foreground mb-6">
                Locating nearest provider...
              </p>
            </div>
          )}

          {/* Location Indicator */}
          {userLocation && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-center text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                Location shared
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowBatteryMode;