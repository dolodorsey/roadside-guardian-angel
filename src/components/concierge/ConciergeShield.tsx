import React from 'react';
import { Shield } from 'lucide-react';

interface ConciergeShieldProps {
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'electric-blue' | 'neon-green' | 'white' | 'default';
}

const ConciergeShield: React.FC<ConciergeShieldProps> = ({
  isAnimating = false,
  size = 'md',
  variant = 'electric-blue'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const variantClasses = {
    'electric-blue': 'text-electric-blue',
    'neon-green': 'text-neon-green',
    'white': 'text-white',
    'default': 'text-foreground'
  };

  const glowClasses = {
    'electric-blue': 'shadow-tech',
    'neon-green': 'shadow-guardian',
    'white': 'shadow-lg',
    'default': 'shadow-md'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated rings for voice/activity indication */}
      {isAnimating && (
        <>
          <div className={`absolute ${sizeClasses[size]} rounded-full bg-electric-blue/20 animate-ping`} />
          <div 
            className={`absolute ${sizeClasses[size]} rounded-full bg-electric-blue/30 animate-ping`}
            style={{ animationDelay: '0.5s' }}
          />
          <div 
            className={`absolute ${sizeClasses[size]} rounded-full bg-electric-blue/40 animate-ping`}
            style={{ animationDelay: '1s' }}
          />
        </>
      )}
      
      {/* Main shield container */}
      <div 
        className={`relative ${sizeClasses[size]} rounded-full bg-electric-blue/20 ${glowClasses[variant]} 
                   flex items-center justify-center border border-electric-blue/30 ${
                     isAnimating ? 'animate-pulse' : ''
                   }`}
      >
        {/* Inner glow effect */}
        <div className={`absolute inset-1 rounded-full bg-electric-blue/10 blur-sm ${isAnimating ? 'animate-pulse' : ''}`} />
        
        {/* Shield icon */}
        <Shield className={`${iconSizes[size]} ${variantClasses[variant]} relative z-10`} />
      </div>

      {/* Voice waveform effect when speaking */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-end space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-electric-blue/60 rounded-full animate-pulse"
                style={{
                  height: `${Math.random() * 8 + 4}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConciergeShield;