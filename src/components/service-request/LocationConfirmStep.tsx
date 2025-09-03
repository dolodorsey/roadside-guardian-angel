import React, { useState, useEffect } from 'react';
import { ServiceType } from '../ServiceRequestFlow';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import EmergencyButton from '../EmergencyButton';
import RoadsideBeacon from '../RoadsideBeacon';
import { MapPin, Car, Navigation } from 'lucide-react';

interface LocationConfirmStepProps {
  onNext: () => void;
  onBack: () => void;
  onLocationConfirm: (
    location: { lat: number; lng: number; address: string },
    vehicle?: { make: string; model: string; year: string; plate: string },
    notes?: string
  ) => void;
  serviceType: ServiceType;
}

const LocationConfirmStep: React.FC<LocationConfirmStepProps> = ({
  onNext,
  onBack,
  onLocationConfirm,
  serviceType
}) => {
  const [location, setLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    address: 'Getting your location...'
  });
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    plate: ''
  });
  const [notes, setNotes] = useState('');
  const [locationLocked, setLocationLocked] = useState(false);

  useEffect(() => {
    // Simulate getting user's location
    const timer = setTimeout(() => {
      setLocation({
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Main St, New York, NY 10001'
      });
      setLocationLocked(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    onLocationConfirm(
      location,
      vehicle.make ? vehicle : undefined,
      notes
    );
    onNext();
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Map Section */}
      <div className="flex-1 mb-6">
        <div className="relative h-64 rounded-2xl bg-gradient-to-b from-asphalt-gray/50 to-midnight-black border border-border/50 overflow-hidden mb-4">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                  linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          {/* User Beacon */}
          <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${locationLocked ? 'scale-100' : 'scale-150 opacity-60'}`}>
            <RoadsideBeacon size="lg" variant="emergency" />
            
            {/* Location Lock Animation */}
            {locationLocked && (
              <div className="absolute inset-0 rounded-full border-2 border-emergency-red/50 animate-ping scale-150"></div>
            )}
          </div>

          {/* Vehicle Overlay */}
          {vehicle.make && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-fade-in">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neon-green/20 border border-neon-green/30">
                <Car className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green text-sm font-tech">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </span>
              </div>
            </div>
          )}

          {/* GPS Lock Indicator */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-500 ${
              locationLocked 
                ? 'bg-neon-green/20 border border-neon-green/30' 
                : 'bg-metallic-silver/20 border border-metallic-silver/30'
            }`}>
              <Navigation className={`w-4 h-4 ${locationLocked ? 'text-neon-green' : 'text-metallic-silver'}`} />
              <span className={`text-sm font-tech ${locationLocked ? 'text-neon-green' : 'text-metallic-silver'}`}>
                {locationLocked ? 'GPS Locked' : 'Locating...'}
              </span>
            </div>
          </div>
        </div>

        {/* Address Display */}
        <div className="flex items-center gap-3 p-4 rounded-xl tech-surface border border-border/50">
          <MapPin className="w-5 h-5 text-emergency-red" />
          <div className="flex-1">
            <div className="text-foreground font-tech">Help will find you here:</div>
            <div className="text-muted-foreground text-sm">{location.address}</div>
          </div>
          <button className="text-electric-blue text-sm hover:text-electric-blue/80 transition-colors">
            Adjust
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-6">
        {/* Vehicle Selection */}
        <div>
          <Label className="text-foreground font-tech mb-3 block">Your Vehicle (Optional)</Label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Make"
              value={vehicle.make}
              onChange={(e) => setVehicle(prev => ({ ...prev, make: e.target.value }))}
              className="tech-surface border-border/50 focus:border-electric-blue"
            />
            <Input
              placeholder="Model"
              value={vehicle.model}
              onChange={(e) => setVehicle(prev => ({ ...prev, model: e.target.value }))}
              className="tech-surface border-border/50 focus:border-electric-blue"
            />
            <Input
              placeholder="Year"
              value={vehicle.year}
              onChange={(e) => setVehicle(prev => ({ ...prev, year: e.target.value }))}
              className="tech-surface border-border/50 focus:border-electric-blue"
            />
            <Input
              placeholder="License Plate"
              value={vehicle.plate}
              onChange={(e) => setVehicle(prev => ({ ...prev, plate: e.target.value }))}
              className="tech-surface border-border/50 focus:border-electric-blue"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label className="text-foreground font-tech mb-3 block">Anything we should know?</Label>
          <Textarea
            placeholder="Describe the issue, location details, or special instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="tech-surface border-border/50 focus:border-neon-green min-h-[80px]"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        <EmergencyButton
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </EmergencyButton>
        <EmergencyButton
          variant="primary"
          size="lg"
          onClick={handleContinue}
          className="flex-1"
          disabled={!locationLocked}
        >
          Confirm Location
        </EmergencyButton>
      </div>
    </div>
  );
};

export default LocationConfirmStep;