import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface VoiceInterfaceProps {
  isPlaying: boolean;
  currentMessage: string | null;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  voice?: string;
  speed?: number;
  onSpeedChange?: (speed: number) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  isPlaying,
  currentMessage,
  onPlay,
  onPause,
  onStop,
  voice = 'aria',
  speed = 1.0,
  onSpeedChange
}) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Simulate voice playback progress
  useEffect(() => {
    if (isPlaying && currentMessage) {
      const estimatedDuration = currentMessage.length * 50 * (1 / speed); // Rough estimate
      setDuration(estimatedDuration);
      
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= estimatedDuration) {
            onStop();
            return 0;
          }
          return prev + 100;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isPlaying, currentMessage, speed, onStop]);

  if (!currentMessage) return null;

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-midnight-black/90 backdrop-blur-sm rounded-2xl p-4 max-w-sm">
      {/* Voice Message Display */}
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <Volume2 className="w-4 h-4 text-electric-blue mr-2" />
          <span className="text-electric-blue font-tech text-sm">AI Concierge</span>
        </div>
        <p className="text-foreground text-sm line-clamp-3">{currentMessage}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[progress]}
          max={duration}
          step={100}
          className="w-full"
          onValueChange={([value]) => setProgress(value)}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setProgress(Math.max(0, progress - 5000))}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={isPlaying ? onPause : onPlay}
            size="icon"
            className="h-10 w-10 bg-electric-blue hover:bg-electric-blue/90"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setProgress(Math.min(duration, progress + 5000))}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Speed:</span>
          <select
            value={speed}
            onChange={(e) => onSpeedChange?.(parseFloat(e.target.value))}
            className="bg-asphalt-gray/50 border border-border rounded px-2 py-1 text-xs text-foreground"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1.0">1.0x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
          </select>
        </div>
      </div>

      {/* Voice Selection */}
      <div className="mt-3 pt-3 border-t border-border/30">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Voice:</span>
          <select
            value={voice}
            className="bg-asphalt-gray/50 border border-border rounded px-2 py-1 text-xs text-foreground"
          >
            <option value="aria">Aria (Default)</option>
            <option value="sarah">Sarah (Warm)</option>
            <option value="laura">Laura (Professional)</option>
            <option value="charlotte">Charlotte (Calm)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VoiceInterface;