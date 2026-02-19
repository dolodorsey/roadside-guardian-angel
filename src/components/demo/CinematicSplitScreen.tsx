import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Monitor, ArrowLeft, ArrowRight } from 'lucide-react';
import ClientJourney from './ClientJourney';
import ProviderJourney from './ProviderJourney';
import RoadsideBeacon from '../RoadsideBeacon';
import EmergencyButton from '../EmergencyButton';

interface CinematicSplitScreenProps {
  onExit?: () => void;
}

const CinematicSplitScreen: React.FC<CinematicSplitScreenProps> = ({ onExit }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clientStep, setClientStep] = useState(0);
  const [providerStep, setProviderStep] = useState(-1);

  // Enhanced cinematic scenes for investor pitch
  const scenes = [
    {
      title: "Opening Panic",
      description: "Jane has a flat tire at night",
      duration: 4000,
      clientStep: 0,
      providerStep: -1,
      narrative: "User opens app in emergency situation"
    },
    {
      title: "The SOS Signal",
      description: "Beacon detects location, roads illuminate",
      duration: 3000,
      clientStep: 1,
      providerStep: -1,
      narrative: "Service selection with animated cards"
    },
    {
      title: "Provider Network Activation",
      description: "John sees the job request",
      duration: 2500,
      clientStep: 2,
      providerStep: 0,
      narrative: "Split view: Location confirm vs Provider online"
    },
    {
      title: "The Match",
      description: "Job accepted, both apps sync",
      duration: 2000,
      clientStep: 3,
      providerStep: 1,
      narrative: "Pricing preview vs Incoming job alert"
    },
    {
      title: "Dispatch & Navigation",
      description: "Real-time tracking begins",
      duration: 3500,
      clientStep: 4,
      providerStep: 2,
      narrative: "Live GPS tracking on both sides"
    },
    {
      title: "Concierge Reassurance",
      description: "AI provides safety updates",
      duration: 2500,
      clientStep: 5,
      providerStep: 2,
      narrative: "AI shield pulses with voice updates"
    },
    {
      title: "Arrival & Verification",
      description: "ID match security system",
      duration: 2500,
      clientStep: 6,
      providerStep: 3,
      narrative: "Both apps verify provider identity"
    },
    {
      title: "Safe. Complete.",
      description: "Green shield lock on both screens",
      duration: 3000,
      clientStep: 7,
      providerStep: 4,
      narrative: "Synchronized completion celebration"
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentScene < scenes.length - 1) {
        const nextScene = currentScene + 1;
        setCurrentScene(nextScene);
        setClientStep(scenes[nextScene].clientStep);
        setProviderStep(scenes[nextScene].providerStep);
      } else {
        setIsPlaying(false);
      }
    }, scenes[currentScene]?.duration || 3000);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentScene(0);
    setClientStep(0);
    setProviderStep(-1);
  };

  const handlePrevious = () => {
    if (currentScene > 0) {
      const prevScene = currentScene - 1;
      setCurrentScene(prevScene);
      setClientStep(scenes[prevScene].clientStep);
      setProviderStep(scenes[prevScene].providerStep);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      const nextScene = currentScene + 1;
      setCurrentScene(nextScene);
      setClientStep(scenes[nextScene].clientStep);
      setProviderStep(scenes[nextScene].providerStep);
      setIsPlaying(false);
    }
  };

  const currentSceneData = scenes[currentScene];

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-black via-asphalt-gray/20 to-midnight-black relative overflow-hidden">
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(90deg, hsl(var(--pulse-green)) 1px, transparent 1px),
              linear-gradient(hsl(var(--pulse-green)) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            animation: 'road-drift 20s infinite linear'
          }}
        />
      </div>

      {/* Header Controls */}
      <div className="absolute top-6 left-6 right-6 z-50">
        <div className="flex items-center justify-between">
          {/* Scene Info */}
          <div className="flex items-center gap-4">
            {onExit && (
              <EmergencyButton
                variant="ghost"
                size="sm"
                onClick={onExit}
                className="px-3 py-2"
              >
                ← Back
              </EmergencyButton>
            )}
            
            <div className="p-4 tech-surface rounded-xl border border-border/50">
              <div className="flex items-center gap-4">
                <RoadsideBeacon size="sm" variant="tech" />
                <div>
                  <h2 className="font-tech text-foreground">Cinematic Demo</h2>
                  <p className="text-sm text-muted-foreground">Apple Keynote Style</p>
                </div>
              </div>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-3 p-3 tech-surface rounded-xl border border-border/50">
            <EmergencyButton
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={currentScene === 0}
              className="w-10 h-10 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </EmergencyButton>
            
            <EmergencyButton
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="w-10 h-10 p-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </EmergencyButton>
            
            <EmergencyButton
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={currentScene === scenes.length - 1}
              className="w-10 h-10 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </EmergencyButton>
            
            <EmergencyButton
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="w-10 h-10 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </EmergencyButton>
          </div>
        </div>

        {/* Scene Progress & Title */}
        <div className="mt-4 p-4 tech-surface rounded-xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-tech text-lg text-foreground">{currentSceneData.title}</h3>
              <p className="text-sm text-muted-foreground">{currentSceneData.description}</p>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              Scene {currentScene + 1} of {scenes.length}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-1">
            {scenes.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  index === currentScene
                    ? 'bg-emergency-red shadow-emergency animate-pulse'
                    : index < currentScene
                    ? 'bg-pulse-green'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>
          
          {/* Narrative */}
          <div className="mt-3 text-center">
            <p className="text-xs text-electric-blue font-tech animate-fade-in">
              {currentSceneData.narrative}
            </p>
          </div>
        </div>
      </div>

      {/* Split Screen Content */}
      <div className="pt-52 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Client Side */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-emergency border border-emergency-red/30 mb-6 animate-pulse">
                  <RoadsideBeacon size="sm" variant="emergency" />
                  <div>
                    <div className="font-tech text-white text-lg">USER APP</div>
                    <div className="text-xs text-white/80">Jane's Emergency</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Cinematic Frame */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emergency-red/20 to-transparent blur-xl"></div>
                <div className="relative">
                  <ClientJourney 
                    currentStep={clientStep} 
                    isPlaying={isPlaying}
                  />
                </div>
              </div>
            </div>

            {/* Provider Side */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-beacon border border-pulse-green/30 mb-6 animate-pulse">
                  <RoadsideBeacon size="sm" variant="guardian" />
                  <div>
                    <div className="font-tech text-white text-lg">PROVIDER APP</div>
                    <div className="text-xs text-white/80">John's Response</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                {/* Cinematic Frame */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-l from-pulse-green/20 to-transparent blur-xl"></div>
                <div className="relative">
                  {providerStep >= 0 ? (
                    <ProviderJourney 
                      currentStep={providerStep} 
                      isPlaying={isPlaying}
                    />
                  ) : (
                    <div className="aspect-[9/16] rounded-3xl bg-gradient-to-b from-asphalt-gray/30 to-midnight-black border border-border/30 flex items-center justify-center">
                      <div className="text-center animate-pulse">
                        <RoadsideBeacon size="lg" variant="tech" />
                        <p className="text-muted-foreground font-tech mt-4">
                          Waiting for activation...
                        </p>
                        <div className="mt-2 text-xs text-electric-blue animate-pulse">
                          Provider network standby
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Synchronized Completion Effect */}
          {currentScene === scenes.length - 1 && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="flex items-center justify-center h-full">
                <div className="text-center animate-scale-in">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-full bg-pulse-green/30 animate-ping scale-150"></div>
                    <div className="relative w-32 h-32 mx-auto rounded-full bg-pulse-green/40 flex items-center justify-center border-4 border-pulse-green">
                      <div className="text-4xl animate-shield-lock">🛡️</div>
                    </div>
                  </div>
                  
                  <h1 className="font-guardian text-4xl text-foreground mb-4">
                    SAFE. COMPLETE.
                  </h1>
                  <p className="text-lg text-pulse-green font-tech">
                    Both drivers protected. Mission accomplished.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-6 right-6 text-center">
        <div className="inline-flex items-center gap-4 px-8 py-4 tech-surface rounded-2xl border border-border/50">
          <RoadsideBeacon size="md" variant="tech" />
          <div className="text-left">
            <div className="font-guardian text-foreground text-lg">S.O.S</div>
            <div className="text-sm text-muted-foreground">Cinematic Demo Experience</div>
          </div>
          <div className="text-right text-xs text-electric-blue font-tech">
            Apple Keynote Style
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicSplitScreen;