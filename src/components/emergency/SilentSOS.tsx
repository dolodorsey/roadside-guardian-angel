import React, { useEffect, useState } from 'react';
import { Shield, MapPin } from 'lucide-react';

interface SilentSOSProps {
  onDispatch: (provider: any) => void;
}

const SilentSOS: React.FC<SilentSOSProps> = ({ onDispatch }) => {
  const [isDispatching, setIsDispatching] = useState(true);

  useEffect(() => {
    // Simulate silent dispatch process
    const dispatchTimer = setTimeout(() => {
      const mockProvider = {
        name: 'Emergency Response Team',
        vehicle: 'Roadside Emergency Unit',
        plate: 'EMR-911',
        rating: 5.0
      };
      
      setIsDispatching(false);
      onDispatch(mockProvider);
    }, 3000);

    return () => clearTimeout(dispatchTimer);
  }, [onDispatch]);

  return (
    <div className="fixed inset-0 bg-midnight-black/95 z-50 overflow-hidden">
      {/* Very subtle indicator - barely visible */}
      <div className="absolute top-4 right-4">
        <div className="w-3 h-3 bg-emergency-red/30 rounded-full animate-pulse" />
      </div>

      {/* Minimal content - appears normal but help is being dispatched */}
      <div className="h-full flex flex-col items-center justify-center p-6">
        {isDispatching ? (
          <div className="text-center max-w-sm opacity-80">
            <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Checking your location...
            </p>
          </div>
        ) : (
          <div className="text-center max-w-sm">
            <div className="w-12 h-12 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-neon-green" />
            </div>
            <p className="text-foreground text-sm font-tech">
              Security check complete
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              All systems operational
            </p>
          </div>
        )}

        {/* Hidden dispatch confirmation - barely visible */}
        {!isDispatching && (
          <div className="absolute bottom-4 left-4 right-4 opacity-20">
            <div className="text-center text-xs text-neon-green">
              ● Emergency response activated
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SilentSOS;