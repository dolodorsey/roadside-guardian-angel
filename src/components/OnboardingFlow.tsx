import React, { useState } from 'react';
import WelcomeStep from './onboarding/WelcomeStep';
import ProfileStep from './onboarding/ProfileStep';
import PaymentStep from './onboarding/PaymentStep';
import TrustStep from './onboarding/TrustStep';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSkipFlow, setIsSkipFlow] = useState(false);

  const steps = [
    { component: WelcomeStep, title: 'Welcome' },
    { component: ProfileStep, title: 'Profile' },
    { component: PaymentStep, title: 'Payment' },
    { component: TrustStep, title: 'Trust & Safety' },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipToEmergency = () => {
    setIsSkipFlow(true);
    // In a real app, this would trigger emergency flow
    alert('Emergency flow would start here - collecting phone & location first');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-black to-asphalt-gray flex flex-col">
      {/* Emergency Skip Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={handleSkipToEmergency}
          className="emergency-cta text-foreground px-4 py-2 rounded-lg text-sm font-guardian"
        >
          🚨 Request Help First
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center pt-8 pb-4">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= currentStep 
                  ? 'bg-neon-green shadow-guardian' 
                  : 'bg-metallic-silver/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <CurrentStepComponent
            onNext={handleNext}
            onBack={currentStep > 0 ? handleBack : undefined}
            isLastStep={currentStep === steps.length - 1}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;