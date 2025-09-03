import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, Truck, Zap, Shield, DollarSign, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type NotificationType = 'live-update' | 'safety' | 'membership' | 'wallet' | 'completion' | 'arrival';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface RoadsideNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  icon?: string;
  actionButton?: {
    label: string;
    action: () => void;
  };
  autoHide?: boolean;
  duration?: number;
  hasHaptic?: boolean;
  hasSound?: boolean;
}

interface NotificationSystemProps {
  notifications: RoadsideNotification[];
  onDismiss: (id: string) => void;
  onAction: (id: string, action: () => void) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss,
  onAction
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<RoadsideNotification[]>([]);

  useEffect(() => {
    setVisibleNotifications(notifications);

    // Auto-hide notifications
    notifications.forEach(notification => {
      if (notification.autoHide && notification.duration) {
        setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
      }
    });
  }, [notifications, onDismiss]);

  const getNotificationStyle = (type: NotificationType, priority: NotificationPriority) => {
    const baseStyle = "relative overflow-hidden rounded-xl backdrop-blur-xl border transition-all duration-300 transform";
    
    if (priority === 'critical') {
      return `${baseStyle} bg-emergency-red/90 border-emergency-red shadow-emergency animate-pulse`;
    }

    switch (type) {
      case 'live-update':
        return `${baseStyle} bg-midnight-black/90 border-electric-blue/30 shadow-tech`;
      case 'safety':
        return `${baseStyle} bg-midnight-black/90 border-neon-green/30 shadow-guardian`;
      case 'membership':
        return `${baseStyle} bg-midnight-black/90 border-metallic-silver/30 shadow-luxury`;
      case 'wallet':
        return `${baseStyle} bg-midnight-black/90 border-neon-green/30 shadow-guardian`;
      case 'arrival':
        return `${baseStyle} bg-emergency-red/90 border-emergency-red shadow-emergency`;
      case 'completion':
        return `${baseStyle} bg-neon-green/90 border-neon-green shadow-guardian`;
      default:
        return `${baseStyle} bg-midnight-black/90 border-border/30`;
    }
  };

  const getNotificationIcon = (type: NotificationType, iconName?: string) => {
    if (iconName === 'truck') return Truck;
    if (iconName === 'fuel') return Zap;
    if (iconName === 'shield') return Shield;
    if (iconName === 'dollar') return DollarSign;
    if (iconName === 'map') return MapPin;
    if (iconName === 'clock') return Clock;

    switch (type) {
      case 'live-update':
        return MapPin;
      case 'safety':
        return Shield;
      case 'membership':
        return Shield;
      case 'wallet':
        return DollarSign;
      case 'arrival':
        return AlertTriangle;
      case 'completion':
        return Check;
      default:
        return Shield;
    }
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(50);
          break;
        case 'medium':
          navigator.vibrate(100);
          break;
        case 'heavy':
          navigator.vibrate([100, 50, 100]);
          break;
      }
    }
  };

  useEffect(() => {
    notifications.forEach(notification => {
      if (notification.hasHaptic) {
        if (notification.priority === 'critical') {
          triggerHaptic('heavy');
        } else if (notification.priority === 'high') {
          triggerHaptic('medium');
        } else {
          triggerHaptic('light');
        }
      }
    });
  }, [notifications]);

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 space-y-3 pointer-events-none">
      {visibleNotifications.map((notification) => {
        const IconComponent = getNotificationIcon(notification.type, notification.icon);
        
        return (
          <div
            key={notification.id}
            className={`${getNotificationStyle(notification.type, notification.priority)} p-4 animate-slide-in-down pointer-events-auto`}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 animate-shimmer" />
            
            <div className="relative flex items-start justify-between">
              <div className="flex items-start">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  notification.priority === 'critical' 
                    ? 'bg-white/20 animate-pulse' 
                    : 'bg-white/10'
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    notification.priority === 'critical' ? 'text-white' : 'text-electric-blue'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-guardian text-sm text-white mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-white/80 text-xs leading-relaxed">
                    {notification.message}
                  </p>
                  
                  {/* Timestamp */}
                  <p className="text-white/50 text-xs mt-2 font-tech">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>

                  {/* Action Button */}
                  {notification.actionButton && (
                    <Button
                      onClick={() => onAction(notification.id, notification.actionButton!.action)}
                      size="sm"
                      className="mt-3 bg-white/20 hover:bg-white/30 text-white border-white/30 font-tech"
                    >
                      {notification.actionButton.label}
                    </Button>
                  )}
                </div>
              </div>

              {/* Dismiss Button */}
              <Button
                onClick={() => onDismiss(notification.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar for Auto-Hide */}
            {notification.autoHide && notification.duration && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
                <div 
                  className="h-full bg-white/60 animate-progress-bar"
                  style={{ animationDuration: `${notification.duration}ms` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationSystem;