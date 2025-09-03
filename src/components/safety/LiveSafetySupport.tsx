import React, { useState } from 'react';
import { Phone, MessageSquare, Shield, AlertTriangle, Users, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LiveSafetySupportProps {
  isVisible?: boolean;
  onClose?: () => void;
  emergencyMode?: boolean;
}

const LiveSafetySupport: React.FC<LiveSafetySupportProps> = ({
  isVisible = true,
  onClose,
  emergencyMode = false
}) => {
  const [activeSupport, setActiveSupport] = useState<'none' | 'chat' | 'call' | 'emergency'>('none');
  const [showShareOptions, setShowShareOptions] = useState(false);

  if (!isVisible && !emergencyMode) return null;

  const FloatingButton = () => (
    <div className="fixed bottom-24 right-6 z-40">
      <Button
        onClick={() => setActiveSupport('chat')}
        className="w-14 h-14 rounded-full bg-electric-blue hover:bg-electric-blue/90 shadow-tech group"
        size="icon"
      >
        <Headphones className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-150" />
      </Button>
      
      {/* Pulse indicator for active support */}
      <div className="absolute inset-0 rounded-full bg-electric-blue/30 animate-ping pointer-events-none" />
    </div>
  );

  const SupportPanel = () => (
    <div className="fixed inset-0 bg-midnight-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-electric-blue" />
          </div>
          <h2 className="font-guardian text-2xl text-foreground mb-2">
            Safety Support
          </h2>
          <p className="text-muted-foreground">
            We're here to help and keep you safe
          </p>
        </div>

        {/* Support Options */}
        <div className="space-y-3 mb-6">
          {/* Emergency Priority */}
          {emergencyMode && (
            <Button
              onClick={() => setActiveSupport('emergency')}
              className="w-full h-16 emergency-cta font-guardian text-lg"
            >
              <AlertTriangle className="w-6 h-6 mr-3" />
              Emergency Support
            </Button>
          )}

          {/* Live Chat */}
          <Button
            onClick={() => setActiveSupport('chat')}
            className="w-full h-12 tech-surface border border-electric-blue/30 text-foreground hover:bg-electric-blue/10"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Live Chat Support
          </Button>

          {/* Direct Call */}
          <Button
            onClick={() => setActiveSupport('call')}
            className="w-full h-12 tech-surface border border-neon-green/30 text-foreground hover:bg-neon-green/10"
          >
            <Phone className="w-5 h-5 mr-3" />
            Call Roadside Support
          </Button>

          {/* Share Session */}
          <Button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="w-full h-12 tech-surface border border-border text-foreground hover:bg-muted/20"
          >
            <Users className="w-5 h-5 mr-3" />
            Share with Emergency Contact
          </Button>
        </div>

        {/* Share Options */}
        {showShareOptions && (
          <div className="mb-6 p-4 tech-surface rounded-xl animate-fade-in">
            <h3 className="font-tech text-foreground mb-3">Share Live Session</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:border-electric-blue/50"
              >
                📱 Send location + ETA to family
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:border-electric-blue/50"
              >
                📞 Add emergency contact to call
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-border hover:border-electric-blue/50"
              >
                📹 Share live tracking feed
              </Button>
            </div>
          </div>
        )}

        {/* Safety Assurance */}
        <div className="mb-6 p-4 bg-neon-green/10 rounded-xl border border-neon-green/20">
          <div className="flex items-center text-neon-green mb-2">
            <Shield className="w-4 h-4 mr-2" />
            <span className="font-tech text-sm">Your Safety First</span>
          </div>
          <ul className="text-neon-green/80 text-xs space-y-1">
            <li>• 24/7 verified support team</li>
            <li>• All calls recorded for quality</li>
            <li>• Direct line to emergency services</li>
          </ul>
        </div>

        {/* Close Button */}
        <Button
          onClick={() => {
            setActiveSupport('none');
            onClose?.();
          }}
          variant="outline"
          className="w-full border-border hover:border-muted-foreground/50"
        >
          Close
        </Button>
      </div>
    </div>
  );

  // Active Support States
  if (activeSupport === 'chat') {
    return (
      <div className="fixed inset-0 bg-midnight-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full h-96 tech-surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-guardian text-lg text-foreground">Live Support Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActiveSupport('none')}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </Button>
          </div>
          
          <div className="flex-1 bg-asphalt-gray/30 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-electric-blue/20 rounded-lg p-3 max-w-xs">
                <p className="text-sm text-foreground">
                  Hi! I'm here to help. What can I assist you with today?
                </p>
                <span className="text-xs text-muted-foreground">Support Agent • Now</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 bg-asphalt-gray/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-electric-blue focus:outline-none"
            />
            <Button className="bg-electric-blue hover:bg-electric-blue/90">
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (activeSupport === 'call') {
    return (
      <div className="fixed inset-0 bg-midnight-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Phone className="w-12 h-12 text-neon-green" />
          </div>
          <h2 className="font-guardian text-2xl text-foreground mb-2">
            Connecting...
          </h2>
          <p className="text-muted-foreground mb-6">
            You'll be connected to our safety team in seconds
          </p>
          <Button
            onClick={() => setActiveSupport('none')}
            variant="outline"
            className="border-emergency-red/30 text-emergency-red hover:bg-emergency-red/10"
          >
            Cancel Call
          </Button>
        </div>
      </div>
    );
  }

  if (activeSupport === 'emergency') {
    return (
      <div className="fixed inset-0 bg-emergency-red/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h2 className="font-guardian text-2xl text-white mb-2">
            Emergency Support Activated
          </h2>
          <p className="text-white/80 mb-6">
            Priority connection to our emergency response team
          </p>
          <div className="space-y-3">
            <Button className="w-full bg-white text-emergency-red hover:bg-white/90 font-guardian">
              <Phone className="w-4 h-4 mr-2" />
              Call Emergency Line
            </Button>
            <Button
              onClick={() => setActiveSupport('none')}
              variant="outline"
              className="w-full border-white/30 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Return floating button if panel is not active
  return activeSupport === 'none' ? <FloatingButton /> : <SupportPanel />;
};

export default LiveSafetySupport;