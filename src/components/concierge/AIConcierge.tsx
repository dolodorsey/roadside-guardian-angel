import React, { useState, useEffect, useRef } from 'react';
import { Shield, MessageCircle, Volume2, VolumeX, Mic, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConciergeDock from './ConciergeDock';
import ConciergeOverlay from './ConciergeOverlay';
import ConciergeShield from './ConciergeShield';

export interface ConciergeMessage {
  id: string;
  type: 'update' | 'reassurance' | 'guidance' | 'question' | 'system';
  content: string;
  timestamp: Date;
  hasVoice?: boolean;
  isFromUser?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface AIConciergeProps {
  serviceRequestState?: 'idle' | 'requesting' | 'matched' | 'enroute' | 'arrived' | 'active' | 'completed';
  providerETA?: number;
  providerName?: string;
  onServiceAction?: (action: string, data?: any) => void;
}

const AIConcierge: React.FC<AIConciergeProps> = ({
  serviceRequestState = 'idle',
  providerETA,
  providerName,
  onServiceAction
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentVoiceMessage, setCurrentVoiceMessage] = useState<string | null>(null);
  const messageIdRef = useRef(0);

  // Add system message
  const addMessage = (
    content: string,
    type: ConciergeMessage['type'] = 'system',
    options: Partial<ConciergeMessage> = {}
  ) => {
    const newMessage: ConciergeMessage = {
      id: `msg-${messageIdRef.current++}`,
      content,
      type,
      timestamp: new Date(),
      hasVoice: type !== 'system',
      ...options
    };

    setMessages(prev => [...prev, newMessage]);

    // Auto-play voice for high priority messages
    if (isVoiceEnabled && (options.priority === 'critical' || type === 'reassurance')) {
      playVoiceMessage(content);
    }

    return newMessage;
  };

  // Voice synthesis (placeholder for ElevenLabs integration)
  const playVoiceMessage = async (text: string) => {
    setCurrentVoiceMessage(text);
    
    // Simulate voice playback (would integrate with ElevenLabs)
    setTimeout(() => {
      setCurrentVoiceMessage(null);
    }, text.length * 50); // Rough estimate of speech duration
  };

  // Handle different service states
  useEffect(() => {
    switch (serviceRequestState) {
      case 'requesting':
        addMessage(
          "I'm finding the perfect provider for you right now. This will just take a moment.",
          'update',
          { priority: 'high' }
        );
        break;
        
      case 'matched':
        addMessage(
          `Great news! I've matched you with ${providerName || 'a verified provider'}. They're preparing to head your way.`,
          'reassurance',
          { priority: 'high' }
        );
        break;
        
      case 'enroute':
        if (providerETA) {
          addMessage(
            `${providerName || 'Your provider'} is en route and will arrive in approximately ${providerETA} minutes. You're in safe hands.`,
            'update',
            { priority: 'high' }
          );
        }
        break;
        
      case 'arrived':
        addMessage(
          "Your provider has arrived! Please verify their ID before they begin service. Safety first.",
          'guidance',
          { priority: 'critical' }
        );
        break;
        
      case 'completed':
        addMessage(
          "Service completed successfully! Thank you for choosing Roadside. Drive safely.",
          'reassurance',
          { priority: 'medium' }
        );
        break;
    }
  }, [serviceRequestState, providerETA, providerName]);

  // Periodic reassurance during waiting
  useEffect(() => {
    if (serviceRequestState === 'enroute') {
      const interval = setInterval(() => {
        const reassuranceMessages = [
          "Everything is going smoothly. Your provider is on their way.",
          "Still on track. I'll update you when they're closer.",
          "Your provider is making good time. Almost there.",
        ];
        
        const randomMessage = reassuranceMessages[Math.floor(Math.random() * reassuranceMessages.length)];
        addMessage(randomMessage, 'reassurance');
      }, 120000); // Every 2 minutes

      return () => clearInterval(interval);
    }
  }, [serviceRequestState]);

  // ETA updates
  useEffect(() => {
    if (providerETA && serviceRequestState === 'enroute') {
      if (providerETA <= 2) {
        addMessage(
          `${providerName || 'Your provider'} will arrive in about ${providerETA} minutes. Please prepare to verify their ID.`,
          'update',
          { priority: 'high' }
        );
      }
    }
  }, [providerETA, serviceRequestState, providerName]);

  return (
    <>
      {/* Dock Button */}
      <ConciergeDock
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        hasNewMessage={messages.length > 0}
        isVoicePlaying={currentVoiceMessage !== null}
      />

      {/* Expanded Overlay */}
      <ConciergeOverlay
        isVisible={isExpanded}
        onClose={() => setIsExpanded(false)}
        messages={messages}
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={() => setIsVoiceEnabled(!isVoiceEnabled)}
        isListening={isListening}
        onStartListening={() => setIsListening(true)}
        onStopListening={() => setIsListening(false)}
        onPlayVoice={playVoiceMessage}
        currentVoiceMessage={currentVoiceMessage}
        onSendMessage={(content: string) => {
          addMessage(content, 'question', { isFromUser: true });
          
          // Simple response system (would integrate with AI)
          setTimeout(() => {
            const responses = [
              "I understand your concern. Let me help with that.",
              "That's a great question. Here's what I can tell you:",
              "I'm here to help. Let me provide you with the information you need."
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            addMessage(response, 'guidance');
          }, 1000);
        }}
        onServiceAction={onServiceAction}
      />

      {/* Voice Indicator when playing */}
      {currentVoiceMessage && (
        <div className="fixed bottom-32 right-6 z-40">
          <div className="bg-midnight-black/90 backdrop-blur-sm rounded-2xl p-4 max-w-xs">
            <div className="flex items-center mb-2">
              <ConciergeShield isAnimating={true} size="sm" />
              <span className="ml-2 text-electric-blue font-tech text-sm">Speaking...</span>
            </div>
            <p className="text-foreground text-sm">{currentVoiceMessage}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIConcierge;