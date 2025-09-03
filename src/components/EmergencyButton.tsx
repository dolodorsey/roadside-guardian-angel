import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import RoadsideBeacon from './RoadsideBeacon';
import EmergencyFloatingButton from './emergency/EmergencyFloatingButton';
import EmergencyMode from './emergency/EmergencyMode';

interface EmergencyButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  showBeacon?: boolean;
  disabled?: boolean;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  showBeacon = false,
  disabled = false
}) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [isSilentMode, setIsSilentMode] = useState(false);
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

  const handleEmergencyActivate = () => {
    setIsEmergencyActive(true);
  };

  const handleVoiceCommand = () => {
    setIsEmergencyActive(true);
  };

  return (
    <>
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`
          ${getVariantClasses()}
          ${getSizeClasses()}
          rounded-xl
          transition-all duration-300
          relative
          overflow-hidden
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
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

      {/* Emergency System */}
      <EmergencyFloatingButton
        onEmergencyActivate={handleEmergencyActivate}
        onVoiceCommand={handleVoiceCommand}
        batteryLevel={85} // This would come from a battery API
      />

      <EmergencyMode
        isActive={isEmergencyActive}
        onClose={() => setIsEmergencyActive(false)}
        batteryLevel={85}
        userLocation={{ lat: 40.7128, lng: -74.0060 }}
        isSilentMode={isSilentMode}
      />
    </>
  );
};

export default EmergencyButton;