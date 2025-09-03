import React from 'react';
import { Shield, CheckCircle, Clock, MapPin, Star } from 'lucide-react';

interface SafetyTimelineProps {
  currentStep: number;
  steps: {
    id: string;
    label: string;
    status: 'completed' | 'active' | 'pending';
    safetyIcon?: 'verified' | 'insured' | 'tracked' | 'rated';
  }[];
  showSafetyIndicators?: boolean;
}

const SafetyTimeline: React.FC<SafetyTimelineProps> = ({
  currentStep,
  steps,
  showSafetyIndicators = true
}) => {
  const getSafetyIcon = (safetyIcon?: string) => {
    switch (safetyIcon) {
      case 'verified':
        return <Shield className="w-3 h-3 text-neon-green" />;
      case 'insured':
        return <CheckCircle className="w-3 h-3 text-electric-blue" />;
      case 'tracked':
        return <MapPin className="w-3 h-3 text-emergency-red" />;
      case 'rated':
        return <Star className="w-3 h-3 text-yellow-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/30" />
        <div 
          className="absolute left-4 top-0 w-px bg-neon-green transition-all duration-500 ease-out"
          style={{ height: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isPending = index > currentStep;

            return (
              <div key={step.id} className="relative flex items-center">
                {/* Step Circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'border-emergency-red bg-emergency-red/20 animate-pulse'
                      : isCompleted
                      ? 'border-neon-green bg-neon-green/20'
                      : 'border-border bg-background'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-neon-green" />
                  ) : isActive ? (
                    <Clock className="w-4 h-4 text-emergency-red animate-spin" />
                  ) : (
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                  )}
                </div>

                {/* Step Content */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-tech text-sm ${
                        isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step.label}
                    </h3>

                    {/* Safety Indicator */}
                    {showSafetyIndicators && step.safetyIcon && isCompleted && (
                      <div className="flex items-center animate-fade-in">
                        {getSafetyIcon(step.safetyIcon)}
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="mt-1">
                    {isActive && (
                      <p className="text-xs text-emergency-red animate-pulse">
                        In progress...
                      </p>
                    )}
                    {isCompleted && (
                      <p className="text-xs text-neon-green">
                        Secured ✓
                      </p>
                    )}
                    {isPending && (
                      <p className="text-xs text-muted-foreground">
                        Pending
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Safety Summary */}
        {showSafetyIndicators && currentStep >= steps.length - 1 && (
          <div className="mt-6 p-3 bg-neon-green/10 rounded-lg border border-neon-green/20 animate-fade-in">
            <div className="flex items-center text-neon-green mb-1">
              <Shield className="w-4 h-4 mr-2" />
              <span className="font-tech text-sm">All Safety Checks Complete</span>
            </div>
            <p className="text-neon-green/80 text-xs">
              You're protected every step of the way
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyTimeline;