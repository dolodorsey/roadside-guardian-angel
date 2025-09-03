import React, { useState, useEffect } from 'react';
import NotificationSystem, { RoadsideNotification } from './NotificationSystem';
import ServiceHistory, { ServiceHistoryItem } from './ServiceHistory';
import PremiumReceipt from './PremiumReceipt';
import SafetyNotification from './SafetyNotification';

interface NotificationManagerProps {
  serviceState?: 'idle' | 'requesting' | 'matched' | 'enroute' | 'arrived' | 'active' | 'completed';
  providerData?: {
    name: string;
    eta: number;
    vehicle: string;
  };
  userPreferences?: {
    enablePushNotifications: boolean;
    enableHapticFeedback: boolean;
    enableSoundAlerts: boolean;
  };
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  serviceState = 'idle',
  providerData,
  userPreferences = {
    enablePushNotifications: true,
    enableHapticFeedback: true,
    enableSoundAlerts: true
  }
}) => {
  const [notifications, setNotifications] = useState<RoadsideNotification[]>([]);
  const [showSafetyNotification, setShowSafetyNotification] = useState<{
    type: 'share-eta' | 'low-battery' | 'silent-sos' | 'emergency-alert';
    data?: any;
  } | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(100);

  // Monitor battery level
  useEffect(() => {
    const updateBatteryLevel = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          const level = Math.floor(battery.level * 100);
          setBatteryLevel(level);
          
          // Show low battery notification
          if (level < 15 && serviceState !== 'idle') {
            setShowSafetyNotification({
              type: 'low-battery',
              data: { batteryLevel: level }
            });
          }
        } catch (error) {
          console.log('Battery API not available');
        }
      }
    };

    updateBatteryLevel();
    const interval = setInterval(updateBatteryLevel, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [serviceState]);

  // Generate notifications based on service state
  useEffect(() => {
    if (!userPreferences.enablePushNotifications) return;

    let newNotification: RoadsideNotification | null = null;

    switch (serviceState) {
      case 'requesting':
        newNotification = {
          id: `notification-${Date.now()}`,
          type: 'live-update',
          priority: 'high',
          title: 'Finding Your Provider',
          message: 'We\'re matching you with the best available provider in your area.',
          timestamp: new Date(),
          icon: 'clock',
          autoHide: true,
          duration: 5000,
          hasHaptic: userPreferences.enableHapticFeedback
        };
        break;

      case 'matched':
        newNotification = {
          id: `notification-${Date.now()}`,
          type: 'live-update',
          priority: 'high',
          title: 'Provider Matched!',
          message: `${providerData?.name || 'Your provider'} has been assigned and is preparing to help you.`,
          timestamp: new Date(),
          icon: 'shield',
          autoHide: true,
          duration: 8000,
          hasHaptic: userPreferences.enableHapticFeedback
        };
        break;

      case 'enroute':
        newNotification = {
          id: `notification-${Date.now()}`,
          type: 'live-update',
          priority: 'high',
          title: 'Help is on the way',
          message: `${providerData?.name || 'Your provider'} is ${providerData?.eta || 'X'} minutes away. Stay safe!`,
          timestamp: new Date(),
          icon: 'truck',
          actionButton: {
            label: 'Share ETA',
            action: () => setShowSafetyNotification({ 
              type: 'share-eta', 
              data: { eta: providerData?.eta } 
            })
          },
          autoHide: false,
          hasHaptic: userPreferences.enableHapticFeedback
        };
        break;

      case 'arrived':
        newNotification = {
          id: `notification-${Date.now()}`,
          type: 'arrival',
          priority: 'critical',
          title: 'Provider has arrived!',
          message: `${providerData?.name || 'Your provider'} is here. Please verify their ID before service begins.`,
          timestamp: new Date(),
          icon: 'map',
          autoHide: false,
          hasHaptic: userPreferences.enableHapticFeedback,
          hasSound: userPreferences.enableSoundAlerts
        };
        break;

      case 'completed':
        newNotification = {
          id: `notification-${Date.now()}`,
          type: 'completion',
          priority: 'medium',
          title: 'Service Complete!',
          message: 'Your service is complete. Receipt and rating request are available in the app.',
          timestamp: new Date(),
          icon: 'shield',
          actionButton: {
            label: 'View Receipt',
            action: () => console.log('Open receipt')
          },
          autoHide: true,
          duration: 10000,
          hasHaptic: userPreferences.enableHapticFeedback
        };
        break;
    }

    if (newNotification) {
      setNotifications(prev => [...prev, newNotification!]);
    }
  }, [serviceState, providerData, userPreferences]);

  // ETA updates every minute when en route
  useEffect(() => {
    if (serviceState === 'enroute' && providerData?.eta) {
      const interval = setInterval(() => {
        if (providerData.eta <= 3) {
          const urgentNotification: RoadsideNotification = {
            id: `eta-update-${Date.now()}`,
            type: 'live-update',
            priority: 'high',
            title: 'Almost There!',
            message: `${providerData.name} will arrive in ${providerData.eta} minutes. Get ready to verify their ID.`,
            timestamp: new Date(),
            icon: 'clock',
            autoHide: true,
            duration: 6000,
            hasHaptic: userPreferences.enableHapticFeedback
          };
          setNotifications(prev => [...prev, urgentNotification]);
        }
      }, 60000); // Every minute

      return () => clearInterval(interval);
    }
  }, [serviceState, providerData, userPreferences]);

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleNotificationAction = (id: string, action: () => void) => {
    action();
    handleDismissNotification(id);
  };

  const handleSafetyAction = (action: string) => {
    console.log('Safety action:', action);
    setShowSafetyNotification(null);
  };

  // Mock service history data
  const mockServiceHistory: ServiceHistoryItem[] = [
    {
      id: 'service-001',
      serviceType: 'Jump Start',
      date: new Date('2024-01-15'),
      location: '123 Main St, City, ST',
      provider: {
        name: 'Alex Rodriguez',
        company: 'QuickStart Auto',
        rating: 4.9
      },
      cost: {
        subtotal: 45,
        membershipDiscount: 9,
        credits: 0,
        total: 36
      },
      status: 'completed',
      timeline: {
        requested: new Date('2024-01-15T10:00:00'),
        dispatched: new Date('2024-01-15T10:02:00'),
        enroute: new Date('2024-01-15T10:05:00'),
        arrived: new Date('2024-01-15T10:12:00'),
        completed: new Date('2024-01-15T10:25:00')
      },
      receipt: {
        id: 'REC-001',
        downloadUrl: '/receipts/REC-001.pdf'
      }
    }
  ];

  return (
    <>
      {/* Push Notifications */}
      <NotificationSystem
        notifications={notifications}
        onDismiss={handleDismissNotification}
        onAction={handleNotificationAction}
      />

      {/* Safety Notifications */}
      {showSafetyNotification && (
        <SafetyNotification
          type={showSafetyNotification.type}
          isVisible={true}
          onAction={handleSafetyAction}
          onDismiss={() => setShowSafetyNotification(null)}
          data={showSafetyNotification.data}
        />
      )}

      {/* Service History (hidden by default, would be shown in a dedicated tab) */}
      <div className="hidden">
        <ServiceHistory
          items={mockServiceHistory}
          onDownloadReceipt={(receiptId) => console.log('Download receipt:', receiptId)}
          onRateService={(serviceId) => console.log('Rate service:', serviceId)}
        />
      </div>
    </>
  );
};

export default NotificationManager;