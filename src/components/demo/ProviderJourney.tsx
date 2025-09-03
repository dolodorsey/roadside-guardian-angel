import React, { useState, useEffect } from 'react';
import { MapPin, Car, DollarSign, Clock, CheckCircle, Star, Navigation } from 'lucide-react';
import RoadsideBeacon from '../RoadsideBeacon';
import EmergencyButton from '../EmergencyButton';

interface ProviderJourneyProps {
  currentStep: number;
  isPlaying: boolean;
}

const ProviderJourney: React.FC<ProviderJourneyProps> = ({ currentStep, isPlaying }) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Provider Home / Go Online
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="font-tech text-xl text-foreground mb-2">Provider Dashboard</h2>
                <p className="text-muted-foreground text-sm">Ready to help drivers</p>
              </div>

              {/* Status Toggle */}
              <div className="mb-6">
                <div className="p-4 rounded-xl tech-surface border border-border/50 text-center">
                  <div className="mb-4">
                    <RoadsideBeacon size="lg" variant="guardian" />
                  </div>
                  <h3 className="font-tech text-foreground mb-2">John Martinez</h3>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pulse-green/20 border border-pulse-green/30 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-pulse-green"></div>
                    <span className="text-sm font-tech text-pulse-green">Online</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-lg tech-surface border border-border/50 text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2 text-pulse-green" />
                  <div className="text-lg font-guardian text-foreground">$0.00</div>
                  <div className="text-xs text-muted-foreground">Today's Earnings</div>
                </div>
                <div className="p-3 rounded-lg tech-surface border border-border/50 text-center">
                  <Star className="w-6 h-6 mx-auto mb-2 text-beacon-blue" />
                  <div className="text-lg font-guardian text-foreground">4.9</div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
              </div>

              {/* Map View */}
              <div className="flex-1 relative rounded-xl bg-asphalt-gray/30 border border-border/30 overflow-hidden">
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

                {/* Provider Location */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-pulse-green/20 border border-pulse-green/30">
                    <Car className="w-3 h-3 text-pulse-green" />
                    <span className="text-xs font-tech text-pulse-green">You</span>
                  </div>
                </div>

                {/* Waiting Status */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-center p-2 rounded-lg bg-midnight-black/50">
                    <p className="text-xs text-muted-foreground">Waiting for job requests...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Incoming Job Alert
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Countdown Timer */}
              <div className="text-center mb-4">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <div className="absolute inset-0 rounded-full border-4 border-emergency-red/30"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-emergency-red border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-guardian text-xl text-emergency-red">15</span>
                  </div>
                </div>
                <h2 className="font-tech text-lg text-foreground mb-1">New Job Request</h2>
                <p className="text-xs text-muted-foreground">Accept within 15 seconds</p>
              </div>

              {/* Job Details */}
              <div className="flex-1 space-y-4">
                <div className="p-4 rounded-xl tech-surface border border-emergency-red/30 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">🛞</div>
                    <div>
                      <h3 className="font-tech text-foreground">Flat Tire Service</h3>
                      <p className="text-sm text-muted-foreground">2019 Toyota Camry</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Distance</div>
                      <div className="font-tech text-foreground">2.3 miles</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Payout</div>
                      <div className="font-tech text-pulse-green">$50.00</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-emergency-red" />
                      <span className="text-xs text-muted-foreground">123 Main St, New York, NY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-beacon-blue" />
                      <span className="text-xs text-muted-foreground">ETA: 12 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Mini Map */}
                <div className="relative h-20 rounded-lg bg-asphalt-gray/30 border border-border/30 overflow-hidden">
                  <div className="absolute inset-0 opacity-20">
                    <div 
                      className="w-full h-full"
                      style={{
                        backgroundImage: `
                          linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                          linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                      }}
                    />
                  </div>
                  
                  {/* Route Line */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 20,50 Q 40,25 80,40"
                      stroke="hsl(var(--pulse-green))"
                      strokeWidth="2"
                      strokeDasharray="3,3"
                      fill="none"
                    />
                  </svg>

                  <div className="absolute bottom-2 left-2">
                    <Car className="w-3 h-3 text-pulse-green" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-emergency-red animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <EmergencyButton variant="ghost" size="sm" className="border-muted/30">
                  Decline
                </EmergencyButton>
                <EmergencyButton variant="primary" size="sm" className="animate-heartbeat">
                  Accept Job
                </EmergencyButton>
              </div>
            </div>
          </div>
        );

      case 2: // Navigation to Job
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Job Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-tech text-lg text-foreground">En Route</h2>
                  <div className="text-right">
                    <div className="text-xl font-guardian text-pulse-green">8min</div>
                    <div className="text-xs text-muted-foreground">ETA</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-lg tech-surface border border-border/50">
                  <div className="text-2xl">🛞</div>
                  <div className="flex-1">
                    <h3 className="font-tech text-foreground">Jane Cooper</h3>
                    <p className="text-sm text-muted-foreground">Flat Tire • Toyota Camry</p>
                  </div>
                  <div className="text-pulse-green font-tech">$50</div>
                </div>
              </div>

              {/* Navigation Map */}
              <div className="flex-1 relative rounded-xl bg-asphalt-gray/30 border border-border/30 overflow-hidden mb-4">
                <div className="absolute inset-0 opacity-20">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                        linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                      `,
                      backgroundSize: '25px 25px'
                    }}
                  />
                </div>

                {/* Route */}
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M 30,80 Q 50,40 80,30"
                    stroke="hsl(var(--pulse-green))"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>

                {/* Provider Location (Moving) */}
                <div className="absolute bottom-6 left-6 animate-pulse">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-pulse-green/20 border border-pulse-green/30">
                    <Car className="w-4 h-4 text-pulse-green" />
                    <span className="text-xs font-tech text-pulse-green">You</span>
                  </div>
                </div>

                {/* Customer Location */}
                <div className="absolute top-6 right-6">
                  <RoadsideBeacon size="sm" variant="emergency" />
                </div>

                {/* Navigation Instructions */}
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="p-2 rounded-lg bg-midnight-black/80 border border-pulse-green/30">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-pulse-green" />
                      <span className="text-sm font-tech text-pulse-green">Turn right on Main St</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <EmergencyButton variant="ghost" size="sm">
                  Call Customer
                </EmergencyButton>
                <EmergencyButton variant="primary" size="sm">
                  I've Arrived
                </EmergencyButton>
              </div>
            </div>
          </div>
        );

      case 3: // Job Verification
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="text-center mb-6">
                <h2 className="font-tech text-xl text-foreground mb-2">Verify Job Start</h2>
                <p className="text-muted-foreground text-sm">Confirm your arrival and vehicle</p>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-xl tech-surface border border-border/50 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-emergency-red/20 flex items-center justify-center">
                    <span className="text-lg">👩</span>
                  </div>
                  <div>
                    <h3 className="font-tech text-foreground">Jane Cooper</h3>
                    <p className="text-sm text-muted-foreground">2019 Toyota Camry</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3" />
                    <span>123 Main St, New York, NY</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="w-3 h-3" />
                    <span>License: NY-ABC123</span>
                  </div>
                </div>
              </div>

              {/* Verification Photo */}
              <div className="flex-1 space-y-4 mb-6">
                <div className="text-center">
                  <h3 className="font-tech text-foreground mb-2">Take Verification Photo</h3>
                  <p className="text-xs text-muted-foreground mb-4">Photo of vehicle for security</p>
                </div>

                <div className="relative aspect-square rounded-xl bg-asphalt-gray/30 border border-border/30 border-dashed flex items-center justify-center">
                  <div className="text-center animate-fade-in">
                    <Car className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Tap to capture</p>
                  </div>
                  
                  {/* Simulated Camera Flash */}
                  <div className="absolute inset-0 bg-white opacity-0 animate-pulse rounded-xl"></div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pulse-green/20 border border-pulse-green/30 animate-fade-in" style={{ animationDelay: '1s' }}>
                    <CheckCircle className="w-4 h-4 text-pulse-green" />
                    <span className="text-sm font-tech text-pulse-green">Photo Verified</span>
                  </div>
                </div>
              </div>

              <EmergencyButton variant="primary" size="lg" className="w-full">
                Start Service
              </EmergencyButton>
            </div>
          </div>
        );

      case 4: // Job Completion & Earnings
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col justify-center text-center">
              {/* Completion Celebration */}
              <div className="mb-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-pulse-green/20 animate-ping scale-125"></div>
                  <div className="relative w-20 h-20 mx-auto rounded-full bg-pulse-green/30 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-pulse-green animate-scale-in" />
                  </div>
                </div>
                
                <h2 className="font-guardian text-2xl text-foreground mb-2">Job Complete!</h2>
                <p className="text-muted-foreground">Great work helping Jane</p>
              </div>

              {/* Earnings Update */}
              <div className="space-y-4 mb-8">
                <div className="p-6 rounded-xl tech-surface border border-border/50 animate-fade-in">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-guardian text-pulse-green mb-1">+$50.00</div>
                    <p className="text-sm text-muted-foreground">Flat Tire Service</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Duration</span>
                      <span className="text-foreground">22 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Customer Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-pulse-green" />
                        <span className="text-foreground">5.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge Achievement */}
                <div className="p-4 rounded-xl bg-beacon-blue/20 border border-beacon-blue/30 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-beacon-blue/30 flex items-center justify-center">
                      <Star className="w-5 h-5 text-beacon-blue" />
                    </div>
                    <div>
                      <h3 className="font-tech text-beacon-blue">Bronze Badge Earned</h3>
                      <p className="text-xs text-muted-foreground">First Rescue Achievement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg tech-surface border border-border/50 text-center">
                    <div className="font-tech text-pulse-green">$50.00</div>
                    <div className="text-xs text-muted-foreground">Today's Total</div>
                  </div>
                  <div className="p-3 rounded-lg tech-surface border border-border/50 text-center">
                    <div className="font-tech text-beacon-blue">1</div>
                    <div className="text-xs text-muted-foreground">Jobs Completed</div>
                  </div>
                </div>

                <EmergencyButton variant="primary" size="sm" className="w-full">
                  Continue Helping
                </EmergencyButton>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="aspect-[9/16] rounded-3xl bg-asphalt-gray/50 border border-border/30 flex items-center justify-center">
            <div className="text-center">
              <RoadsideBeacon size="lg" variant="tech" />
              <p className="text-muted-foreground font-tech mt-4">Provider Step {currentStep}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderStep()}
    </div>
  );
};

export default ProviderJourney;