import React, { useEffect, useState } from 'react';
import { ServiceRequest } from '../ServiceRequestFlow';
import EmergencyButton from '../EmergencyButton';
import RoadsideBeacon from '../RoadsideBeacon';
import { MapPin, Clock } from 'lucide-react';

interface CinematicArrivalProps {
  serviceRequest: ServiceRequest;
  onContinue: () => void;
  providerLocation: { x: number; y: number };
  estimatedArrival: number;
}

const CinematicArrival: React.FC<CinematicArrivalProps> = ({
  serviceRequest,
  onContinue,
  providerLocation,
  estimatedArrival
}) => {
  const [phase, setPhase] = useState(0); // 0: zoom out, 1: message, 2: continue
  
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 2000);
    const timer2 = setTimeout(() => setPhase(2), 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-midnight-black via-asphalt-gray/50 to-midnight-black flex flex-col">
      {/* Cinematic Map View */}
      <div className="flex-1 relative overflow-hidden">
        {/* Split-view cinematic mode */}
        <div className={`absolute inset-0 transition-all duration-2000 ${phase >= 0 ? 'scale-75' : 'scale-100'}`}>
          {/* Enhanced road grid with depth */}
          <div className="absolute inset-0 opacity-30">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                  linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                animation: 'road-drift 30s linear infinite'
              }}
            />
            
            {/* Cinematic road lines */}
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric-blue/60 to-transparent animate-pulse"></div>
              <div className="absolute top-2/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green/60 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* User Location - Enhanced beacon */}
          <div className="absolute bottom-16 right-16">
            <div className="relative">
              <RoadsideBeacon size="lg" variant="emergency" />
              {/* Multiple pulse rings for dramatic effect */}
              <div className="absolute inset-0 rounded-full border-3 border-emergency-red/40 animate-ping scale-150"></div>
              <div className="absolute inset-0 rounded-full border-3 border-emergency-red/30 animate-ping scale-200" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute inset-0 rounded-full border-3 border-emergency-red/20 animate-ping scale-300" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute inset-0 rounded-full border-3 border-emergency-red/10 animate-ping scale-400" style={{ animationDelay: '0.9s' }}></div>
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-emergency-red font-guardian text-lg">
              You
            </div>
          </div>

          {/* Provider Location - Closing in */}
          <div 
            className="absolute transition-all duration-1000 ease-in-out"
            style={{ 
              left: `${Math.min(providerLocation.x + 20, 45)}%`, 
              top: `${Math.max(providerLocation.y - 10, 45)}%` 
            }}
          >
            <div className="relative">
              {/* Enhanced vehicle with trail */}
              <div className="absolute inset-0 w-16 h-16 rounded-xl bg-electric-blue/30 blur-lg animate-pulse"></div>
              <div className="w-12 h-12 rounded-xl bg-electric-blue border-2 border-electric-blue/50 flex items-center justify-center shadow-tech">
                <span className="text-foreground text-lg">🚗</span>
              </div>
              
              {/* Speed indicator */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full bg-electric-blue/20 border border-electric-blue/30">
                <span className="text-electric-blue font-tech">Arriving</span>
              </div>
              
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-electric-blue font-guardian text-lg whitespace-nowrap">
                {serviceRequest.provider?.name.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Cinematic route line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="cinematicRoute" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--electric-blue))" stopOpacity="1" />
                <stop offset="50%" stopColor="hsl(var(--neon-green))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--emergency-red))" stopOpacity="1" />
              </linearGradient>
              <filter id="cinematicGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <line
              x1={`${Math.min(providerLocation.x + 20, 45)}%`}
              y1={`${Math.max(providerLocation.y - 10, 45)}%`}
              x2="calc(100% - 64px)"
              y2="calc(100% - 64px)"
              stroke="url(#cinematicRoute)"
              strokeWidth="6"
              strokeDasharray="20,10"
              filter="url(#cinematicGlow)"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Cinematic overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-midnight-black/20"></div>
        
        {/* Top status bar */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 px-6 py-3 rounded-full bg-midnight-black/60 border border-neon-green/30 backdrop-blur-md">
          <Clock className="w-5 h-5 text-neon-green animate-pulse" />
          <span className="text-neon-green font-guardian text-lg">
            {estimatedArrival} minutes away
          </span>
        </div>
      </div>

      {/* Message Phase */}
      {phase >= 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-midnight-black/40 backdrop-blur-sm animate-fade-in">
          <div className="text-center max-w-md px-6">
            <h2 className="font-guardian text-4xl text-foreground mb-6 animate-scale-in">
              Help is almost here.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              {serviceRequest.provider?.name} is approaching your location. 
              Your Hero is just moments away.
            </p>
            
            {/* Pulsing beacon */}
            <div className="mb-8 flex justify-center animate-scale-in" style={{ animationDelay: '1s' }}>
              <RoadsideBeacon size="md" variant="guardian" />
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      {phase >= 2 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
          <EmergencyButton
            variant="primary"
            size="lg"
            onClick={onContinue}
            className="px-12"
            showBeacon={true}
          >
            Continue Tracking
          </EmergencyButton>
        </div>
      )}
    </div>
  );
};

export default CinematicArrival;