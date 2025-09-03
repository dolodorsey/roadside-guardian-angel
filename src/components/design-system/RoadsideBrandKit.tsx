import React from 'react';
import { cn } from '@/lib/utils';
import { Typography } from './RoadsideTypography';
import { RoadsideIcons } from './RoadsideIcons';
import { Motion } from './RoadsideMotion';

// Brand Kit - Logo, Patterns, and Brand Elements
export const BrandKit = {
  // Primary Logo
  Logo: ({ size = 'md', variant = 'default', className }: { 
    size?: 'sm' | 'md' | 'lg' | 'xl'; 
    variant?: 'default' | 'monochrome' | 'emergency';
    className?: string;
  }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12', 
      lg: 'w-16 h-16',
      xl: 'w-24 h-24'
    };

    const variantClasses = {
      default: 'bg-emergency-red text-foreground',
      monochrome: 'bg-foreground text-midnight-black',
      emergency: 'bg-emergency-red text-foreground animate-heartbeat'
    };

    return (
      <div className={cn(
        sizeClasses[size],
        variantClasses[variant],
        'rounded-lg flex items-center justify-center',
        'font-guardian font-black text-2xl',
        'drop-shadow-lg',
        className
      )}>
        R
      </div>
    );
  },

  // Roadside Wordmark
  Wordmark: ({ variant = 'default', className }: { 
    variant?: 'default' | 'emergency' | 'tech';
    className?: string;
  }) => {
    const variantClasses = {
      default: 'text-foreground',
      emergency: 'text-emergency-red drop-shadow-[0_0_10px_hsl(var(--emergency-red)/0.5)]',
      tech: 'text-beacon-blue drop-shadow-[0_0_8px_hsl(var(--beacon-blue)/0.4)]'
    };

    return (
      <div className={cn(
        'font-guardian text-4xl font-black tracking-tight',
        variantClasses[variant],
        className
      )}>
        ROADSIDE
      </div>
    );
  },

  // Brand Patterns
  AsphaltTexture: ({ className }: { className?: string }) => (
    <div className={cn(
      'absolute inset-0 opacity-5',
      'bg-gradient-to-br from-asphalt-gray via-transparent to-asphalt-gray',
      'bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_50%)]',
      className
    )} />
  ),

  NeonGlow: ({ variant = 'emergency', intensity = 'normal', className }: { 
    variant?: 'emergency' | 'success' | 'beacon';
    intensity?: 'subtle' | 'normal' | 'strong';
    className?: string;
  }) => {
    const glowVariants = {
      emergency: 'bg-emergency-red/20',
      success: 'bg-pulse-green/20', 
      beacon: 'bg-beacon-blue/20'
    };

    const intensityClasses = {
      subtle: 'blur-sm opacity-30',
      normal: 'blur-md opacity-50',
      strong: 'blur-lg opacity-70'
    };

    return (
      <div className={cn(
        'absolute inset-0 rounded-full',
        glowVariants[variant],
        intensityClasses[intensity],
        className
      )} />
    );
  },

  // Color Swatches for Documentation
  ColorPalette: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
      {[
        { name: 'Midnight Black', color: 'bg-midnight-black', hex: '#000000' },
        { name: 'Asphalt Gray', color: 'bg-asphalt-gray', hex: '#2C2C2C' },
        { name: 'Emergency Red', color: 'bg-emergency-red', hex: '#FF3B30' },
        { name: 'Beacon Blue', color: 'bg-beacon-blue', hex: '#007AFF' },
        { name: 'Pulse Green', color: 'bg-pulse-green', hex: '#00E676' },
        { name: 'Metallic Silver', color: 'bg-metallic-silver', hex: '#C0C0C0' }
      ].map(({ name, color, hex }) => (
        <div key={name} className="space-y-2">
          <div className={cn('w-full h-16 rounded-lg', color)} />
          <div>
            <Typography.Small className="font-medium text-foreground">{name}</Typography.Small>
            <Typography.Caption>{hex}</Typography.Caption>
          </div>
        </div>
      ))}
    </div>
  ),

  // Icon Library Showcase
  IconShowcase: () => (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-6 p-6">
      {[
        { name: 'Tow Truck', Component: RoadsideIcons.TowTruck },
        { name: 'Battery', Component: RoadsideIcons.Battery },
        { name: 'Tire', Component: RoadsideIcons.Tire },
        { name: 'Fuel', Component: RoadsideIcons.Fuel },
        { name: 'Shield', Component: RoadsideIcons.Shield },
        { name: 'Lock', Component: RoadsideIcons.Lock },
        { name: 'Emergency', Component: RoadsideIcons.Emergency },
        { name: 'Success', Component: RoadsideIcons.Success },
        { name: 'Location', Component: RoadsideIcons.Location },
        { name: 'Navigation', Component: RoadsideIcons.Navigation },
        { name: 'Phone', Component: RoadsideIcons.Phone },
        { name: 'Lightning', Component: RoadsideIcons.Lightning }
      ].map(({ name, Component }) => (
        <div key={name} className="flex flex-col items-center space-y-2">
          <Component size="lg" />
          <Typography.Caption className="text-center">{name}</Typography.Caption>
        </div>
      ))}
    </div>
  ),

  // Typography Scale
  TypographyScale: () => (
    <div className="space-y-6 p-6">
      <Typography.Hero>Hero Text</Typography.Hero>
      <Typography.Headline>Headline Text</Typography.Headline>
      <Typography.Subheadline>Subheadline Text</Typography.Subheadline>
      <Typography.Emergency>Emergency Alert</Typography.Emergency>
      <Typography.Body>Body text for descriptions and content.</Typography.Body>
      <Typography.Small>Small text for details</Typography.Small>
      <Typography.Caption>Caption text</Typography.Caption>
      <Typography.Trust>✓ Verified Trust Badge</Typography.Trust>
      <Typography.Tech>ETA: 4 minutes</Typography.Tech>
    </div>
  ),

  // Motion Examples
  MotionShowcase: () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      <Motion.SOSRipple className="w-16 h-16 rounded-full bg-emergency-red/20 flex items-center justify-center">
        <RoadsideIcons.Emergency size="md" />
      </Motion.SOSRipple>
      
      <Motion.ProviderLock className="w-16 h-16 rounded-full bg-pulse-green/20 flex items-center justify-center">
        <RoadsideIcons.Shield size="md" />
      </Motion.ProviderLock>
      
      <Motion.ArrivalBeacon className="w-16 h-16 rounded-full bg-beacon-blue/20 flex items-center justify-center">
        <RoadsideIcons.Location size="md" />
      </Motion.ArrivalBeacon>
      
      <Motion.CompletionGlow className="w-16 h-16 rounded-full bg-pulse-green/20 flex items-center justify-center">
        <RoadsideIcons.Success size="md" />
      </Motion.CompletionGlow>
    </div>
  )
};

export default BrandKit;