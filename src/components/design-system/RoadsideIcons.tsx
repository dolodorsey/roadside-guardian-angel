import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Truck, 
  Battery, 
  Circle as Wheel, 
  Fuel, 
  Lock, 
  Shield,
  Zap,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation
} from 'lucide-react';

interface IconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'emergency' | 'success' | 'warning' | 'beacon';
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const variantClasses = {
  default: 'text-foreground',
  emergency: 'text-emergency-red drop-shadow-[0_0_8px_hsl(var(--emergency-red)/0.4)]',
  success: 'text-pulse-green drop-shadow-[0_0_8px_hsl(var(--pulse-green)/0.4)]',
  warning: 'text-yellow-400 drop-shadow-[0_0_8px_hsl(45_100%_60%/0.4)]',
  beacon: 'text-beacon-blue drop-shadow-[0_0_8px_hsl(var(--beacon-blue)/0.4)]'
};

const BaseIcon: React.FC<{ 
  children: React.ReactNode; 
  size: IconProps['size']; 
  variant: IconProps['variant']; 
  animated?: boolean;
  className?: string;
}> = ({ children, size = 'md', variant = 'default', animated = false, className }) => (
  <div 
    className={cn(
      sizeClasses[size],
      variantClasses[variant],
      animated && 'transition-all duration-300',
      className
    )}
  >
    {children}
  </div>
);

export const RoadsideIcons = {
  // Core Service Icons
  TowTruck: ({ size = 'md', variant = 'default', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'hover:scale-110', className)}>
      <Truck className={cn(sizeClasses[size], animated && 'animate-pulse')} />
    </BaseIcon>
  ),

  Battery: ({ size = 'md', variant = 'warning', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'hover:scale-110', className)}>
      <Battery className={cn(sizeClasses[size], animated && 'animate-heartbeat')} />
    </BaseIcon>
  ),

  Tire: ({ size = 'md', variant = 'default', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'hover:rotate-45 transition-transform', className)}>
      <Wheel className={sizeClasses[size]} />
    </BaseIcon>
  ),

  Fuel: ({ size = 'md', variant = 'beacon', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'hover:scale-110', className)}>
      <Fuel className={cn(sizeClasses[size], animated && 'animate-pulse')} />
    </BaseIcon>
  ),

  // Security & Trust Icons
  Lock: ({ size = 'md', variant = 'success', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'hover:animate-shield-lock', className)}>
      <Lock className={sizeClasses[size]} />
    </BaseIcon>
  ),

  Shield: ({ size = 'md', variant = 'success', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'hover:animate-shield-lock', className)}>
      <Shield className={sizeClasses[size]} />
    </BaseIcon>
  ),

  // Status Icons
  Emergency: ({ size = 'md', variant = 'emergency', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'animate-heartbeat', className)}>
      <AlertTriangle className={sizeClasses[size]} />
    </BaseIcon>
  ),

  Success: ({ size = 'md', variant = 'success', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'animate-scale-in', className)}>
      <CheckCircle className={sizeClasses[size]} />
    </BaseIcon>
  ),

  // Navigation & Tracking
  Location: ({ size = 'md', variant = 'beacon', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'animate-heartbeat', className)}>
      <MapPin className={sizeClasses[size]} />
    </BaseIcon>
  ),

  Navigation: ({ size = 'md', variant = 'beacon', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'hover:rotate-12 transition-transform', className)}>
      <Navigation className={sizeClasses[size]} />
    </BaseIcon>
  ),

  // Communication
  Phone: ({ size = 'md', variant = 'emergency', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'hover:animate-heartbeat', className)}>
      <Phone className={sizeClasses[size]} />
    </BaseIcon>
  ),

  // Time & Status
  Clock: ({ size = 'md', variant = 'default', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={className}>
      <Clock className={sizeClasses[size]} />
    </BaseIcon>
  ),

  // Energy & Power
  Lightning: ({ size = 'md', variant = 'warning', animated = true, className }: IconProps) => (
    <BaseIcon size={size} variant={variant} animated={animated} className={cn(animated && 'animate-pulse', className)}>
      <Zap className={sizeClasses[size]} />
    </BaseIcon>
  )
};

export default RoadsideIcons;