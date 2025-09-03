import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import EmergencyButton from '../EmergencyButton';
import { Car } from 'lucide-react';

interface ProfileStepProps {
  onNext: () => void;
  onBack?: () => void;
  isLastStep: boolean;
}

const ProfileStep: React.FC<ProfileStepProps> = ({ onNext, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: ''
  });

  const [vehicleAdded, setVehicleAdded] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Trigger vehicle animation when all vehicle fields are filled
    if (['vehicleMake', 'vehicleModel', 'vehicleYear'].includes(field)) {
      const hasAllVehicleData = formData.vehicleMake && formData.vehicleModel && formData.vehicleYear && value;
      if (hasAllVehicleData && !vehicleAdded) {
        setVehicleAdded(true);
      }
    }
  };

  const isFormValid = formData.fullName && formData.phone && formData.email;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          Create Your Profile
        </h2>
        <p className="text-muted-foreground">
          Quick setup for faster assistance
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Required Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-foreground font-tech">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="mt-2 tech-surface border-border/50 focus:border-neon-green focus:shadow-guardian"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <Label htmlFor="phone" className="text-foreground font-tech">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="mt-2 tech-surface border-border/50 focus:border-electric-blue focus:shadow-tech"
              placeholder="(555) 123-4567"
            />
          </div>
          
          <div>
            <Label htmlFor="email" className="text-foreground font-tech">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-2 tech-surface border-border/50 focus:border-neon-green focus:shadow-guardian"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Vehicle Section */}
        <div className="pt-4 border-t border-border/30">
          <div className="mb-4 flex items-center gap-2">
            <Car className="w-5 h-5 text-electric-blue" />
            <Label className="text-foreground font-tech">Add Your Vehicle (Optional)</Label>
          </div>
          
          {/* Vehicle Silhouette Animation */}
          <div className="mb-4 flex justify-center">
            <div className={`relative transition-all duration-500 ${vehicleAdded ? 'scale-110' : 'scale-100'}`}>
              <div className={`w-24 h-12 rounded-lg border-2 transition-all duration-500 flex items-center justify-center ${
                vehicleAdded 
                  ? 'border-neon-green bg-neon-green/10 shadow-guardian' 
                  : 'border-metallic-silver/30 bg-metallic-silver/5'
              }`}>
                <Car className={`w-8 h-8 transition-colors duration-500 ${
                  vehicleAdded ? 'text-neon-green' : 'text-metallic-silver/50'
                }`} />
              </div>
              
              {vehicleAdded && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center animate-scale-in">
                  <span className="text-midnight-black text-xs font-bold">✓</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                value={formData.vehicleMake}
                onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                className="tech-surface border-border/50 focus:border-electric-blue"
                placeholder="Make"
              />
            </div>
            <div>
              <Input
                value={formData.vehicleModel}
                onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                className="tech-surface border-border/50 focus:border-electric-blue"
                placeholder="Model"
              />
            </div>
            <div>
              <Input
                value={formData.vehicleYear}
                onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                className="tech-surface border-border/50 focus:border-electric-blue"
                placeholder="Year"
              />
            </div>
            <div>
              <Input
                value={formData.licensePlate}
                onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                className="tech-surface border-border/50 focus:border-electric-blue"
                placeholder="License Plate"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8">
        {onBack && (
          <EmergencyButton
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </EmergencyButton>
        )}
        <EmergencyButton
          variant="primary"
          size="lg"
          onClick={onNext}
          className="flex-1"
          disabled={!isFormValid}
        >
          Continue
        </EmergencyButton>
      </div>
    </div>
  );
};

export default ProfileStep;