import React, { useState, useRef, useEffect } from 'react';
import { X, Volume2, VolumeX, Mic, MicOff, Send, Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ConciergeShield from './ConciergeShield';
import { ConciergeMessage } from './AIConcierge';

interface ConciergeOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  messages: ConciergeMessage[];
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onPlayVoice: (text: string) => void;
  currentVoiceMessage: string | null;
  onSendMessage: (content: string) => void;
  onServiceAction?: (action: string, data?: any) => void;
}

const ConciergeOverlay: React.FC<ConciergeOverlayProps> = ({
  isVisible,
  onClose,
  messages,
  isVoiceEnabled,
  onToggleVoice,
  isListening,
  onStartListening,
  onStopListening,
  onPlayVoice,
  currentVoiceMessage,
  onSendMessage,
  onServiceAction
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isVisible) return null;

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const getMessageIcon = (type: ConciergeMessage['type']) => {
    switch (type) {
      case 'update':
        return '📍';
      case 'reassurance':
        return '💚';
      case 'guidance':
        return '💡';
      case 'question':
        return '❓';
      default:
        return '🤖';
    }
  };

  const getMessageStyle = (type: ConciergeMessage['type'], priority?: string) => {
    const baseStyle = "max-w-xs p-3 rounded-2xl animate-fade-in";
    
    if (priority === 'critical') {
      return `${baseStyle} bg-emergency-red/20 border border-emergency-red/30 text-foreground`;
    }
    
    switch (type) {
      case 'update':
        return `${baseStyle} bg-electric-blue/20 border border-electric-blue/30 text-foreground`;
      case 'reassurance':
        return `${baseStyle} bg-neon-green/20 border border-neon-green/30 text-foreground`;
      case 'guidance':
        return `${baseStyle} bg-metallic-silver/20 border border-metallic-silver/30 text-foreground`;
      default:
        return `${baseStyle} bg-asphalt-gray/50 border border-border/30 text-foreground`;
    }
  };

  return (
    <div className="fixed inset-0 bg-midnight-black/90 backdrop-blur-sm z-40 flex items-end justify-end">
      <div className="w-full max-w-md h-full max-h-[80vh] bg-asphalt-gray/95 backdrop-blur-xl border-l border-border/30 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ConciergeShield 
                isAnimating={currentVoiceMessage !== null} 
                size="sm" 
                variant="electric-blue"
              />
              <div className="ml-3">
                <h3 className="font-guardian text-lg text-foreground">AI Concierge</h3>
                <p className="text-electric-blue text-sm font-tech">
                  {currentVoiceMessage ? 'Speaking...' : 'Here to help'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleVoice}
                className={`${isVoiceEnabled ? 'text-neon-green' : 'text-muted-foreground'} hover:text-foreground`}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <ConciergeShield isAnimating={false} size="md" variant="electric-blue" />
              <p className="mt-4 font-tech">I'm here to help you through your roadside experience.</p>
              <p className="mt-2 text-sm">Ask me anything about your service, safety, or account.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={
                  message.isFromUser 
                    ? "max-w-xs p-3 rounded-2xl bg-electric-blue/80 text-white"
                    : getMessageStyle(message.type, message.priority)
                }>
                  {!message.isFromUser && (
                    <div className="flex items-center mb-1">
                      <span className="mr-2">{getMessageIcon(message.type)}</span>
                      <span className="text-xs text-muted-foreground font-tech">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {message.hasVoice && isVoiceEnabled && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPlayVoice(message.content)}
                          className="ml-2 h-5 w-5 text-electric-blue hover:text-electric-blue/80"
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-t border-border/30">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onServiceAction?.('cancel')}
              className="text-xs border-emergency-red/30 text-emergency-red hover:bg-emergency-red/10"
            >
              Cancel Service
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onServiceAction?.('contact-support')}
              className="text-xs border-neon-green/30 text-neon-green hover:bg-neon-green/10"
            >
              <Phone className="w-3 h-3 mr-1" />
              Call Support
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/30">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="bg-midnight-black/50 border-border focus:border-electric-blue text-foreground placeholder-muted-foreground"
              />
            </div>
            
            <Button
              onClick={isListening ? onStopListening : onStartListening}
              size="icon"
              className={`${
                isListening 
                  ? 'bg-emergency-red hover:bg-emergency-red/90 animate-pulse' 
                  : 'bg-neon-green/20 text-neon-green hover:bg-neon-green/30'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              size="icon"
              className="bg-electric-blue hover:bg-electric-blue/90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConciergeOverlay;