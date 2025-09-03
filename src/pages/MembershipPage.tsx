import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MembershipPlans from '@/components/membership/MembershipPlans';
import OnDemandPricing from '@/components/membership/OnDemandPricing';
import FamilyPlans from '@/components/membership/FamilyPlans';
import TrustIndicators from '@/components/membership/TrustIndicators';
import MembershipConfirmation from '@/components/membership/MembershipConfirmation';

const MembershipPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentView, setCurrentView] = useState<'plans' | 'on-demand' | 'family'>('plans');
  const navigate = useNavigate();

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    if (planId === 'free') {
      // Free plan doesn't need payment
      setShowConfirmation(true);
    } else {
      // Navigate to payment flow for paid plans
      navigate(`/membership/checkout/${planId}`);
    }
  };

  const handleConfirmationComplete = () => {
    setShowConfirmation(false);
    navigate('/dashboard');
  };

  if (showConfirmation) {
    return (
      <MembershipConfirmation 
        planId={selectedPlan!}
        onComplete={handleConfirmationComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-midnight-black to-asphalt-gray">
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-guardian text-4xl md:text-5xl text-foreground mb-4">
              Choose Your Peace of Mind
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From occasional drivers to road warriors - there's a Roadside plan designed for your lifestyle
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 p-1 rounded-xl tech-surface border border-border/50">
              <button
                onClick={() => setCurrentView('plans')}
                className={`px-6 py-2 rounded-lg font-tech transition-all duration-300 ${
                  currentView === 'plans'
                    ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Membership Plans
              </button>
              <button
                onClick={() => setCurrentView('on-demand')}
                className={`px-6 py-2 rounded-lg font-tech transition-all duration-300 ${
                  currentView === 'on-demand'
                    ? 'bg-electric-blue/20 text-electric-blue border border-electric-blue/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Pay-As-You-Go
              </button>
              <button
                onClick={() => setCurrentView('family')}
                className={`px-6 py-2 rounded-lg font-tech transition-all duration-300 ${
                  currentView === 'family'
                    ? 'bg-emergency-red/20 text-emergency-red border border-emergency-red/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Family & Fleet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {currentView === 'plans' && (
          <MembershipPlans 
            onPlanSelect={handlePlanSelect}
            selectedPlan={selectedPlan}
          />
        )}
        
        {currentView === 'on-demand' && (
          <OnDemandPricing />
        )}
        
        {currentView === 'family' && (
          <FamilyPlans onPlanSelect={handlePlanSelect} />
        )}

        {/* Trust Indicators */}
        <TrustIndicators />
      </div>
    </div>
  );
};

export default MembershipPage;