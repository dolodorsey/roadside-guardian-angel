import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, X, Car, User } from 'lucide-react';
import EmergencyButton from '@/components/EmergencyButton';
import RoadsideBeacon from '@/components/RoadsideBeacon';

interface JobRequestAlertProps {
  onAccept: () => void;
  onDecline: () => void;
}

const JobRequestAlert: React.FC<JobRequestAlertProps> = ({ onAccept, onDecline }) => {
  const [timeLeft, setTimeLeft] = useState(15);
  const navigate = useNavigate();

  const jobData = {
    id: 'job-12345',
    type: 'Jump Start',
    customer: 'Sarah Johnson',
    vehicle: '2020 Honda Civic',
    location: '1234 Oak Street, Downtown',
    distance: '2.3 miles',
    payout: '$45.00',
    eta: '8 minutes',
    notes: 'Battery completely dead, no lights or power'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onDecline]);

  const handleAccept = () => {
    onAccept();
    navigate(`/provider/job/${jobData.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-black/80 backdrop-blur-sm">
      {/* Alert Card */}
      <div className="w-full max-w-md bg-gradient-to-b from-asphalt-gray to-midnight-black border border-emergency-red/50 rounded-3xl p-6 animate-scale-in shadow-emergency">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emergency-red/20 flex items-center justify-center">
              <RoadsideBeacon size="sm" variant="emergency" />
            </div>
            <div>
              <h3 className="font-guardian text-xl text-foreground">New Mission Request</h3>
              <p className="text-emergency-red text-sm font-tech">Respond quickly</p>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${
              timeLeft <= 5 ? 'border-emergency-red bg-emergency-red/20 animate-pulse' : 'border-neon-green bg-neon-green/20'
            }`}>
              <span className={`font-guardian text-lg ${timeLeft <= 5 ? 'text-emergency-red' : 'text-neon-green'}`}>
                {timeLeft}
              </span>
            </div>
            <span className="text-muted-foreground text-xs">seconds</span>
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-4 mb-6">
          {/* Service Type & Customer */}
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <Car className="w-5 h-5 text-electric-blue" />
              <div>
                <div className="font-guardian text-lg text-foreground">{jobData.type}</div>
                <div className="text-muted-foreground text-sm">{jobData.vehicle}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neon-green" />
              <span className="text-neon-green font-tech">{jobData.customer}</span>
            </div>
          </div>

          {/* Location & Distance */}
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emergency-red mt-0.5" />
              <div className="flex-1">
                <div className="text-foreground font-tech mb-1">{jobData.location}</div>
                <div className="text-electric-blue text-sm">{jobData.distance} away • {jobData.eta} drive</div>
              </div>
            </div>
          </div>

          {/* Payout */}
          <div className="p-4 rounded-xl bg-neon-green/10 border border-neon-green/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-neon-green" />
                <span className="text-foreground font-tech">Payout</span>
              </div>
              <span className="font-guardian text-2xl text-neon-green">{jobData.payout}</span>
            </div>
          </div>

          {/* Notes */}
          {jobData.notes && (
            <div className="p-4 rounded-xl bg-metallic-silver/5 border border-metallic-silver/20">
              <div className="text-foreground font-tech text-sm mb-1">Customer Notes:</div>
              <div className="text-muted-foreground text-sm">{jobData.notes}</div>
            </div>
          )}
        </div>

        {/* Map Preview */}
        <div className="mb-6 h-32 rounded-xl tech-surface border border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-asphalt-gray/30 to-midnight-black">
            <div className="absolute inset-0 opacity-20">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                    linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />
            </div>
          </div>

          {/* Provider Location */}
          <div className="absolute bottom-4 left-4">
            <div className="w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
              <span className="text-midnight-black text-xs font-bold">P</span>
            </div>
          </div>

          {/* Customer Location */}
          <div className="absolute top-4 right-4">
            <div className="w-6 h-6 bg-emergency-red rounded-full flex items-center justify-center">
              <span className="text-foreground text-xs font-bold">C</span>
            </div>
          </div>

          {/* Route Line */}
          <svg className="absolute inset-0 w-full h-full">
            <line
              x1="16" y1="calc(100% - 16px)"
              x2="calc(100% - 16px)" y2="16"
              stroke="hsl(var(--electric-blue))"
              strokeWidth="2"
              strokeDasharray="5,3"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 p-4 rounded-xl border border-metallic-silver/30 bg-metallic-silver/5 hover:bg-metallic-silver/10 transition-colors"
          >
            <span className="text-metallic-silver font-tech">Decline</span>
          </button>
          
          <EmergencyButton
            variant="primary"
            size="lg"
            onClick={handleAccept}
            className="flex-1"
            showBeacon={true}
          >
            Accept Mission
          </EmergencyButton>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Quick response bonus eligible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRequestAlert;