import React from 'react';
import { Button } from '@/components/ui/button';
import RoadsideBeacon from './RoadsideBeacon';

interface EmergencyButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  showBeacon?: boolean;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  showBeacon = false
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'emergency-cta text-foreground font-guardian hover:scale-105 active:scale-95';
      case 'secondary':
        return 'tech-surface border-border hover:border-electric-blue/50 text-foreground font-tech hover:shadow-tech';
      case 'ghost':
        return 'bg-transparent border-2 border-metallic-silver/30 text-metallic-silver hover:border-neon-green hover:text-neon-green hover:shadow-guardian';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-10 px-6 text-sm';
      case 'md':
        return 'h-12 px-8 text-base';
      case 'lg':
        return 'h-16 px-12 text-lg';
      default:
        return '';
    }
  };

  return (
    <Button
      onClick={onClick}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        rounded-xl
        transition-all duration-300
        relative
        overflow-hidden
        ${className}
      `}
    >
      {showBeacon && (
        <RoadsideBeacon 
          size="sm" 
          variant={variant === 'primary' ? 'emergency' : 'guardian'} 
          className="mr-3" 
        />
      )}
      <span className="relative z-10">{children}</span>
    </Button>
  );
};

export default EmergencyButton;