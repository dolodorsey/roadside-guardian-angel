import React, { useState } from 'react';
import { 
  Users, 
  Car, 
  Building, 
  Plus,
  Crown,
  Shield,
  Calculator
} from 'lucide-react';
import EmergencyButton from '@/components/EmergencyButton';

interface FamilyPlansProps {
  onPlanSelect: (planId: string) => void;
}

const FamilyPlans: React.FC<FamilyPlansProps> = ({ onPlanSelect }) => {
  const [familySize, setFamilySize] = useState(2);
  const [fleetSize, setFleetSize] = useState(5);

  const familyPlans = [
    {
      id: 'family-basic',
      name: 'Family Shield',
      basePrice: 7.99,
      additionalDriver: 2.99,
      icon: <Users className="w-8 h-8" />,
      color: 'electric-blue',
      features: [
        '3 missions per Citizen per year',
        '20% off all additional services',
        'Shared family dashboard',
        'Individual Citizen profiles',
        'Priority response for all members'
      ],
      maxDrivers: 6
    },
    {
      id: 'family-premium',
      name: 'Family Shield Pro',
      basePrice: 14.99,
      additionalDriver: 4.99,
      icon: <Crown className="w-8 h-8" />,
      color: 'neon-green',
      popular: true,
      features: [
        'Unlimited missions for all Citizens',
        '40% off extended services',
        'Covers unlimited vehicles',
        'Dedicated family concierge',
        'Emergency contact notifications',
        'Teen driver safety monitoring'
      ],
      maxDrivers: 8
    }
  ];

  const fleetPlans = [
    {
      id: 'fleet-starter',
      name: 'Fleet Starter',
      pricePerVehicle: 12.99,
      minVehicles: 3,
      maxVehicles: 10,
      icon: <Car className="w-8 h-8" />,
      color: 'electric-blue',
      features: [
        'Unlimited missions per vehicle',
        'Centralized fleet dashboard',
        'Hero management system',
        'Usage analytics and reporting',
        'Priority response guarantee'
      ]
    },
    {
      id: 'fleet-business',
      name: 'Fleet Business',
      pricePerVehicle: 10.99,
      minVehicles: 11,
      maxVehicles: 50,
      icon: <Building className="w-8 h-8" />,
      color: 'neon-green',
      features: [
        'Everything in Fleet Starter',
        'Dedicated account manager',
        'Custom billing and invoicing',
        '24/7 fleet Command Center',
        'Advanced analytics dashboard',
        'Volume discounts on parts'
      ]
    },
    {
      id: 'fleet-enterprise',
      name: 'Fleet Enterprise',
      pricePerVehicle: 'Custom',
      minVehicles: 51,
      maxVehicles: 'Unlimited',
      icon: <Building className="w-8 h-8" />,
      color: 'emergency-red',
      features: [
        'Everything in Fleet Business',
        'Custom SLA agreements',
        'API integration available',
        'White-label options',
        'National coverage guarantee',
        'Custom pricing structure'
      ]
    }
  ];

  const calculateFamilyPrice = (plan: typeof familyPlans[0]) => {
    const additionalDrivers = Math.max(0, familySize - 1);
    return plan.basePrice + (additionalDrivers * plan.additionalDriver);
  };

  const calculateFleetPrice = (plan: typeof fleetPlans[0]) => {
    if (plan.pricePerVehicle === 'Custom') return 'Custom';
    return (plan.pricePerVehicle as number) * fleetSize;
  };

  return (
    <div className="space-y-12">
      {/* Family Plans */}
      <div>
        <div className="text-center mb-8">
          <h2 className="font-guardian text-3xl text-foreground mb-4">
            Family Protection Plans
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Keep your whole family safe on the road. Add Citizens and vehicles with volume discounts.
          </p>
        </div>

        {/* Family Size Selector */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center gap-4">
              <span className="font-tech text-foreground">Family Size:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFamilySize(Math.max(2, familySize - 1))}
                  className="w-8 h-8 rounded-full bg-electric-blue/20 border border-electric-blue/30 flex items-center justify-center text-electric-blue hover:bg-electric-blue/30 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-guardian text-xl text-foreground">
                  {familySize}
                </span>
                <button
                  onClick={() => setFamilySize(Math.min(8, familySize + 1))}
                  className="w-8 h-8 rounded-full bg-electric-blue/20 border border-electric-blue/30 flex items-center justify-center text-electric-blue hover:bg-electric-blue/30 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-muted-foreground text-sm">Citizens</span>
            </div>
          </div>
        </div>

        {/* Family Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {familyPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-102 ${
                plan.popular
                  ? 'border-neon-green bg-neon-green/5 shadow-guardian'
                  : 'border-border/50 tech-surface hover:border-electric-blue/50'
              }`}
              onClick={() => onPlanSelect(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-neon-green text-midnight-black text-sm font-tech font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${plan.color}/20 border border-${plan.color}/30 flex items-center justify-center`}>
                  <div className={`text-${plan.color}`}>
                    {plan.icon}
                  </div>
                </div>
                
                <h3 className="font-guardian text-2xl text-foreground mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-3">
                  <span className="font-guardian text-4xl text-foreground">
                    ${calculateFamilyPrice(plan).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground font-tech ml-2">
                    per month
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  ${plan.basePrice}/mo base + ${plan.additionalDriver}/mo per additional Citizen
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Shield className={`w-4 h-4 text-${plan.color} flex-shrink-0`} />
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <EmergencyButton
                variant={plan.popular ? 'primary' : 'secondary'}
                size="lg"
                className="w-full"
                showBeacon={plan.popular}
              >
                Choose {plan.name}
              </EmergencyButton>
            </div>
          ))}
        </div>
      </div>

      {/* Fleet Plans */}
      <div>
        <div className="text-center mb-8">
          <h2 className="font-guardian text-3xl text-foreground mb-4">
            Fleet Business Plans
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Protect your business vehicles and Heroes with enterprise-grade rescue assistance.
          </p>
        </div>

        {/* Fleet Size Selector */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 rounded-xl tech-surface border border-border/50">
            <div className="flex items-center gap-4">
              <span className="font-tech text-foreground">Fleet Size:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFleetSize(Math.max(3, fleetSize - 1))}
                  className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center text-neon-green hover:bg-neon-green/30 transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center font-guardian text-xl text-foreground">
                  {fleetSize}
                </span>
                <button
                  onClick={() => setFleetSize(Math.min(100, fleetSize + 1))}
                  className="w-8 h-8 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center text-neon-green hover:bg-neon-green/30 transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-muted-foreground text-sm">vehicles</span>
            </div>
          </div>
        </div>

        {/* Fleet Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {fleetPlans.map((plan) => (
            <div
              key={plan.id}
              className="p-8 rounded-2xl border-2 border-border/50 tech-surface hover:border-neon-green/50 transition-all duration-300 cursor-pointer"
              onClick={() => onPlanSelect(plan.id)}
            >
              <div className="text-center mb-6">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${plan.color}/20 border border-${plan.color}/30 flex items-center justify-center`}>
                  <div className={`text-${plan.color}`}>
                    {plan.icon}
                  </div>
                </div>
                
                <h3 className="font-guardian text-2xl text-foreground mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-3">
                  <span className="font-guardian text-3xl text-foreground">
                    {typeof calculateFleetPrice(plan) === 'number' 
                      ? `$${(calculateFleetPrice(plan) as number).toFixed(2)}`
                      : calculateFleetPrice(plan)
                    }
                  </span>
                  {typeof calculateFleetPrice(plan) === 'number' && (
                    <span className="text-muted-foreground font-tech ml-2">
                      per month
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {plan.minVehicles}-{plan.maxVehicles} vehicles
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Car className={`w-4 h-4 text-${plan.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-foreground text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <EmergencyButton
                variant="secondary"
                size="lg"
                className="w-full"
              >
                {plan.id === 'fleet-enterprise' ? 'Contact Sales' : `Choose ${plan.name}`}
              </EmergencyButton>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Quote CTA */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-emergency-red/5 to-neon-green/5 border border-emergency-red/20 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emergency-red/20 border border-emergency-red/30 flex items-center justify-center">
          <Calculator className="w-8 h-8 text-emergency-red" />
        </div>
        
        <h3 className="font-guardian text-2xl text-foreground mb-4">
          Need a Custom Quote?
        </h3>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Large fleets, unique requirements, or special circumstances? 
          Our team will create a custom plan that fits your exact needs.
        </p>
        
        <EmergencyButton
          variant="primary"
          size="lg"
          className="mr-4"
        >
          Contact Sales
        </EmergencyButton>
        
        <EmergencyButton
          variant="ghost"
          size="lg"
        >
          Calculate Savings
        </EmergencyButton>
      </div>
    </div>
  );
};

export default FamilyPlans;
