import React from 'react';
import { Shield } from 'lucide-react';

interface CinematicBeaconProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emergency' | 'safe' | 'warning';
}

const CinematicBeacon: React.FC<CinematicBeaconProps> = ({
  size = 'md',
  variant = 'emergency'
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const variantClasses = {
    emergency: 'bg-emergency-red',
    safe: 'bg-neon-green',
    warning: 'bg-electric-blue'
  };

  const glowClasses = {
    emergency: 'shadow-emergency',
    safe: 'shadow-guardian',
    warning: 'shadow-tech'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer pulse rings */}
      <div className={`absolute ${sizeClasses[size]} rounded-full ${variantClasses[variant]}/20 animate-ping`} />
      <div 
        className={`absolute ${sizeClasses[size]} rounded-full ${variantClasses[variant]}/30 animate-ping`}
        style={{ animationDelay: '0.5s' }}
      />
      <div 
        className={`absolute ${sizeClasses[size]} rounded-full ${variantClasses[variant]}/40 animate-ping`}
        style={{ animationDelay: '1s' }}
      />
      
      {/* Main beacon core */}
      <div 
        className={`relative ${sizeClasses[size]} rounded-full ${variantClasses[variant]}/90 ${glowClasses[variant]} 
                   flex items-center justify-center animate-pulse border-2 border-white/20`}
      >
        {/* Inner glow */}
        <div className={`absolute inset-2 rounded-full ${variantClasses[variant]}/60 blur-sm`} />
        
        {/* Center icon */}
        <Shield className={`${iconSizes[size]} text-white relative z-10`} />
      </div>

      {/* Heartbeat rhythm overlay */}
      <div 
        className={`absolute ${sizeClasses[size]} rounded-full border-2 border-white/40 animate-pulse`}
        style={{ 
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          animationDelay: '0.2s'
        }}
      />
    </div>
  );
};

export default CinematicBeacon;