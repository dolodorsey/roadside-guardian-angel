import React, { useState } from 'react';
import { Play, CheckCircle, Users, Shield, Star, MessageCircle } from 'lucide-react';
import EmergencyButton from '@/components/EmergencyButton';

interface TrainingStepProps {
  onNext: () => void;
  onBack: () => void;
}

const TrainingStep: React.FC<TrainingStepProps> = ({ onNext, onBack }) => {
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [currentModule, setCurrentModule] = useState<string | null>(null);

  const trainingModules = [
    {
      id: 'customer-service',
      title: 'Customer Service Excellence',
      description: 'Learn how to greet customers, verify identity, and provide exceptional service',
      icon: <Users className="w-6 h-6" />,
      duration: '5 min',
      content: {
        title: 'Customer Service Standards',
        points: [
          'Always introduce yourself and show your Roadside ID',
          'Verify the customer by asking for their name and vehicle details',
          'Explain what you\'re going to do before starting any work',
          'Keep the customer informed throughout the service',
          'Be professional, courteous, and empathetic to their situation'
        ]
      }
    },
    {
      id: 'safety-protocols',
      title: 'Safety Protocols',
      description: 'Essential safety procedures for roadside assistance',
      icon: <Shield className="w-6 h-6" />,
      duration: '7 min',
      content: {
        title: 'Safety First',
        points: [
          'Always wear high-visibility clothing and use proper lighting',
          'Position your vehicle to protect the work area',
          'Check for traffic and environmental hazards',
          'Use proper lifting techniques and safety equipment',
          'Follow all traffic laws and road safety guidelines'
        ]
      }
    },
    {
      id: 'quality-standards',
      title: 'Quality Standards',
      description: 'Maintaining high service quality and customer satisfaction',
      icon: <Star className="w-6 h-6" />,
      duration: '4 min',
      content: {
        title: 'Quality Excellence',
        points: [
          'Complete all work to industry standards',
          'Clean up your work area before leaving',
          'Provide clear explanations of any issues found',
          'Offer advice for preventing future problems',
          'Ensure customer satisfaction before marking job complete'
        ]
      }
    },
    {
      id: 'communication',
      title: 'Communication Best Practices',
      description: 'Effective communication through the Roadside platform',
      icon: <MessageCircle className="w-6 h-6" />,
      duration: '3 min',
      content: {
        title: 'Communication Guidelines',
        points: [
          'Send arrival notifications when you\'re 5 minutes away',
          'Use the in-app messaging for updates',
          'Take photos to document your work when appropriate',
          'Update job status promptly and accurately',
          'Contact support if you encounter any issues'
        ]
      }
    }
  ];

  const handleModuleStart = (moduleId: string) => {
    setCurrentModule(moduleId);
  };

  const handleModuleComplete = (moduleId: string) => {
    setCompletedModules(prev => [...prev, moduleId]);
    setCurrentModule(null);
  };

  const allModulesComplete = completedModules.length === trainingModules.length;

  if (currentModule) {
    const module = trainingModules.find(m => m.id === currentModule)!;
    
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => setCurrentModule(null)}
            className="text-electric-blue hover:text-electric-blue/80 mb-4"
          >
            ← Back to Modules
          </button>
          <h2 className="font-guardian text-2xl text-foreground mb-2">
            {module.content.title}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl tech-surface border border-border/50">
            <h3 className="font-guardian text-lg text-foreground mb-4">Key Points to Remember:</h3>
            <ul className="space-y-3">
              {module.content.points.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-neon-green/5 border border-neon-green/20">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-neon-green" />
              <span className="text-neon-green font-tech">Remember</span>
            </div>
            <p className="text-muted-foreground">
              These standards help maintain the trust and quality that Roadside customers expect. 
              Following these guidelines ensures a positive experience for everyone.
            </p>
          </div>

          <EmergencyButton
            variant="primary"
            size="lg"
            onClick={() => handleModuleComplete(currentModule)}
            className="w-full"
            showBeacon={true}
          >
            Mark Module Complete
          </EmergencyButton>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-electric-blue/20 border border-electric-blue/30 flex items-center justify-center">
          <Play className="w-10 h-10 text-electric-blue" />
        </div>
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          Provider Training
        </h2>
        <p className="text-muted-foreground">
          Complete our interactive training modules to learn Roadside service standards
        </p>
      </div>

      {/* Training Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {trainingModules.map((module) => {
          const isCompleted = completedModules.includes(module.id);
          
          return (
            <div
              key={module.id}
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                isCompleted
                  ? 'border-neon-green bg-neon-green/5 shadow-guardian'
                  : 'border-border/50 tech-surface hover:border-electric-blue/50'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-neon-green/20 text-neon-green' 
                    : 'bg-electric-blue/20 text-electric-blue'
                }`}>
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : module.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-guardian text-lg text-foreground mb-2">
                    {module.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {module.description}
                  </p>
                  <div className="text-electric-blue text-sm font-tech">
                    {module.duration}
                  </div>
                </div>
              </div>

              {!isCompleted ? (
                <button
                  onClick={() => handleModuleStart(module.id)}
                  className="w-full p-3 rounded-lg bg-electric-blue/10 border border-electric-blue/30 hover:bg-electric-blue/20 transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-4 h-4 text-electric-blue" />
                    <span className="text-electric-blue font-tech">Start Module</span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-neon-green/10 border border-neon-green/30">
                  <CheckCircle className="w-4 h-4 text-neon-green" />
                  <span className="text-neon-green font-tech">Completed</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 p-4 rounded-xl tech-surface border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-foreground font-tech">Training Progress</span>
          <span className="text-neon-green font-tech">
            {completedModules.length} / {trainingModules.length}
          </span>
        </div>
        <div className="w-full bg-metallic-silver/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-electric-blue to-neon-green h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedModules.length / trainingModules.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <EmergencyButton
          variant="ghost"
          size="lg"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </EmergencyButton>
        <EmergencyButton
          variant="primary"
          size="lg"
          onClick={onNext}
          className="flex-1"
          disabled={!allModulesComplete}
          showBeacon={allModulesComplete}
        >
          Complete Training
        </EmergencyButton>
      </div>
    </div>
  );
};

export default TrainingStep;