import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Monitor, Smartphone } from 'lucide-react';
import ClientJourney from './ClientJourney';
import ProviderJourney from './ProviderJourney';
import CinematicSplitScreen from './CinematicSplitScreen';
import RoadsideBeacon from '../RoadsideBeacon';
import EmergencyButton from '../EmergencyButton';

interface CinematicDemoProps {
  autoPlay?: boolean;
  onComplete?: () => void;
}

const CinematicDemo: React.FC<CinematicDemoProps> = ({ 
  autoPlay = false, 
  onComplete 
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<'client' | 'provider' | 'split' | 'cinematic'>('cinematic');
  const [clientStep, setClientStep] = useState(0);
  const [providerStep, setProviderStep] = useState(0);
  const [showCinematicSplit, setShowCinematicSplit] = useState(false);

  // Demo script timing
  const demoSteps = [
    { label: 'Opening Vision', duration: 3000, clientStep: 0, providerStep: -1 },
    { label: 'Service Selection', duration: 2500, clientStep: 1, providerStep: -1 },
    { label: 'Location Confirm', duration: 2000, clientStep: 2, providerStep: -1 },
    { label: 'Pricing Preview', duration: 1500, clientStep: 3, providerStep: -1 },
    { label: 'Dispatch & Match', duration: 2000, clientStep: 4, providerStep: 0 },
    { label: 'Provider Accepts', duration: 2000, clientStep: 4, providerStep: 1 },
    { label: 'En Route Tracking', duration: 3000, clientStep: 5, providerStep: 2 },
    { label: 'Arrival & Verification', duration: 2500, clientStep: 6, providerStep: 3 },
    { label: 'Job Completion', duration: 2000, clientStep: 7, providerStep: 4 },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentStep < demoSteps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setClientStep(demoSteps[nextStep].clientStep);
        setProviderStep(demoSteps[nextStep].providerStep);
      } else {
        setIsPlaying(false);
        onComplete?.();
      }
    }, demoSteps[currentStep]?.duration || 2000);

    return () => clearTimeout(timer);
  }, [currentStep, isPlaying, onComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setClientStep(0);
    setProviderStep(0);
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setClientStep(demoSteps[stepIndex].clientStep);
    setProviderStep(demoSteps[stepIndex].providerStep);
    setIsPlaying(false);
  };

  // Show cinematic split screen if requested
  if (showCinematicSplit) {
    return <CinematicSplitScreen onExit={() => setShowCinematicSplit(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-black to-asphalt-gray/50">
      {/* Demo Controls */}
      <div className="absolute top-6 left-6 right-6 z-50">
        <div className="flex items-center justify-between">
          {/* Playback Controls */}
          <div className="flex items-center gap-4 p-4 tech-surface rounded-xl border border-border/50">
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
              onClick={handleReset}
              className="w-10 h-10 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </EmergencyButton>

            <div className="text-sm font-tech text-muted-foreground">
              Step {currentStep + 1} of {demoSteps.length}
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-2 p-2 tech-surface rounded-xl border border-border/50">
            <button
              onClick={() => setViewMode('client')}
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'client' 
                  ? 'bg-emergency-red/20 text-emergency-red border border-emergency-red/30' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'split' 
                  ? 'bg-beacon-blue/20 text-beacon-blue border border-beacon-blue/30' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('provider')}
              className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                viewMode === 'provider' 
                  ? 'bg-pulse-green/20 text-pulse-green border border-pulse-green/30' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCinematicSplit(true)}
              className="px-4 py-2 rounded-lg bg-gradient-emergency text-white border border-emergency-red/30 hover:shadow-emergency transition-all duration-300"
            >
              🎬 Keynote
            </button>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="mt-4 p-4 tech-surface rounded-xl border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-tech text-foreground">Demo Timeline</h3>
            <div className="text-sm text-muted-foreground">
              {demoSteps[currentStep]?.label}
            </div>
          </div>
          
          <div className="flex gap-2">
            {demoSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleStepClick(index)}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-emergency-red shadow-emergency'
                    : index < currentStep
                    ? 'bg-pulse-green'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="pt-40 pb-20">
        {viewMode === 'client' && (
          <div className="max-w-md mx-auto">
            <ClientJourney 
              currentStep={clientStep} 
              isPlaying={isPlaying}
            />
          </div>
        )}

        {viewMode === 'provider' && (
          <div className="max-w-md mx-auto">
            <ProviderJourney 
              currentStep={providerStep} 
              isPlaying={isPlaying}
            />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Client Side */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emergency-red/20 border border-emergency-red/30 mb-4">
                    <RoadsideBeacon size="sm" variant="emergency" />
                    <span className="font-tech text-emergency-red">Client Journey</span>
                  </div>
                </div>
                <div className="max-w-md mx-auto">
                  <ClientJourney 
                    currentStep={clientStep} 
                    isPlaying={isPlaying}
                  />
                </div>
              </div>

              {/* Provider Side */}
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pulse-green/20 border border-pulse-green/30 mb-4">
                    <RoadsideBeacon size="sm" variant="guardian" />
                    <span className="font-tech text-pulse-green">Provider Journey</span>
                  </div>
                </div>
                <div className="max-w-md mx-auto">
                  {providerStep >= 0 ? (
                    <ProviderJourney 
                      currentStep={providerStep} 
                      isPlaying={isPlaying}
                    />
                  ) : (
                    <div className="aspect-[9/16] rounded-3xl bg-asphalt-gray/50 border border-border/30 flex items-center justify-center">
                      <div className="text-center">
                        <RoadsideBeacon size="lg" variant="tech" />
                        <p className="text-muted-foreground font-tech mt-4">
                          Waiting for dispatch...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Footer */}
      <div className="absolute bottom-6 left-6 right-6 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 tech-surface rounded-xl border border-border/50">
          <RoadsideBeacon size="sm" variant="tech" />
          <span className="font-tech text-foreground">
            S.O.S Cinematic Demo
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">
            Apple Keynote Experience
          </span>
        </div>
      </div>
    </div>
  );
};

export default CinematicDemo;