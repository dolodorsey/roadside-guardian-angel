import React from 'react';
import { cn } from '@/lib/utils';

// Typography Component System
export const Typography = {
  // Hero Headlines
  Hero: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 
      className={cn(
        "font-guardian text-5xl md:text-7xl font-black text-foreground",
        "tracking-tight leading-none",
        "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  ),

  // Section Headlines
  Headline: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 
      className={cn(
        "font-guardian text-3xl md:text-4xl font-bold text-foreground",
        "tracking-tight leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  ),

  // Subheadlines
  Subheadline: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 
      className={cn(
        "font-tech text-xl md:text-2xl font-semibold text-foreground/90",
        "tracking-tight leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  ),

  // Emergency Text (Always Red, Uppercase)
  Emergency: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div 
      className={cn(
        "font-guardian text-lg font-black text-emergency-red uppercase",
        "tracking-wide leading-none",
        "drop-shadow-[0_0_10px_hsl(var(--emergency-red)/0.5)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  ),

  // Body Text
  Body: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p 
      className={cn(
        "font-inter text-base text-foreground/80",
        "leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </p>
  ),

  // Small Text
  Small: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span 
      className={cn(
        "font-inter text-sm text-muted-foreground",
        "leading-normal",
        className
      )}
      {...props}
    >
      {children}
    </span>
  ),

  // Caption Text
  Caption: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span 
      className={cn(
        "font-inter text-xs text-muted-foreground uppercase",
        "tracking-wide font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  ),

  // Trust/Safety Badge Text
  Trust: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span 
      className={cn(
        "font-tech text-sm font-semibold text-pulse-green",
        "drop-shadow-[0_0_8px_hsl(var(--pulse-green)/0.4)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  ),

  // Tech/Data Text
  Tech: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span 
      className={cn(
        "font-tech text-sm font-medium text-beacon-blue",
        "drop-shadow-[0_0_6px_hsl(var(--beacon-blue)/0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
};

export default Typography;