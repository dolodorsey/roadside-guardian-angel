import React, { useState } from 'react';
import VerificationStep from './onboarding/VerificationStep';
import TrainingStep from './onboarding/TrainingStep';
import CompletionStep from './onboarding/CompletionStep';

const ProviderOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationData, setVerificationData] = useState({});

  const steps = [
    'Verification',
    'Training',
    'Completion'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <VerificationStep
            onNext={handleNext}
            onDataUpdate={setVerificationData}
            data={verificationData}
          />
        );
      case 1:
        return (
          <TrainingStep
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <CompletionStep
            verificationData={verificationData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="text-center">
          <h1 className="font-guardian text-2xl text-foreground mb-4">
            Join the Hero Network
          </h1>
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-neon-green shadow-guardian' 
                    : 'bg-metallic-silver/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1">
        {renderStep()}
      </div>
    </div>
  );
};

export default ProviderOnboarding;