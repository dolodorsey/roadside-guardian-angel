import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Tow truck
export const TowIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 14l1-3h4l2 3" />
    <path d="M8 14V8h5l3 3v3" />
    <circle cx="5.5" cy="16.5" r="2.5" />
    <circle cx="14.5" cy="16.5" r="2.5" />
    <path d="M8 16.5h4" />
    <path d="M16 14h3l3 3v2h-2" />
    <path d="M18 11V8" />
  </svg>
);

// Battery / Jump start
export const JumpIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="13" rx="2" />
    <path d="M7 7V5a1 1 0 011-1h2a1 1 0 011 1v2" />
    <path d="M13 7V5a1 1 0 011-1h2a1 1 0 011 1v2" />
    <path d="M12 11v4" />
    <path d="M10 13h4" />
    <path d="M6 13h1" />
  </svg>
);

// Tire / Flat
export const TireIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <path d="M12 3v5" />
    <path d="M12 16v5" />
    <path d="M3 12h5" />
    <path d="M16 12h5" />
  </svg>
);

// Key / Lockout
export const LockoutIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

// Gas pump / Fuel
export const FuelIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22V6a2 2 0 012-2h8a2 2 0 012 2v16" />
    <path d="M3 22h12" />
    <path d="M6 8h6" />
    <path d="M15 10h1a2 2 0 012 2v4a2 2 0 002 2 2 2 0 002-2V9l-3-3" />
    <rect x="5" y="12" width="8" height="6" rx="1" />
  </svg>
);

// Hook / Winch
export const WinchIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v8" />
    <path d="M8 6h8" />
    <path d="M12 10c-3 0-4 2-4 4s2 4 2 6" />
    <path d="M12 10c3 0 4 2 4 4s-2 4-2 6" />
    <circle cx="12" cy="21" r="1" fill="currentColor" />
    <path d="M4 2h16" />
  </svg>
);

// Oil can
export const OilIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18a2 2 0 002 2h12a2 2 0 002-2V9l-4-4H6L2 9v9z" />
    <path d="M6 5l-4 4" />
    <path d="M14 5l4 4" />
    <path d="M10 2v3" />
    <path d="M18 14l4-4v8" />
    <circle cx="10" cy="14" r="2" />
  </svg>
);

// Brake disc
export const BrakeIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <path d="M12 3v2" />
    <path d="M12 19v2" />
    <path d="M3 12h2" />
    <path d="M19 12h2" />
    <path d="M5.6 5.6l1.4 1.4" />
    <path d="M17 17l1.4 1.4" />
  </svg>
);

// Sparkle / Detailing
export const DetailIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M19 13l.75 2.25L22 16l-2.25.75L19 19l-.75-2.25L16 16l2.25-.75L19 13z" />
    <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" />
  </svg>
);

// Clipboard / Inspection
export const InspectionIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M9 12l2 2 4-4" />
    <path d="M9 17h6" />
  </svg>
);

// Paint roller / Wrap
export const WrapIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="18" height="6" rx="2" />
    <path d="M20 6h1a1 1 0 011 1v1a1 1 0 01-1 1h-1" />
    <path d="M12 9v4" />
    <path d="M12 13a2 2 0 012 2v4a2 2 0 01-4 0v-4a2 2 0 012-2z" />
  </svg>
);

// Gauge / Performance
export const PerformanceIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v6l4 2" />
    <path d="M16.24 7.76l-2.12 5.66" />
  </svg>
);

// Speaker / Audio
export const AudioIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 010 7.07" />
    <path d="M19.07 4.93a10 10 0 010 14.14" />
  </svg>
);

// Paint / Custom Paint
export const PaintIcon: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 3H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z" />
    <path d="M12 11v4" />
    <path d="M10 19a2 2 0 114 0v1a1 1 0 01-1 1h-2a1 1 0 01-1-1v-1z" />
    <path d="M5 7h14" />
  </svg>
);

// Service type to icon + color mapping
export const SERVICE_ICON_MAP: Record<string, { Icon: React.FC<IconProps>; gradient: string; bg: string }> = {
  tow:          { Icon: TowIcon,          gradient: 'from-red-500 to-rose-600',      bg: 'bg-red-500/15' },
  jump:         { Icon: JumpIcon,         gradient: 'from-amber-400 to-yellow-500',  bg: 'bg-amber-500/15' },
  flat:         { Icon: TireIcon,         gradient: 'from-blue-500 to-indigo-600',   bg: 'bg-blue-500/15' },
  lockout:      { Icon: LockoutIcon,      gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-500/15' },
  fuel:         { Icon: FuelIcon,         gradient: 'from-emerald-500 to-green-600', bg: 'bg-emerald-500/15' },
  winch:        { Icon: WinchIcon,        gradient: 'from-orange-500 to-amber-600',  bg: 'bg-orange-500/15' },
  oil_change:   { Icon: OilIcon,          gradient: 'from-slate-500 to-zinc-600',    bg: 'bg-slate-500/15' },
  brakes:       { Icon: BrakeIcon,        gradient: 'from-red-600 to-red-700',       bg: 'bg-red-600/15' },
  detailing:    { Icon: DetailIcon,       gradient: 'from-cyan-400 to-sky-500',      bg: 'bg-cyan-400/15' },
  inspection:   { Icon: InspectionIcon,   gradient: 'from-teal-500 to-emerald-600',  bg: 'bg-teal-500/15' },
  wrap:         { Icon: WrapIcon,         gradient: 'from-fuchsia-500 to-pink-600',  bg: 'bg-fuchsia-500/15' },
  performance:  { Icon: PerformanceIcon,  gradient: 'from-rose-500 to-red-600',      bg: 'bg-rose-500/15' },
  audio:        { Icon: AudioIcon,        gradient: 'from-indigo-500 to-blue-600',   bg: 'bg-indigo-500/15' },
  custom_paint: { Icon: PaintIcon,        gradient: 'from-pink-500 to-rose-600',     bg: 'bg-pink-500/15' },
};

export const getServiceIcon = (serviceType: string) =>
  SERVICE_ICON_MAP[serviceType] || { Icon: TowIcon, gradient: 'from-zinc-500 to-zinc-600', bg: 'bg-zinc-500/15' };
