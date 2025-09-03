import React, { useState, useEffect } from 'react';
import { MapPin, Car, Star, Clock, Shield, CheckCircle } from 'lucide-react';
import RoadsideBeacon from '../RoadsideBeacon';
import EmergencyButton from '../EmergencyButton';

interface ClientJourneyProps {
  currentStep: number;
  isPlaying: boolean;
}

const ClientJourney: React.FC<ClientJourneyProps> = ({ currentStep, isPlaying }) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Cinematic Opening
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-midnight-black border border-border/30 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-midnight-black via-asphalt-gray/20 to-midnight-black"></div>
            
            {/* Hazard Triangle Morph Animation */}
            <div className="relative z-10 text-center animate-fade-in">
              <div className="mb-8">
                <div className="w-16 h-16 mx-auto mb-4 animate-pulse">
                  <div className="hazard-triangle mx-auto"></div>
                </div>
                <div className="transition-all duration-1000">
                  <RoadsideBeacon size="lg" variant="emergency" />
                </div>
              </div>
              
              <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: '1s' }}>
                <h1 className="font-guardian text-3xl text-foreground">
                  ROADSIDE
                </h1>
                <p className="text-electric-blue font-tech text-lg">
                  Help at the Speed of Now
                </p>
                <EmergencyButton 
                  variant="primary" 
                  size="lg"
                  showBeacon={true}
                  className="animate-heartbeat"
                >
                  Request Help Now
                </EmergencyButton>
              </div>
            </div>
          </div>
        );

      case 1: // Service Selection
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="text-center mb-6">
                <h2 className="font-tech text-xl text-foreground mb-2">What do you need help with?</h2>
                <p className="text-muted-foreground text-sm">Select your service type</p>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-4">
                {[
                  { icon: '🚛', label: 'Tow', color: 'emergency-red', delay: '0ms' },
                  { icon: '⚡', label: 'Jump', color: 'beacon-blue', delay: '100ms' },
                  { icon: '🛞', label: 'Tire', color: 'pulse-green', delay: '200ms' },
                  { icon: '⛽', label: 'Fuel', color: 'emergency-red', delay: '300ms' },
                  { icon: '🔑', label: 'Lockout', color: 'beacon-blue', delay: '400ms' },
                  { icon: '🪝', label: 'Winch', color: 'pulse-green', delay: '500ms' },
                ].map((service, index) => (
                  <div 
                    key={service.label}
                    className={`p-4 rounded-xl tech-surface border border-border/50 text-center animate-fade-in hover:border-${service.color}/50 transition-all duration-300 cursor-pointer`}
                    style={{ animationDelay: service.delay }}
                  >
                    <div className="text-2xl mb-2">{service.icon}</div>
                    <div className="font-tech text-sm text-foreground">{service.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="p-4 rounded-xl bg-pulse-green/20 border border-pulse-green/30 animate-pulse">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🛞</span>
                    <div>
                      <div className="font-tech text-foreground">Flat Tire Selected</div>
                      <div className="text-sm text-muted-foreground">Professional tire service</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Confirm Location
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="text-center mb-4">
                <h2 className="font-tech text-xl text-foreground mb-2">Confirm Location</h2>
                <p className="text-muted-foreground text-sm">We'll send help here</p>
              </div>

              {/* Map View */}
              <div className="flex-1 relative rounded-xl bg-asphalt-gray/30 border border-border/30 overflow-hidden mb-4">
                {/* Grid Background */}
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

                {/* User Beacon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <RoadsideBeacon size="lg" variant="emergency" />
                  <div className="absolute inset-0 rounded-full border-2 border-emergency-red/50 animate-ping scale-150"></div>
                </div>

                {/* GPS Lock */}
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-pulse-green/20 border border-pulse-green/30">
                    <MapPin className="w-3 h-3 text-pulse-green" />
                    <span className="text-xs font-tech text-pulse-green">GPS Locked</span>
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-3">
                <div className="p-3 rounded-lg tech-surface border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emergency-red" />
                    <span className="font-tech text-foreground text-sm">Your Location</span>
                  </div>
                  <p className="text-xs text-muted-foreground">123 Main St, New York, NY</p>
                </div>

                <div className="p-3 rounded-lg tech-surface border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Car className="w-4 h-4 text-beacon-blue" />
                    <span className="font-tech text-foreground text-sm">Vehicle</span>
                  </div>
                  <p className="text-xs text-muted-foreground">2019 Toyota Camry</p>
                </div>

                <EmergencyButton variant="primary" size="sm" className="w-full">
                  Confirm Location
                </EmergencyButton>
              </div>
            </div>
          </div>
        );

      case 3: // Pricing Preview
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col justify-center">
              <div className="text-center mb-8">
                <h2 className="font-tech text-xl text-foreground mb-2">Service Quote</h2>
                <p className="text-muted-foreground text-sm">Transparent pricing</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-6 rounded-xl tech-surface border border-border/50 text-center animate-scale-in">
                  <div className="text-3xl mb-2">🛞</div>
                  <h3 className="font-tech text-foreground mb-2">Flat Tire Service</h3>
                  <div className="text-2xl font-guardian text-pulse-green mb-2">$50</div>
                  <p className="text-xs text-muted-foreground">Fixed rate • No surprises</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="text-foreground">$65</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Discount</span>
                    <span className="text-pulse-green">-$15</span>
                  </div>
                  <hr className="border-border/30" />
                  <div className="flex justify-between font-tech">
                    <span className="text-foreground">Total</span>
                    <span className="text-pulse-green">$50</span>
                  </div>
                </div>
              </div>

              <EmergencyButton variant="primary" size="lg" className="w-full animate-heartbeat">
                Confirm & Dispatch
              </EmergencyButton>
            </div>
          </div>
        );

      case 4: // Dispatch & Tracking
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Dispatch Animation */}
              <div className="text-center mb-6">
                <div className="mb-4 animate-emergency-ripple">
                  <RoadsideBeacon size="lg" variant="emergency" />
                </div>
                <h2 className="font-tech text-xl text-foreground mb-2">Finding Your Guardian</h2>
                <p className="text-muted-foreground text-sm">Matching with nearby provider...</p>
              </div>

              {/* Provider Card Slide Up */}
              <div className="flex-1 animate-slide-in-up" style={{ animationDelay: '1s' }}>
                <div className="p-4 rounded-xl tech-surface border border-border/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-pulse-green/20 flex items-center justify-center">
                      <span className="text-lg">👨‍🔧</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-tech text-foreground">John Martinez</h3>
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-pulse-green" />
                        <span className="text-xs text-muted-foreground">4.9 • 1,245 jobs</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-tech text-pulse-green">ETA</div>
                      <div className="text-xl font-guardian text-foreground">12min</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Car className="w-3 h-3" />
                      <span>RAM Tow Truck • License: TX-789</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-pulse-green" />
                      <span>Verified Provider • Insured</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-pulse-green animate-pulse"></div>
                    <span className="text-sm font-tech text-pulse-green">Dispatched</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-border"></div>
                    <span className="text-sm text-muted-foreground">En Route</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-border"></div>
                    <span className="text-sm text-muted-foreground">Arrived</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Concierge Update
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Map Tracking */}
              <div className="flex-1 relative rounded-xl bg-asphalt-gray/30 border border-border/30 overflow-hidden mb-4">
                {/* Grid Background */}
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

                {/* Route Line */}
                <svg className="absolute inset-0 w-full h-full">
                  <path
                    d="M 30,80 Q 50,40 80,30"
                    stroke="hsl(var(--pulse-green))"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    fill="none"
                    className="animate-pulse"
                  />
                </svg>

                {/* User Beacon */}
                <div className="absolute bottom-6 left-6">
                  <RoadsideBeacon size="md" variant="emergency" />
                </div>

                {/* Provider Vehicle (Moving) */}
                <div className="absolute top-8 right-8 animate-pulse">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-pulse-green/20 border border-pulse-green/30">
                    <Car className="w-3 h-3 text-pulse-green" />
                    <span className="text-xs font-tech text-pulse-green">John</span>
                  </div>
                </div>

                {/* ETA Badge */}
                <div className="absolute top-3 left-3">
                  <div className="px-3 py-1 rounded-full bg-emergency-red/20 border border-emergency-red/30">
                    <span className="text-xs font-tech text-emergency-red">ETA: 6 min</span>
                  </div>
                </div>
              </div>

              {/* AI Concierge Update */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-beacon-blue/20 border border-beacon-blue/30 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-beacon-blue/30 flex items-center justify-center animate-pulse">
                      <Shield className="w-4 h-4 text-beacon-blue" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-tech text-beacon-blue mb-1">Safety Update</p>
                      <p className="text-xs text-foreground">
                        Your provider is 6 minutes away. Stay safe inside your vehicle until they arrive.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline Progress */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-pulse-green" />
                    <span className="text-pulse-green">Dispatched</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pulse-green animate-pulse"></div>
                    <span className="text-pulse-green font-tech">En Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Arrived</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Arrival & Verification
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col justify-center">
              <div className="text-center mb-6">
                <div className="mb-4">
                  <RoadsideBeacon size="lg" variant="guardian" />
                </div>
                <h2 className="font-tech text-xl text-foreground mb-2">Provider Arrived</h2>
                <p className="text-muted-foreground text-sm">Verify provider identity</p>
              </div>

              {/* ID Verification */}
              <div className="space-y-4 mb-6">
                <div className="p-4 rounded-xl tech-surface border border-border/50">
                  <h3 className="font-tech text-foreground mb-3 text-center">ID Match Verification</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-pulse-green/20 flex items-center justify-center">
                        <span className="text-lg">👨‍🔧</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Provider Photo</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-beacon-blue/20 flex items-center justify-center">
                        <Car className="w-6 h-6 text-beacon-blue" />
                      </div>
                      <p className="text-xs text-muted-foreground">Vehicle: TX-789</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pulse-green/20 border border-pulse-green/30">
                      <CheckCircle className="w-4 h-4 text-pulse-green" />
                      <span className="text-sm font-tech text-pulse-green">Verified Match</span>
                    </div>
                  </div>
                </div>
              </div>

              <EmergencyButton variant="primary" size="lg" className="w-full">
                Confirm Provider
              </EmergencyButton>
            </div>
          </div>
        );

      case 7: // Job Completion
        return (
          <div key={animationKey} className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/30 p-6 overflow-hidden">
            <div className="h-full flex flex-col justify-center text-center">
              {/* Completion Animation */}
              <div className="mb-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full bg-pulse-green/20 animate-ping scale-125"></div>
                  <div className="relative w-20 h-20 mx-auto rounded-full bg-pulse-green/30 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-pulse-green animate-scale-in" />
                  </div>
                </div>
                
                <h2 className="font-guardian text-2xl text-foreground mb-2">Service Complete</h2>
                <p className="text-muted-foreground">Your receipt has been saved</p>
              </div>

              {/* Receipt Card */}
              <div className="p-4 rounded-xl tech-surface border border-border/50 mb-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <h3 className="font-tech text-foreground mb-3">Service Summary</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="text-foreground">Flat Tire Replacement</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider</span>
                    <span className="text-foreground">John Martinez</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="text-foreground">22 minutes</span>
                  </div>
                  <hr className="border-border/30" />
                  <div className="flex justify-between font-tech">
                    <span className="text-foreground">Total</span>
                    <span className="text-pulse-green">$50.00</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <EmergencyButton variant="ghost" size="sm" className="w-full">
                  View Full Receipt
                </EmergencyButton>
                <EmergencyButton variant="primary" size="sm" className="w-full">
                  Rate Experience
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
              <p className="text-muted-foreground font-tech mt-4">Demo Step {currentStep}</p>
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

export default ClientJourney;