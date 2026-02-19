import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Bell,
  Settings,
  User,
  BarChart3,
  Shield,
  Power,
  Navigation
} from 'lucide-react';
import EmergencyButton from '@/components/EmergencyButton';
import RoadsideBeacon from '@/components/RoadsideBeacon';
import JobRequestAlert from './JobRequestAlert';

const ProviderDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [showJobAlert, setShowJobAlert] = useState(false);
  const [notifications] = useState(3);

  const stats = {
    todayEarnings: 247.50,
    weeklyEarnings: 1235.75,
    rating: 4.9,
    completedJobs: 156,
    responseTime: '6 min'
  };

  const handleGoOnline = () => {
    setIsOnline(true);
    // Simulate incoming job after going online
    setTimeout(() => {
      setShowJobAlert(true);
    }, 3000);
  };

  const handleGoOffline = () => {
    setIsOnline(false);
    setShowJobAlert(false);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-green to-electric-blue flex items-center justify-center">
              <span className="text-foreground font-bold">JP</span>
            </div>
            <div>
              <h1 className="font-guardian text-xl text-foreground">Good morning, John</h1>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-neon-green" />
                <span className="text-neon-green text-sm font-tech">Verified Hero</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/provider/profile"
              className="p-2 rounded-lg tech-surface border border-border/50 hover:border-electric-blue/50 transition-colors"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
            
            <div className="relative">
              <button className="p-2 rounded-lg tech-surface border border-border/50 hover:border-electric-blue/50 transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button>
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emergency-red rounded-full flex items-center justify-center">
                  <span className="text-foreground text-xs font-bold">{notifications}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Status Toggle */}
        <div className="mb-8">
          <div className="p-6 rounded-2xl tech-surface border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-guardian text-2xl text-foreground mb-2">
                  {isOnline ? 'You\'re Online' : 'You\'re Offline'}
                </h2>
                <p className="text-muted-foreground">
                  {isOnline 
                    ? 'Ready to accept missions in your zone' 
                     : 'Go online to start receiving mission requests'
                  }
                </p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                  isOnline ? 'bg-neon-green/20 border-2 border-neon-green' : 'bg-metallic-silver/20 border-2 border-metallic-silver/50'
                }`}>
                  <Power className={`w-8 h-8 ${isOnline ? 'text-neon-green' : 'text-metallic-silver'}`} />
                </div>
                {isOnline ? (
                  <EmergencyButton
                    variant="ghost"
                    size="md"
                    onClick={handleGoOffline}
                    className="border-emergency-red/30 text-emergency-red hover:bg-emergency-red/10"
                  >
                    Go Offline
                  </EmergencyButton>
                ) : (
                  <EmergencyButton
                    variant="primary"
                    size="md"
                    onClick={handleGoOnline}
                    showBeacon={true}
                  >
                    Go Online
                  </EmergencyButton>
                )}
              </div>
            </div>
            
            {isOnline && (
              <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                  <span className="text-neon-green text-sm font-tech">Online for 2h 15m</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-electric-blue" />
                  <span className="text-electric-blue text-sm font-tech">15 mile radius</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-guardian text-xl text-foreground">Today's Earnings</h3>
            <Link 
              to="/provider/earnings"
              className="text-electric-blue hover:text-electric-blue/80 text-sm font-tech"
            >
              View Details →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-neon-green/10 to-electric-blue/10 border border-neon-green/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-neon-green" />
                </div>
                <div>
                  <div className="text-2xl font-guardian text-foreground">
                    ${stats.todayEarnings.toFixed(2)}
                  </div>
                  <div className="text-neon-green text-sm font-tech">Today</div>
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                +$47.50 from yesterday
              </div>
            </div>

            <div className="p-6 rounded-xl tech-surface border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-electric-blue/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-electric-blue" />
                </div>
                <div>
                  <div className="text-2xl font-guardian text-foreground">
                    ${stats.weeklyEarnings.toFixed(2)}
                  </div>
                  <div className="text-electric-blue text-sm font-tech">This Week</div>
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                Goal: $1,500 (82% complete)
              </div>
            </div>

            <div className="p-6 rounded-xl tech-surface border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-emergency-red/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emergency-red" />
                </div>
                <div>
                  <div className="text-2xl font-guardian text-foreground">
                    {stats.responseTime}
                  </div>
                  <div className="text-emergency-red text-sm font-tech">Avg Response</div>
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                2 min faster than average
              </div>
            </div>
          </div>
        </div>

        {/* Service Area Map */}
        <div className="mb-8">
          <h3 className="font-guardian text-xl text-foreground mb-4">Your Service Area</h3>
          <div className="relative h-64 rounded-2xl tech-surface border border-border/50 overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-asphalt-gray/30 to-midnight-black">
              <div className="absolute inset-0 opacity-20">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                      linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />
              </div>
            </div>

            {/* Provider Location */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <RoadsideBeacon size="md" variant="guardian" />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-neon-green font-tech">
                You
              </div>
            </div>

            {/* Service Radius */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 rounded-full border-2 border-neon-green/30 animate-pulse"></div>
              <div className="absolute inset-0 w-48 h-48 rounded-full border border-neon-green/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Nearby Requests */}
            <div className="absolute top-1/4 right-1/3">
              <div className="w-4 h-4 bg-emergency-red rounded-full animate-pulse">
                <div className="absolute inset-0 rounded-full border-2 border-emergency-red animate-ping scale-150"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4">
              <button className="p-2 rounded-lg bg-electric-blue/20 border border-electric-blue/30 hover:bg-electric-blue/30 transition-colors">
                <Navigation className="w-4 h-4 text-electric-blue" />
              </button>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl tech-surface border border-border/50 text-center">
            <div className="text-2xl font-guardian text-neon-green mb-1">{stats.rating}</div>
            <div className="text-muted-foreground text-sm">Rating</div>
          </div>
          
          <div className="p-4 rounded-xl tech-surface border border-border/50 text-center">
            <div className="text-2xl font-guardian text-electric-blue mb-1">{stats.completedJobs}</div>
            <div className="text-muted-foreground text-sm">Missions Complete</div>
          </div>
          
          <div className="p-4 rounded-xl tech-surface border border-border/50 text-center">
            <div className="text-2xl font-guardian text-emergency-red mb-1">98%</div>
            <div className="text-muted-foreground text-sm">Acceptance Rate</div>
          </div>
          
          <div className="p-4 rounded-xl tech-surface border border-border/50 text-center">
            <div className="text-2xl font-guardian text-neon-green mb-1">5</div>
            <div className="text-muted-foreground text-sm">Missions Today</div>
          </div>
        </div>
      </div>

      {/* Job Request Alert */}
      {showJobAlert && (
        <JobRequestAlert 
          onAccept={() => setShowJobAlert(false)}
          onDecline={() => setShowJobAlert(false)}
        />
      )}
    </div>
  );
};

export default ProviderDashboard;