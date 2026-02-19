import React, { useState, useEffect } from 'react';
import { ServiceRequest } from '../ServiceRequestFlow';
import EmergencyButton from '../EmergencyButton';
import RoadsideBeacon from '../RoadsideBeacon';
import ProviderProfileCard from './ProviderProfileCard';
import SafetyPanel from './SafetyPanel';
import CinematicArrival from './CinematicArrival';
import { 
  Phone, 
  MessageCircle, 
  Share, 
  Clock, 
  MapPin, 
  Car,
  CheckCircle,
  Navigation,
  Shield,
  Battery,
  Eye
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
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showSafetyPanel, setShowSafetyPanel] = useState(false);
  const [showCinematicArrival, setShowCinematicArrival] = useState(false);
  const [batteryLevel] = useState(85); // Simulated battery level
  const [providerSpeed, setProviderSpeed] = useState(35);
  const [providerRotation, setProviderRotation] = useState(0);

  const statusSteps = [
    { label: 'Dispatched', icon: '📋', completed: true, color: 'electric-blue' },
    { label: 'En Route', icon: '🚗', completed: currentStatus >= 1, color: 'neon-green' },
    { label: 'Arrived', icon: '📍', completed: currentStatus >= 2, color: 'emergency-red' },
    { label: 'Complete', icon: '✅', completed: currentStatus >= 3, color: 'neon-green' }
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
      setProviderLocation(prev => {
        const newX = Math.min(prev.x + 2, 50);
        const newY = Math.max(prev.y - 2, 50);
        
        // Calculate rotation based on movement direction
        const deltaX = newX - prev.x;
        const deltaY = newY - prev.y;
        const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        setProviderRotation(rotation);
        
        return { x: newX, y: newY };
      });
      
      setEstimatedArrival(prev => {
        const newETA = Math.max(prev - 1, 0);
        
        // Trigger cinematic arrival at 2 minutes
        if (newETA === 2 && !showCinematicArrival) {
          setShowCinematicArrival(true);
        }
        
        return newETA;
      });
      
      // Vary speed for realism
      setProviderSpeed(prev => 30 + Math.random() * 15);
    }, 1000);

    return () => {
      clearInterval(statusTimer);
      clearInterval(movementTimer);
    };
  }, [showCinematicArrival]);

  useEffect(() => {
    if (currentStatus >= 3) {
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [currentStatus, onComplete]);

  // Emergency mode for low battery
  const isEmergencyMode = batteryLevel < 15;
  
  // Cinematic arrival mode
  if (showCinematicArrival) {
    return (
      <CinematicArrival 
        serviceRequest={serviceRequest}
        onContinue={() => setShowCinematicArrival(false)}
        providerLocation={providerLocation}
        estimatedArrival={estimatedArrival}
      />
    );
  }

  return (
    <div className={`p-6 h-full flex flex-col ${isEmergencyMode ? 'bg-midnight-black' : ''}`}>
      {/* Emergency Mode Indicator */}
      {isEmergencyMode && (
        <div className="mb-4 p-3 rounded-xl bg-emergency-red/20 border border-emergency-red/30 flex items-center gap-3">
          <Battery className="w-5 h-5 text-emergency-red" />
          <span className="text-emergency-red text-sm font-tech">
            Emergency Mode Active - Battery Saving
          </span>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-guardian text-3xl text-foreground mb-2">
          Live Tracking
        </h2>
        <p className="text-muted-foreground">
          {serviceRequest.provider?.name} is {currentStatus >= 2 ? 'here!' : 'on the way'}
        </p>
        
        {/* Real-time ETA with glow effect */}
        <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency-red/20 border border-emergency-red/30">
          <Clock className="w-4 h-4 text-emergency-red animate-pulse" />
          <span className="text-emergency-red font-guardian text-lg">
            {estimatedArrival > 0 ? `${estimatedArrival} min` : 'Arrived!'}
          </span>
        </div>
      </div>

      {/* Enhanced Map View */}
      <div className="flex-1 mb-6">
        <div className="relative h-64 rounded-2xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/50 overflow-hidden">
          {/* Animated Road Grid with motion parallax */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full animate-pulse"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                  linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
                animation: 'road-drift 20s linear infinite'
              }}
            />
            
            {/* Illuminated road lines */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-electric-blue/40 to-transparent animate-pulse"></div>
              <div className="absolute top-3/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-neon-green/40 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* User Location - Enhanced heartbeat beacon */}
          <div className="absolute bottom-8 right-8">
            <div className="relative">
              <RoadsideBeacon size="md" variant="emergency" />
              {/* Heartbeat pulse rings */}
              <div className="absolute inset-0 rounded-full border-2 border-emergency-red/30 animate-ping scale-150"></div>
              <div className="absolute inset-0 rounded-full border-2 border-emergency-red/20 animate-ping scale-200" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute inset-0 rounded-full border-2 border-emergency-red/10 animate-ping scale-250" style={{ animationDelay: '0.6s' }}></div>
            </div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-emergency-red font-tech">
              You
            </div>
          </div>

          {/* Provider Location - Enhanced with rotation and trail */}
          <div 
            className="absolute transition-all duration-1000 ease-in-out"
            style={{ 
              left: `${providerLocation.x}%`, 
              top: `${providerLocation.y}%` 
            }}
          >
            <div className="relative">
              {/* Glowing trail effect */}
              <div className="absolute inset-0 w-12 h-12 rounded-lg bg-electric-blue/20 blur-md animate-pulse"></div>
              
              {/* Vehicle icon with rotation */}
              <div 
                className="w-10 h-10 rounded-lg bg-electric-blue flex items-center justify-center transition-transform duration-500 border-2 border-electric-blue/50"
                style={{ transform: `rotate(${providerRotation}deg)` }}
              >
                <Car className="w-6 h-6 text-foreground" />
              </div>
              
              {/* Speed indicator */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-electric-blue/20 border border-electric-blue/30">
                <span className="text-electric-blue text-xs font-tech">{Math.round(providerSpeed)} mph</span>
              </div>
              
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-electric-blue font-tech whitespace-nowrap">
                {serviceRequest.provider?.name.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Enhanced Route Line with glow */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--electric-blue))" stopOpacity="0.8" />
                <stop offset="50%" stopColor="hsl(var(--neon-green))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--emergency-red))" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <line
              x1={`${providerLocation.x}%`}
              y1={`${providerLocation.y}%`}
              x2="calc(100% - 32px)"
              y2="calc(100% - 32px)"
              stroke="url(#routeGradient)"
              strokeWidth="4"
              strokeDasharray="15,5"
              filter="url(#glow)"
              className="animate-pulse"
            />
          </svg>

          {/* Enhanced Controls Panel */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {/* ETA Display with pulsing glow */}
            <div className="px-4 py-2 rounded-xl bg-emergency-red/20 border border-emergency-red/30 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emergency-red animate-pulse" />
                <span className="text-emergency-red font-tech">
                  {estimatedArrival > 0 ? `${estimatedArrival} min` : 'Arrived!'}
                </span>
              </div>
            </div>
            
            {/* Provider verification button */}
            <button 
              onClick={() => setShowProfileCard(true)}
              className="px-3 py-2 rounded-xl bg-electric-blue/20 border border-electric-blue/30 backdrop-blur-sm hover:bg-electric-blue/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-electric-blue" />
                <span className="text-electric-blue text-sm font-tech">Verify</span>
              </div>
            </button>
          </div>

          {/* Safety & Sharing Panel */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button 
              onClick={() => setShowSafetyPanel(true)}
              className="p-2 rounded-xl bg-neon-green/20 border border-neon-green/30 backdrop-blur-sm hover:bg-neon-green/30 transition-colors"
            >
              <Shield className="w-4 h-4 text-neon-green" />
            </button>
            
            <button className="p-2 rounded-xl bg-metallic-silver/20 border border-metallic-silver/30 backdrop-blur-sm hover:bg-metallic-silver/30 transition-colors">
              <Share className="w-4 h-4 text-metallic-silver" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Timeline */}
      <div className="mb-6">
        <div className="relative flex items-center justify-between px-4">
          {statusSteps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-center flex-1 relative">
              <div className={`
                w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500
                ${step.completed 
                  ? `border-${step.color} bg-${step.color}/20 text-${step.color} shadow-${step.color === 'emergency-red' ? 'emergency' : step.color === 'electric-blue' ? 'tech' : 'guardian'}` 
                  : 'border-metallic-silver/30 bg-metallic-silver/10 text-metallic-silver'
                }
                ${index === currentStatus ? 'animate-pulse scale-110' : ''}
              `}>
                {step.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-current"></div>
                )}
                
                {/* Milestone animation when reached */}
                {step.completed && index === currentStatus && (
                  <div className={`absolute inset-0 rounded-full border-2 border-${step.color} animate-ping scale-150 opacity-30`}></div>
                )}
              </div>
              
              <span className={`text-xs mt-2 font-tech transition-colors duration-300 ${
                step.completed ? `text-${step.color}` : 'text-metallic-silver'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
          
          {/* Connecting lines between milestones */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-metallic-silver/20">
            <div 
              className="h-full bg-gradient-to-r from-electric-blue via-neon-green to-emergency-red transition-all duration-1000"
              style={{ width: `${(currentStatus / (statusSteps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Access Provider Card */}
      {!isEmergencyMode && (
        <div className="mb-6 p-4 rounded-xl tech-surface border border-border/50 cursor-pointer hover:border-electric-blue/50 transition-colors"
             onClick={() => setShowProfileCard(true)}>
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
            <Eye className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}

      {/* Enhanced Action Buttons */}
      <div className="flex gap-4">
        <EmergencyButton
          variant="ghost"
          size="lg"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => navigator.share?.({ 
            title: 'S.O.S ETA', 
            text: `My S.O.S Hero ${serviceRequest.provider?.name} will arrive in ${estimatedArrival} minutes.` 
          })}
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
      
      {/* Slide-up Panels */}
      {showProfileCard && (
        <ProviderProfileCard 
          provider={serviceRequest.provider!}
          onClose={() => setShowProfileCard(false)}
        />
      )}
      
      {showSafetyPanel && (
        <SafetyPanel 
          serviceRequest={serviceRequest}
          onClose={() => setShowSafetyPanel(false)}
        />
      )}
    </div>
  );
};

export default LiveTrackingStep;