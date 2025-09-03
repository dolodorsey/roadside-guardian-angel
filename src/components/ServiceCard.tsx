import React from 'react';
import { Card } from '@/components/ui/card';
import EmergencyButton from './EmergencyButton';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  estimatedTime: string;
  onRequest: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  estimatedTime,
  onRequest
}) => {
  return (
    <Card className="tech-surface p-6 hover:shadow-luxury transition-all duration-300 animate-guardian-enter">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-gradient-neon flex items-center justify-center min-w-[48px]">
          {icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-guardian text-lg text-foreground mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
            {description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-neon-green font-tech text-sm">
              ⚡ {estimatedTime}
            </div>
            
            <EmergencyButton 
              variant="secondary" 
              size="sm"
              onClick={onRequest}
            >
              Request
            </EmergencyButton>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;