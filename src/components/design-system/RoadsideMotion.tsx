import React from 'react';
import { cn } from '@/lib/utils';

// Motion Library - Cinematic Animations & Microinteractions
export const Motion = {
  // SOS Emergency Sequence
  SOSRipple: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-emergency-red/20 before:animate-emergency-ripple",
        "after:absolute after:inset-2 after:rounded-full", 
        "after:bg-emergency-red/10 after:animate-emergency-ripple after:animation-delay-150",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Provider Match Lock-In Animation
  ProviderLock: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "animate-shield-lock",
        "drop-shadow-[0_0_20px_hsl(var(--pulse-green)/0.6)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Arrival Beacon Flash
  ArrivalBeacon: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "relative",
        "before:absolute before:inset-0 before:rounded-full",
        "before:bg-beacon-blue/30 before:animate-ping",
        "animate-heartbeat",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Completion Checkmark
  CompletionGlow: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "animate-scale-in",
        "drop-shadow-[0_0_15px_hsl(var(--pulse-green)/0.8)]",
        "transition-all duration-500",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Loading States
  TireSpinner: ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "w-8 h-8 border-4 border-foreground/20 border-l-foreground rounded-full",
        "animate-spin",
        className
      )}
      {...props}
    />
  ),

  // Hazard Pulse
  HazardPulse: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "animate-heartbeat",
        "drop-shadow-[0_0_12px_hsl(var(--emergency-red)/0.6)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Shimmer Effect for Premium Elements
  PremiumShimmer: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "relative overflow-hidden",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-metallic-silver/20 before:to-transparent",
        "before:animate-shimmer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Guardian Enter Animation
  GuardianEnter: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "animate-guardian-enter",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Slide In Animations
  SlideInUp: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "animate-slide-in-up",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  SlideInDown: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "animate-slide-in-down",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Hover Interactions
  HoverScale: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "transition-transform duration-200 hover:scale-105",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  HoverGlow: ({ children, variant = 'emergency', className, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'emergency' | 'success' | 'beacon' }) => {
    const glowClasses = {
      emergency: 'hover:drop-shadow-[0_0_20px_hsl(var(--emergency-red)/0.5)]',
      success: 'hover:drop-shadow-[0_0_20px_hsl(var(--pulse-green)/0.5)]',
      beacon: 'hover:drop-shadow-[0_0_20px_hsl(var(--beacon-blue)/0.5)]'
    };

    return (
      <div 
        className={cn(
          "transition-all duration-300",
          glowClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
};

export default Motion;