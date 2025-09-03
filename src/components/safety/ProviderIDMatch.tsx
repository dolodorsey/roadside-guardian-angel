import React, { useState, useEffect } from 'react';
import { Shield, Camera, CheckCircle, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProviderIDMatchProps {
  provider: {
    name: string;
    photo: string;
    vehicle: {
      make: string;
      model: string;
      plate: string;
      color: string;
      photo?: string;
    };
  };
  onConfirm: () => void;
  onReject: () => void;
  isVisible: boolean;
}

const ProviderIDMatch: React.FC<ProviderIDMatchProps> = ({
  provider,
  onConfirm,
  onReject,
  isVisible
}) => {
  const [isMatching, setIsMatching] = useState(true);
  const [matchStatus, setMatchStatus] = useState<'checking' | 'matched' | 'mismatch'>('checking');

  useEffect(() => {
    if (isVisible) {
      setIsMatching(true);
      setMatchStatus('checking');
      
      // Simulate ID verification process
      const timer = setTimeout(() => {
        setIsMatching(false);
        setMatchStatus('matched'); // In real app, this would be determined by actual verification
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-midnight-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-electric-blue animate-pulse" />
          </div>
          <h2 className="font-guardian text-2xl text-foreground mb-2">
            Provider Verification
          </h2>
          <p className="text-muted-foreground">
            Confirm this is your verified Roadside provider
          </p>
        </div>

        {/* ID Match Cards */}
        <div className="space-y-4 mb-8">
          {/* Provider Photo Card */}
          <div className="tech-surface rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-tech text-foreground">Provider Profile</h3>
              {matchStatus === 'matched' && (
                <CheckCircle className="w-5 h-5 text-neon-green animate-scale-in" />
              )}
            </div>
            
            <div className="flex items-center">
              <img
                src={provider.photo || '/api/placeholder/60/60'}
                alt={provider.name}
                className="w-15 h-15 rounded-full object-cover border-2 border-electric-blue/30 mr-4"
              />
              <div>
                <h4 className="font-guardian text-lg text-foreground">{provider.name}</h4>
                <p className="text-muted-foreground text-sm">Verified Provider</p>
              </div>
            </div>
          </div>

          {/* Vehicle Match Card */}
          <div className="tech-surface rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-tech text-foreground">Vehicle Match</h3>
              {matchStatus === 'matched' && (
                <CheckCircle className="w-5 h-5 text-neon-green animate-scale-in" />
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img
                  src={provider.vehicle.photo || '/api/placeholder/120/80'}
                  alt="Provider vehicle"
                  className="w-full h-20 object-cover rounded-lg border border-border/30"
                />
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-muted-foreground text-xs">Vehicle:</span>
                  <p className="text-foreground text-sm font-tech">
                    {provider.vehicle.color} {provider.vehicle.make} {provider.vehicle.model}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">Plate:</span>
                  <p className="text-foreground text-sm font-tech font-mono tracking-wider">
                    {provider.vehicle.plate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        {isMatching && (
          <div className="text-center mb-6">
            <div className="animate-pulse text-electric-blue font-tech">
              Verifying provider details...
            </div>
          </div>
        )}

        {matchStatus === 'matched' && !isMatching && (
          <div className="bg-neon-green/10 border border-neon-green/30 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center text-neon-green">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-tech">Verification Complete</span>
            </div>
            <p className="text-neon-green/80 text-sm mt-1">
              This is your verified Roadside provider
            </p>
          </div>
        )}

        {matchStatus === 'mismatch' && !isMatching && (
          <div className="bg-emergency-red/10 border border-emergency-red/30 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center text-emergency-red">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-tech">Verification Failed</span>
            </div>
            <p className="text-emergency-red/80 text-sm mt-1">
              Provider details do not match our records
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {matchStatus === 'matched' && !isMatching ? (
            <Button
              onClick={onConfirm}
              className="flex-1 emergency-cta font-guardian"
            >
              Confirm Provider
            </Button>
          ) : (
            <Button
              disabled={isMatching}
              className="flex-1 bg-muted text-muted-foreground cursor-not-allowed"
            >
              {isMatching ? 'Verifying...' : 'Pending Verification'}
            </Button>
          )}
          
          <Button
            onClick={onReject}
            variant="outline"
            className="border-emergency-red/30 text-emergency-red hover:bg-emergency-red/10"
          >
            <X className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </div>

        {/* Manual Photo Option */}
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Camera className="w-4 h-4 mr-2" />
            Take verification photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderIDMatch;