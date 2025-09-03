import React, { useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ConciergeShield from './ConciergeShield';

interface ElevenLabsVoiceProps {
  isEnabled: boolean;
  onToggle: () => void;
  onVoiceMessage?: (message: string) => void;
  apiKey?: string;
}

const ElevenLabsVoice: React.FC<ElevenLabsVoiceProps> = ({
  isEnabled,
  onToggle,
  onVoiceMessage,
  apiKey
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userMessage, setUserMessage] = useState('');

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setIsListening(false);
      setIsSpeaking(false);
    },
    onMessage: (message) => {
      if (message.type === 'user_transcript') {
        setUserMessage(message.transcript);
        onVoiceMessage?.(message.transcript);
      } else if (message.type === 'agent_response') {
        setIsSpeaking(true);
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      setIsListening(false);
      setIsSpeaking(false);
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are the AI Concierge for Roadside, a premium roadside assistance service. 
          
          Your personality:
          - Calm, empathetic, and professional
          - Reassuring without being overly cheerful
          - Direct and helpful, like a premium concierge service
          - Never robotic or cold
          
          Your role:
          - Provide real-time updates about service requests
          - Offer guidance and safety tips
          - Answer questions about services, pricing, and account
          - Provide reassurance during stressful roadside situations
          - Help with service management (cancellations, changes, etc.)
          
          Response style:
          - Keep responses concise but warm
          - Use "you're" instead of "you are" for natural speech
          - Avoid corporate jargon
          - Focus on peace of mind and safety
          
          Example responses:
          - "Your provider is 5 minutes away and moving closer. You're in safe hands."
          - "I understand this is stressful. Help is already on the way."
          - "Let me check your account and get that sorted for you right away."
          
          Always prioritize user safety and confidence.`,
        },
        firstMessage: "I'm your AI Concierge. I'm here to help you through your roadside experience. How can I assist you today?",
        language: "en",
      },
      tts: {
        voiceId: "9BWtsMINqrJLrRacOk9x" // Aria voice
      },
    },
  });

  const startConversation = async () => {
    if (!apiKey) {
      console.error('ElevenLabs API key not provided');
      return;
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation
      await conversation.startSession({
        agentId: "your-agent-id" // This would be configured in ElevenLabs
      });
      
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const stopConversation = async () => {
    try {
      await conversation.endSession();
      setIsListening(false);
      setIsSpeaking(false);
    } catch (error) {
      console.error('Failed to stop conversation:', error);
    }
  };

  const toggleVoiceConversation = () => {
    if (isListening) {
      stopConversation();
    } else {
      startConversation();
    }
  };

  if (!isEnabled) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Voice Status Indicator */}
      <div className="flex items-center">
        <ConciergeShield 
          isAnimating={isListening || isSpeaking} 
          size="sm" 
          variant="electric-blue" 
        />
        {(isListening || isSpeaking) && (
          <div className="ml-2">
            <div className="text-xs text-electric-blue font-tech">
              {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
            </div>
            {userMessage && (
              <div className="text-xs text-muted-foreground max-w-32 truncate">
                "{userMessage}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voice Toggle Button */}
      <Button
        onClick={toggleVoiceConversation}
        size="icon"
        className={`${
          isListening 
            ? 'bg-emergency-red hover:bg-emergency-red/90 animate-pulse' 
            : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'
        }`}
        disabled={!apiKey}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
      </Button>

      {/* Volume Control */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground"
      >
        {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default ElevenLabsVoice;