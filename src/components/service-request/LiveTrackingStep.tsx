import React, { useState, useEffect } from 'react';
import { ServiceRequest } from '../ServiceRequestFlow';
import EmergencyButton from '../EmergencyButton';
import RoadsideBeacon from '../RoadsideBeacon';
import { 
  Phone, 
  MessageCircle, 
  Share, 
  Clock, 
  MapPin, 
  Car,
  CheckCircle,
  Navigation
} from 'lucide-react';

interface LiveTrackingStepProps {
  serviceRequest: ServiceRequest;
  onComplete: () => void;
}

const LiveTrackingStep: React.FC<LiveTrackingStepProps> = ({
  serviceRequest,
  onComplete
}) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [providerLocation, setProviderLocation] = useState({ x: 10, y: 80 });
  const [estimatedArrival, setEstimatedArrival] = useState(serviceRequest.pricing.eta);

  const statusSteps = [
    { label: 'Dispatched', icon: '📋', completed: true },
    { label: 'En Route', icon: '🚗', completed: currentStatus >= 1 },
    { label: 'Arrived', icon: '📍', completed: currentStatus >= 2 },
    { label: 'Complete', icon: '✅', completed: currentStatus >= 3 }
  ];

  useEffect(() => {
    // Simulate provider movement and status updates
    const statusTimer = setInterval(() => {
      setCurrentStatus(prev => {
        if (prev < 3) {
          return prev + 1;
        }
        return prev;
      });
    }, 8000);

    const movementTimer = setInterval(() => {
      setProviderLocation(prev => ({
        x: Math.min(prev.x + 2, 50),
        y: Math.max(prev.y - 2, 50)
      }));
      
      setEstimatedArrival(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      clearInterval(statusTimer);
      clearInterval(movementTimer);
    };
  }, []);

  useEffect(() => {
    if (currentStatus >= 3) {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [currentStatus, onComplete]);

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-guardian text-3xl text-foreground mb-2">
          Live Tracking
        </h2>
        <p className="text-muted-foreground">
          {serviceRequest.provider?.name} is {currentStatus >= 2 ? 'here!' : 'on the way'}
        </p>
      </div>

      {/* Map View */}
      <div className="flex-1 mb-6">
        <div className="relative h-64 rounded-2xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/50 overflow-hidden">
          {/* Map Grid */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                  linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px'
              }}
            />
          </div>

          {/* User Location */}
          <div className="absolute bottom-8 right-8">
            <RoadsideBeacon size="md" variant="emergency" />
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-emergency-red font-tech">
              You
            </div>
          </div>

          {/* Provider Location */}
          <div 
            className="absolute transition-all duration-1000 ease-in-out"
            style={{ 
              left: `${providerLocation.x}%`, 
              top: `${providerLocation.y}%` 
            }}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-electric-blue flex items-center justify-center">
                <Car className="w-5 h-5 text-foreground" />
              </div>
              {/* Glowing Trail */}
              <div className="absolute inset-0 rounded-lg border-2 border-electric-blue/50 animate-pulse scale-150"></div>
              
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-electric-blue font-tech whitespace-nowrap">
                {serviceRequest.provider?.name.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Route Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--electric-blue))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--emergency-red))" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <line
              x1={`${providerLocation.x}%`}
              y1={`${providerLocation.y}%`}
              x2="calc(100% - 32px)"
              y2="calc(100% - 32px)"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>

          {/* ETA Display */}
          <div className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-emergency-red/20 border border-emergency-red/30">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emergency-red" />
              <span className="text-emergency-red font-tech">
                {estimatedArrival > 0 ? `${estimatedArrival} min` : 'Arrived!'}
              </span>
            </div>
          </div>

          {/* Speed/Direction Indicator */}
          <div className="absolute top-4 right-4 px-3 py-2 rounded-xl bg-electric-blue/20 border border-electric-blue/30">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-electric-blue" />
              <span className="text-electric-blue text-sm font-tech">
                {currentStatus >= 2 ? 'Arrived' : '35 mph'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-center flex-1">
              <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500
                ${step.completed 
                  ? 'border-neon-green bg-neon-green/20 text-neon-green' 
                  : 'border-metallic-silver/30 bg-metallic-silver/10 text-metallic-silver'
                }
                ${index === currentStatus ? 'animate-pulse scale-110' : ''}
              `}>
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <div className="w-3 h-3 rounded-full bg-current"></div>
                )}
              </div>
              
              <span className={`text-xs mt-2 font-tech ${
                step.completed ? 'text-neon-green' : 'text-metallic-silver'
              }`}>
                {step.label}
              </span>
              
              {index < statusSteps.length - 1 && (
                <div className={`
                  absolute w-16 h-0.5 mt-5 transition-all duration-500
                  ${step.completed ? 'bg-neon-green' : 'bg-metallic-silver/30'}
                `} style={{ left: `${25 + index * 25}%` }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Provider Info Card */}
      <div className="mb-6 p-4 rounded-xl tech-surface border border-border/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-neon-green flex items-center justify-center">
            <span className="text-foreground font-bold">
              {serviceRequest.provider?.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <div className="text-foreground font-tech">{serviceRequest.provider?.name}</div>
            <div className="text-muted-foreground text-sm">{serviceRequest.provider?.vehicle}</div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-electric-blue/30 bg-electric-blue/5 hover:bg-electric-blue/10 transition-colors">
              <Phone className="w-4 h-4 text-electric-blue" />
            </button>
            <button className="p-2 rounded-lg border border-neon-green/30 bg-neon-green/5 hover:bg-neon-green/10 transition-colors">
              <MessageCircle className="w-4 h-4 text-neon-green" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <EmergencyButton
          variant="ghost"
          size="lg"
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Share className="w-4 h-4" />
          Share ETA
        </EmergencyButton>
        
        {currentStatus >= 2 && (
          <EmergencyButton
            variant="primary"
            size="lg"
            onClick={onComplete}
            className="flex-1"
            showBeacon={true}
          >
            Service Complete
          </EmergencyButton>
        )}
      </div>
    </div>
  );
};

export default LiveTrackingStep;