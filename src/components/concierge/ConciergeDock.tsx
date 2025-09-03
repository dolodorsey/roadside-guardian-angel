import React from 'react';
import { MessageCircle, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConciergeShield from './ConciergeShield';

interface ConciergeDockProps {
  isExpanded: boolean;
  onToggle: () => void;
  hasNewMessage?: boolean;
  isVoicePlaying?: boolean;
}

const ConciergeDock: React.FC<ConciergeDockProps> = ({
  isExpanded,
  onToggle,
  hasNewMessage = false,
  isVoicePlaying = false
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Pulse rings for new messages */}
        {hasNewMessage && !isExpanded && (
          <>
            <div className="absolute inset-0 rounded-full bg-electric-blue/20 animate-ping" />
            <div 
              className="absolute inset-0 rounded-full bg-electric-blue/30 animate-ping"
              style={{ animationDelay: '0.5s' }}
            />
          </>
        )}

        {/* Voice playing indicator */}
        {isVoicePlaying && (
          <div className="absolute inset-0 rounded-full bg-neon-green/30 animate-pulse" />
        )}

        {/* Main Button */}
        <Button
          onClick={onToggle}
          className={`relative w-16 h-16 rounded-full transition-all duration-300 border-2 ${
            isExpanded 
              ? 'bg-electric-blue/90 border-electric-blue shadow-tech scale-110' 
              : 'bg-electric-blue/80 border-electric-blue/50 shadow-tech hover:bg-electric-blue/90 hover:scale-105'
          }`}
          size="icon"
        >
          {isVoicePlaying ? (
            <Volume2 className="w-7 h-7 text-white animate-pulse" />
          ) : isExpanded ? (
            <div className="relative">
              <ConciergeShield isAnimating={false} size="sm" variant="white" />
            </div>
          ) : (
            <ConciergeShield 
              isAnimating={hasNewMessage} 
              size="sm" 
              variant="white"
            />
          )}
        </Button>

        {/* New message indicator dot */}
        {hasNewMessage && !isExpanded && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emergency-red rounded-full border-2 border-midnight-black animate-pulse">
            <div className="w-full h-full bg-emergency-red rounded-full animate-ping" />
          </div>
        )}

        {/* Quick label */}
        {!isExpanded && (
          <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 bg-midnight-black/90 text-electric-blue px-2 py-1 rounded-lg text-xs font-tech opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            AI Concierge
          </div>
        )}
      </div>
    </div>
  );
};

export default ConciergeDock;