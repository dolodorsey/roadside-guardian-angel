import React, { useState, useEffect } from 'react';
import { ServiceRequest } from '../ServiceRequestFlow';
import EmergencyButton from '../EmergencyButton';
import { Clock, DollarSign, MapPin, Shield } from 'lucide-react';

interface PricingPreviewStepProps {
  onNext: () => void;
  onBack: () => void;
  serviceRequest: ServiceRequest;
  onPricingConfirm: (pricing: { estimate: string; eta: number }) => void;
}

const PricingPreviewStep: React.FC<PricingPreviewStepProps> = ({
  onNext,
  onBack,
  serviceRequest,
  onPricingConfirm
}) => {
  const [pricing, setPricing] = useState({
    estimate: '',
    eta: 0
  });
  const [isCalculating, setIsCalculating] = useState(true);
  const [nearbyProvider, setNearbyProvider] = useState<any>(null);

  useEffect(() => {
    // Simulate pricing calculation
    const timer = setTimeout(() => {
      const servicePricing = {
        tow: { estimate: '$85–$120', eta: 12 },
        jumpstart: { estimate: '$45–$65', eta: 8 },
        tire: { estimate: '$55–$75', eta: 10 },
        lockout: { estimate: '$65–$85', eta: 15 },
        fuel: { estimate: '$35–$50', eta: 6 },
        other: { estimate: '$40–$80', eta: 10 }
      };

      const selectedPricing = servicePricing[serviceRequest.serviceType];
      setPricing(selectedPricing);
      
      setNearbyProvider({
        name: 'Mike\'s Roadside',
        rating: 4.9,
        distance: '2.3 miles away',
        vehicle: 'Honda Civic'
      });
      
      onPricingConfirm(selectedPricing);
      setIsCalculating(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [serviceRequest.serviceType, onPricingConfirm]);

  const serviceNames = {
    tow: 'Tow Service',
    jumpstart: 'Jump Start',
    tire: 'Flat Tire Repair',
    lockout: 'Vehicle Lockout',
    fuel: 'Fuel Delivery',
    other: 'Other Service'
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          Pricing & ETA
        </h2>
        <p className="text-muted-foreground">
          Transparent pricing with no hidden fees
        </p>
      </div>

      {/* Service Summary */}
      <div className="mb-6">
        <div className="p-6 rounded-2xl tech-surface border border-border/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emergency-red/20 border border-emergency-red/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emergency-red" />
            </div>
            <div>
              <h3 className="font-guardian text-xl text-foreground">
                {serviceNames[serviceRequest.serviceType]}
              </h3>
              <p className="text-muted-foreground text-sm">
                {serviceRequest.location.address}
              </p>
            </div>
          </div>

          {/* Vehicle Info */}
          {serviceRequest.vehicle && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-neon-green/5 border border-neon-green/20">
              <span className="text-neon-green text-sm font-tech">
                Vehicle: {serviceRequest.vehicle.year} {serviceRequest.vehicle.make} {serviceRequest.vehicle.model}
              </span>
            </div>
          )}

          {/* Notes */}
          {serviceRequest.notes && (
            <div className="p-3 rounded-lg bg-electric-blue/5 border border-electric-blue/20">
              <span className="text-electric-blue text-sm">
                Note: {serviceRequest.notes}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Display */}
      <div className="mb-6">
        {isCalculating ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-emergency-red/30 border-t-emergency-red animate-spin"></div>
            <p className="text-muted-foreground">Finding nearby providers...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Price Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emergency-red/10 to-neon-green/10 border border-neon-green/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-neon-green" />
                  <span className="font-guardian text-lg text-foreground">Estimated Cost</span>
                </div>
                <div className="font-guardian text-2xl text-neon-green">
                  {pricing.estimate}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Final price confirmed before service begins</span>
              </div>
            </div>

            {/* ETA Box */}
            <div className="p-6 rounded-2xl tech-surface border border-electric-blue/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-electric-blue" />
                  <span className="font-guardian text-lg text-foreground">Estimated Arrival</span>
                </div>
                <div className="font-guardian text-2xl text-electric-blue">
                  {pricing.eta} min
                </div>
              </div>

              {/* Nearby Provider Preview */}
              {nearbyProvider && (
                <div className="animate-fade-in">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-electric-blue/5 border border-electric-blue/20">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-neon-green flex items-center justify-center">
                      <span className="text-foreground text-sm font-bold">
                        {nearbyProvider.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-foreground text-sm font-tech">
                        {nearbyProvider.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        ⭐ {nearbyProvider.rating} • {nearbyProvider.distance}
                      </div>
                    </div>
                    <div className="text-electric-blue text-xs">
                      En route with {nearbyProvider.vehicle}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="mb-8 p-4 rounded-xl bg-metallic-silver/5 border border-metallic-silver/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="w-4 h-4" />
          <span>Payment charged only after service completion</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-auto">
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
          onClick={onNext}
          className="flex-1"
          disabled={isCalculating}
          showBeacon={true}
        >
          Confirm & Dispatch
        </EmergencyButton>
      </div>
    </div>
  );
};

export default PricingPreviewStep;