import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Battery, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SafetyNotificationProps {
  type: 'share-eta' | 'low-battery' | 'silent-sos' | 'emergency-alert';
  isVisible: boolean;
  onAction?: (action: string) => void;
  onDismiss?: () => void;
  data?: {
    eta?: number;
    batteryLevel?: number;
    emergencyContact?: string;
  };
}

const SafetyNotification: React.FC<SafetyNotificationProps> = ({
  type,
  isVisible,
  onAction,
  onDismiss,
  data
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      // Trigger haptic feedback for safety notifications
      if ('vibrate' in navigator) {
        if (type === 'silent-sos' || type === 'emergency-alert') {
          navigator.vibrate([100, 50, 100]); // Triple pulse for critical
        } else {
          navigator.vibrate(50); // Single pulse for info
        }
      }
    }
  }, [isVisible, type]);

  if (!isVisible) return null;

  const getNotificationContent = () => {
    switch (type) {
      case 'share-eta':
        return {
          title: 'Share Your ETA',
          message: `Want us to text your ETA (${data?.eta} minutes) to a family member?`,
          icon: Users,
          primaryAction: 'Share ETA',
          primaryColor: 'electric-blue',
          isDismissible: true
        };
        
      case 'low-battery':
        return {
          title: 'Low Battery Detected',
          message: `Battery at ${data?.batteryLevel}%. We've simplified your screen to save power. You're still covered.`,
          icon: Battery,
          primaryAction: 'Optimize App',
          primaryColor: 'neon-green',
          isDismissible: false
        };
        
      case 'silent-sos':
        return {
          title: 'Silent Request Received',
          message: 'Roadside received your silent request. Help is on the way.',
          icon: Shield,
          primaryAction: null,
          primaryColor: 'emergency-red',
          isDismissible: false
        };
        
      case 'emergency-alert':
        return {
          title: 'Emergency Mode Active',
          message: 'Priority response activated. Emergency team has been notified.',
          icon: AlertTriangle,
          primaryAction: 'Contact Support',
          primaryColor: 'emergency-red',
          isDismissible: false
        };
        
      default:
        return {
          title: 'Safety Alert',
          message: 'Important safety information',
          icon: Shield,
          primaryAction: 'OK',
          primaryColor: 'electric-blue',
          isDismissible: true
        };
    }
  };

  const notification = getNotificationContent();
  const IconComponent = notification.icon;

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'electric-blue':
        return {
          bg: 'bg-electric-blue/90',
          border: 'border-electric-blue',
          shadow: 'shadow-tech',
          icon: 'text-white',
          button: 'bg-white/20 hover:bg-white/30 text-white'
        };
      case 'neon-green':
        return {
          bg: 'bg-neon-green/90',
          border: 'border-neon-green',
          shadow: 'shadow-guardian',
          icon: 'text-white',
          button: 'bg-white/20 hover:bg-white/30 text-white'
        };
      case 'emergency-red':
        return {
          bg: 'bg-emergency-red/90',
          border: 'border-emergency-red',
          shadow: 'shadow-emergency',
          icon: 'text-white',
          button: 'bg-white/20 hover:bg-white/30 text-white'
        };
      default:
        return {
          bg: 'bg-midnight-black/90',
          border: 'border-border',
          shadow: 'shadow-tech',
          icon: 'text-electric-blue',
          button: 'bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue'
        };
    }
  };

  const colors = getColorClasses(notification.primaryColor);

  return (
    <div className="fixed inset-0 bg-midnight-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className={`max-w-sm w-full rounded-2xl ${colors.bg} ${colors.border} ${colors.shadow} border-2 backdrop-blur-xl animate-scale-in overflow-hidden ${
        isAnimating ? 'animate-pulse' : ''
      }`}>
        {/* Shimmer effect for critical notifications */}
        {(type === 'silent-sos' || type === 'emergency-alert') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        )}
        
        <div className="relative p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              type === 'silent-sos' || type === 'emergency-alert' ? 'animate-pulse' : ''
            }`}>
              <IconComponent className={`w-8 h-8 ${colors.icon}`} />
            </div>
            <h2 className="font-guardian text-xl text-white mb-2">
              {notification.title}
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Special content for specific types */}
          {type === 'share-eta' && (
            <div className="mb-6 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white mr-2" />
                <span className="text-white text-sm font-tech">
                  Send to: {data?.emergencyContact || 'Emergency Contact'}
                </span>
              </div>
            </div>
          )}

          {type === 'low-battery' && (
            <div className="mb-6 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center justify-center">
                <Battery className="w-4 h-4 text-white mr-2" />
                <span className="text-white text-sm font-tech">
                  Battery: {data?.batteryLevel}% • Auto-optimized
                </span>
              </div>
            </div>
          )}

          {type === 'silent-sos' && (
            <div className="mb-6 text-center">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/60 animate-progress-bar" style={{ animationDuration: '3s' }} />
              </div>
              <p className="text-white/60 text-xs mt-2 font-tech">
                Dispatching help discreetly...
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {notification.primaryAction && (
              <Button
                onClick={() => onAction?.(notification.primaryAction!)}
                className={`flex-1 font-guardian ${colors.button}`}
              >
                {notification.primaryAction}
              </Button>
            )}
            
            {notification.isDismissible && (
              <Button
                onClick={onDismiss}
                variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                Not Now
              </Button>
            )}
          </div>

          {/* Auto-dismiss timer for non-critical notifications */}
          {notification.isDismissible && type !== 'emergency-alert' && (
            <div className="mt-4 text-center">
              <p className="text-white/50 text-xs font-tech">
                Auto-dismiss in 10 seconds
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyNotification;