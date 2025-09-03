import React, { useState } from 'react';
import { Shield, Star, Clock, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VerifiedProviderProfileProps {
  provider: {
    id: string;
    name: string;
    company: string;
    photo: string;
    vehicle: {
      make: string;
      model: string;
      year: number;
      plate: string;
      color: string;
    };
    experience: {
      years: number;
      completedJobs: number;
    };
    rating: number;
    reviewSnippet: string;
    specialties: string[];
    isVerified: boolean;
    insurance: {
      coverage: number;
      provider: string;
    };
  };
  onSelect?: () => void;
  showInsurance?: boolean;
}

const VerifiedProviderProfile: React.FC<VerifiedProviderProfileProps> = ({
  provider,
  onSelect,
  showInsurance = true
}) => {
  const [showFullProfile, setShowFullProfile] = useState(false);

  const TrustBadge = () => (
    <div className="relative">
      <div className="absolute inset-0 bg-neon-green/20 rounded-full animate-pulse" />
      <div className="relative w-8 h-8 bg-neon-green/30 rounded-full flex items-center justify-center border border-neon-green/50">
        <Shield className="w-4 h-4 text-neon-green animate-shield-lock" />
      </div>
    </div>
  );

  return (
    <div className="tech-surface rounded-2xl p-6 border border-border/50 hover:border-neon-green/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="relative mr-4">
            <img
              src={provider.photo || '/api/placeholder/60/60'}
              alt={provider.name}
              className="w-15 h-15 rounded-full object-cover border-2 border-neon-green/30"
            />
            {provider.isVerified && (
              <div className="absolute -top-1 -right-1">
                <TrustBadge />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-guardian text-lg text-foreground mb-1">{provider.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{provider.company}</p>
            
            <div className="flex items-center mb-1">
              <div className="flex items-center mr-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-tech text-sm text-foreground">{provider.rating}</span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-electric-blue mr-1" />
                <span className="font-tech text-sm text-muted-foreground">
                  {provider.experience.completedJobs.toLocaleString()} jobs
                </span>
              </div>
            </div>
          </div>
        </div>

        {provider.isVerified && (
          <div className="flex items-center text-neon-green text-sm font-tech">
            <CheckCircle className="w-4 h-4 mr-1" />
            Verified
          </div>
        )}
      </div>

      {/* Vehicle Info */}
      <div className="bg-asphalt-gray/50 rounded-lg p-3 mb-4">
        <h4 className="font-tech text-sm text-foreground mb-2">Vehicle Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Vehicle:</span>
            <p className="text-foreground font-tech">
              {provider.vehicle.year} {provider.vehicle.make} {provider.vehicle.model}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Plate:</span>
            <p className="text-foreground font-tech font-mono tracking-wider">
              {provider.vehicle.plate}
            </p>
          </div>
        </div>
      </div>

      {/* Experience & Rating */}
      <div className="mb-4">
        <p className="text-muted-foreground text-sm mb-2">Recent Review:</p>
        <p className="text-foreground text-sm italic">"{provider.reviewSnippet}"</p>
      </div>

      {/* Insurance Coverage */}
      {showInsurance && (
        <div className="bg-gradient-to-r from-electric-blue/10 to-neon-green/10 rounded-lg p-3 mb-4 border border-electric-blue/20">
          <div className="flex items-center mb-2">
            <Shield className="w-4 h-4 text-electric-blue mr-2" />
            <span className="font-tech text-sm text-foreground">Insured Service</span>
          </div>
          <p className="text-xs text-muted-foreground">
            This service is insured up to ${provider.insurance.coverage.toLocaleString()} by {provider.insurance.provider}
          </p>
        </div>
      )}

      {/* Specialties */}
      {provider.specialties.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {provider.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-emergency-red/10 text-emergency-red text-xs rounded-full border border-emergency-red/20"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onSelect}
          className="flex-1 emergency-cta font-guardian"
        >
          Select Provider
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowFullProfile(!showFullProfile)}
          className="border-border hover:border-electric-blue/50"
        >
          {showFullProfile ? 'Less' : 'More'} Info
        </Button>
      </div>

      {/* Expanded Details */}
      {showFullProfile && (
        <div className="mt-4 pt-4 border-t border-border/30 animate-fade-in">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Experience:</span>
              <p className="text-foreground font-tech">{provider.experience.years} years</p>
            </div>
            <div>
              <span className="text-muted-foreground">Response Time:</span>
              <p className="text-foreground font-tech">Avg 8 minutes</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifiedProviderProfile;