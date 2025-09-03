import React from 'react';

interface RoadsideBeaconProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emergency' | 'guardian' | 'tech';
  className?: string;
}

const RoadsideBeacon: React.FC<RoadsideBeaconProps> = ({ 
  size = 'md', 
  variant = 'emergency',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };

  const variantClasses = {
    emergency: 'bg-emergency-red shadow-emergency beacon-pulse',
    guardian: 'bg-neon-green shadow-guardian guardian-glow',
    tech: 'bg-electric-blue shadow-tech'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Outer pulse ring */}
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        ${variantClasses[variant]}
        relative
        before:absolute before:inset-0 before:rounded-full before:border-2
        ${variant === 'emergency' ? 'before:border-emergency-red/30' : ''}
        ${variant === 'guardian' ? 'before:border-neon-green/30' : ''}
        ${variant === 'tech' ? 'before:border-electric-blue/30' : ''}
        before:animate-ping
      `}>
        {/* Inner beacon */}
        <div className="absolute inset-2 rounded-full bg-foreground/90 flex items-center justify-center">
          {/* "R" Logo */}
          <span className="font-guardian text-midnight-black font-black text-xs">
            R
          </span>
        </div>
      </div>
      
      {/* Hazard triangle overlay for emergency variant */}
      {variant === 'emergency' && (
        <div className="absolute -top-1 -right-1">
          <div className="hazard-triangle"></div>
        </div>
      )}
    </div>
  );
};

export default RoadsideBeacon;