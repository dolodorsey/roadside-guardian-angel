import React, { useState } from 'react';
import { ServiceType } from '../ServiceRequestFlow';
import EmergencyButton from '../EmergencyButton';
import { 
  Truck, 
  Zap, 
  Circle, 
  Key, 
  Fuel, 
  MoreHorizontal 
} from 'lucide-react';

interface ServiceSelectionStepProps {
  onNext: () => void;
  onServiceSelect: (service: ServiceType) => void;
  selectedService?: ServiceType;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
  onNext,
  onServiceSelect,
  selectedService
}) => {
  const [expandedCard, setExpandedCard] = useState<ServiceType | null>(null);

  const services = [
    {
      type: 'tow' as ServiceType,
      title: 'Tow Service',
      description: 'Vehicle breakdown? We\'ll safely tow your car to your preferred location.',
      icon: <Truck className="w-8 h-8" />,
      color: 'emergency-red',
      animationClass: 'animate-pulse'
    },
    {
      type: 'jumpstart' as ServiceType,
      title: 'Jump Start',
      description: 'Dead battery? We\'ll send a jump-start provider near you.',
      icon: <Zap className="w-8 h-8" />,
      color: 'electric-blue',
      animationClass: 'animate-bounce'
    },
    {
      type: 'tire' as ServiceType,
      title: 'Flat Tire',
      description: 'Flat tire? Our technician will change it or provide a temporary fix.',
      icon: <Circle className="w-8 h-8" />,
      color: 'neon-green',
      animationClass: 'animate-spin'
    },
    {
      type: 'lockout' as ServiceType,
      title: 'Lockout',
      description: 'Locked out? Professional locksmith will safely unlock your vehicle.',
      icon: <Key className="w-8 h-8" />,
      color: 'metallic-silver',
      animationClass: 'animate-pulse'
    },
    {
      type: 'fuel' as ServiceType,
      title: 'Fuel Delivery',
      description: 'Out of gas? We\'ll deliver enough fuel to get you to the nearest station.',
      icon: <Fuel className="w-8 h-8" />,
      color: 'emergency-red',
      animationClass: 'animate-bounce'
    },
    {
      type: 'other' as ServiceType,
      title: 'Other Service',
      description: 'Need something else? Describe your situation and we\'ll help.',
      icon: <MoreHorizontal className="w-8 h-8" />,
      color: 'electric-blue',
      animationClass: 'animate-pulse'
    }
  ];

  const handleCardClick = (serviceType: ServiceType) => {
    if (expandedCard === serviceType) {
      onServiceSelect(serviceType);
      onNext();
    } else {
      setExpandedCard(serviceType);
      onServiceSelect(serviceType);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          What do you need help with?
        </h2>
        <p className="text-muted-foreground">
          Choose your service and we'll dispatch verified help immediately
        </p>
      </div>

      {/* Service Grid */}
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {services.map((service) => {
          const isExpanded = expandedCard === service.type;
          const isSelected = selectedService === service.type;
          
          return (
            <div
              key={service.type}
              onClick={() => handleCardClick(service.type)}
              className={`
                relative cursor-pointer transition-all duration-500
                ${isExpanded ? 'col-span-2 lg:col-span-3 scale-105' : ''}
                ${isSelected ? 'z-10' : ''}
              `}
            >
              <div className={`
                h-full min-h-[140px] p-6 rounded-2xl border-2 transition-all duration-300
                tech-surface hover:shadow-luxury
                ${isSelected 
                  ? `border-${service.color} shadow-${service.color === 'emergency-red' ? 'emergency' : service.color === 'electric-blue' ? 'tech' : 'guardian'}` 
                  : 'border-border/50 hover:border-neon-green/50'
                }
                ${isExpanded ? 'bg-gradient-to-br from-asphalt-gray/40 to-midnight-black/60' : ''}
              `}>
                {/* Icon */}
                <div className={`
                  w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center
                  ${isSelected ? `bg-${service.color}/20 border border-${service.color}/30` : 'bg-metallic-silver/10'}
                  ${service.animationClass}
                `} style={{ animationDuration: '2s' }}>
                  <div className={`${isSelected ? `text-${service.color}` : 'text-metallic-silver'}`}>
                    {service.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-guardian text-lg text-foreground text-center mb-2">
                  {service.title}
                </h3>

                {/* Description (shown when expanded) */}
                {isExpanded && (
                  <div className="animate-fade-in">
                    <p className="text-muted-foreground text-sm text-center mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <EmergencyButton
                      variant="primary"
                      size="lg"
                      onClick={() => onNext()}
                      className="w-full"
                      showBeacon={true}
                    >
                      Request This Service
                    </EmergencyButton>
                  </div>
                )}

                {/* Pulse effect for selected card */}
                {isSelected && !isExpanded && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-emergency-red animate-ping opacity-30"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Instructions */}
      <div className="text-center mt-6">
        <p className="text-muted-foreground text-sm">
          Tap to select, tap again to continue
        </p>
      </div>
    </div>
  );
};

export default ServiceSelectionStep;