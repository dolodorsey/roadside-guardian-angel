import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmergencyFloatingButtonProps {
  onEmergencyActivate: () => void;
  onVoiceCommand?: () => void;
  batteryLevel?: number;
}

const EmergencyFloatingButton: React.FC<EmergencyFloatingButtonProps> = ({
  onEmergencyActivate,
  onVoiceCommand,
  batteryLevel = 100
}) => {
  const [isListening, setIsListening] = useState(false);
  const [showLowBatteryPrompt, setShowLowBatteryPrompt] = useState(false);

  useEffect(() => {
    // Auto-prompt for low battery
    if (batteryLevel < 15 && !showLowBatteryPrompt) {
      setShowLowBatteryPrompt(true);
    }
  }, [batteryLevel, showLowBatteryPrompt]);

  const handleVoiceActivation = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      onVoiceCommand?.();
    }, 2000);
  };

  return (
    <>
      {/* Low Battery Emergency Prompt */}
      {showLowBatteryPrompt && (
        <div className="fixed inset-0 bg-midnight-black/90 backdrop-blur-sm z-40 flex items-center justify-center p-6">
          <div className="tech-surface rounded-2xl p-6 max-w-sm w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emergency-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-emergency-red animate-pulse" />
              </div>
              <h3 className="font-guardian text-xl text-foreground mb-2">Low Battery Detected</h3>
              <p className="text-muted-foreground">Your phone is at {batteryLevel}%. Activate Emergency Mode for priority assistance?</p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setShowLowBatteryPrompt(false);
                  onEmergencyActivate();
                }}
                className="w-full emergency-cta font-guardian"
              >
                Activate Emergency Mode
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowLowBatteryPrompt(false)}
                className="w-full"
              >
                Not Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating SOS Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <div className="relative">
          {/* Pulse Ring Animation */}
          <div className="absolute inset-0 rounded-full bg-emergency-red/30 animate-ping" />
          
          {/* Main SOS Button */}
          <Button
            onClick={onEmergencyActivate}
            className="relative w-16 h-16 rounded-full bg-emergency-red hover:bg-emergency-red/90 border-2 border-emergency-red shadow-emergency group"
            size="icon"
          >
            <AlertTriangle className="w-8 h-8 text-white group-active:scale-75 transition-transform duration-150" />
          </Button>

          {/* Voice Command Button (Smaller, next to SOS) */}
          <Button
            onClick={handleVoiceActivation}
            className={`absolute -top-2 -left-16 w-12 h-12 rounded-full tech-surface border border-border ${
              isListening ? 'bg-neon-green/20 border-neon-green animate-pulse' : ''
            }`}
            size="icon"
          >
            <Phone className={`w-5 h-5 ${isListening ? 'text-neon-green' : 'text-muted-foreground'}`} />
          </Button>
        </div>

        {/* Voice Command Indicator */}
        {isListening && (
          <div className="absolute -top-16 right-0 bg-midnight-black/90 text-neon-green px-3 py-1 rounded-lg text-sm font-tech whitespace-nowrap">
            Listening for "Hey Roadside"...
          </div>
        )}
      </div>
    </>
  );
};

export default EmergencyFloatingButton;