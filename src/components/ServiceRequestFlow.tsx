import React, { useState } from 'react';
import ServiceSelectionStep from './service-request/ServiceSelectionStep';
import LocationConfirmStep from './service-request/LocationConfirmStep';
import PricingPreviewStep from './service-request/PricingPreviewStep';
import ProviderMatchStep from './service-request/ProviderMatchStep';
import LiveTrackingStep from './service-request/LiveTrackingStep';

export type ServiceType = 'tow' | 'jumpstart' | 'tire' | 'lockout' | 'fuel' | 'other';

export interface ServiceRequest {
  serviceType: ServiceType;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  vehicle?: {
    make: string;
    model: string;
    year: string;
    plate: string;
  };
  notes: string;
  pricing: {
    estimate: string;
    eta: number;
  };
  provider?: {
    id: string;
    name: string;
    photo: string;
    rating: number;
    reviews: number;
    vehicle: string;
    company: string;
    verified: boolean;
  };
}

interface ServiceRequestFlowProps {
  onCancel: () => void;
  fastTrack?: boolean;
}

const ServiceRequestFlow: React.FC<ServiceRequestFlowProps> = ({ onCancel, fastTrack = false }) => {
  const [currentStep, setCurrentStep] = useState(fastTrack ? 3 : 0);
  const [serviceRequest, setServiceRequest] = useState<Partial<ServiceRequest>>({});

  const steps = [
    'Service Selection',
    'Location Confirm', 
    'Pricing Preview',
    'Provider Match',
    'Live Tracking'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateServiceRequest = (updates: Partial<ServiceRequest>) => {
    setServiceRequest(prev => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ServiceSelectionStep
            onNext={handleNext}
            onServiceSelect={(serviceType) => updateServiceRequest({ serviceType })}
            selectedService={serviceRequest.serviceType}
          />
        );
      case 1:
        return (
          <LocationConfirmStep
            onNext={handleNext}
            onBack={handleBack}
            onLocationConfirm={(location, vehicle, notes) => 
              updateServiceRequest({ location, vehicle, notes })
            }
            serviceType={serviceRequest.serviceType!}
          />
        );
      case 2:
        return (
          <PricingPreviewStep
            onNext={handleNext}
            onBack={handleBack}
            serviceRequest={serviceRequest as ServiceRequest}
            onPricingConfirm={(pricing) => updateServiceRequest({ pricing })}
          />
        );
      case 3:
        return (
          <ProviderMatchStep
            onNext={handleNext}
            serviceRequest={serviceRequest as ServiceRequest}
            onProviderMatch={(provider) => updateServiceRequest({ provider })}
          />
        );
      case 4:
        return (
          <LiveTrackingStep
            serviceRequest={serviceRequest as ServiceRequest}
            onComplete={onCancel}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-midnight-black to-asphalt-gray">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/30">
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        
        <div className="text-center">
          <h1 className="font-guardian text-lg text-foreground">
            {fastTrack ? 'Emergency Request' : steps[currentStep]}
          </h1>
          {!fastTrack && (
            <div className="flex justify-center mt-2 gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep 
                      ? 'bg-emergency-red shadow-emergency' 
                      : 'bg-metallic-silver/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {fastTrack && (
          <div className="text-emergency-red text-sm font-tech">
            🚨 Fast Track
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-hidden">
        {renderStep()}
      </div>
    </div>
  );
};

export default ServiceRequestFlow;