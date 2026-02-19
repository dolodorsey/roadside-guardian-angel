import React, { useState } from 'react';
import { 
  Shield, 
  Zap, 
  Crown, 
  Check, 
  Star,
  Phone,
  Car,
  Clock
} from 'lucide-react';
import EmergencyButton from '@/components/EmergencyButton';
import RoadsideBeacon from '@/components/RoadsideBeacon';

interface MembershipPlansProps {
  onPlanSelect: (planId: string) => void;
  selectedPlan: string | null;
}

const MembershipPlans: React.FC<MembershipPlansProps> = ({ onPlanSelect, selectedPlan }) => {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'free',
      name: 'Shield',
      price: '$0',
      period: 'forever',
      tagline: 'No subscription, just help when you need it',
      icon: <Shield className="w-8 h-8" />,
      color: 'metallic-silver',
      features: [
        'Access to all services',
        'Transparent flat pricing',
        'Standard response times',
        'Basic support',
        'Pay only when you use'
      ],
      limitations: [
        'No Shield discounts',
        'No priority response',
        'Standard wait times'
      ]
    },
    {
      id: 'basic',
      name: 'Shield',
      price: '$7.99',
      period: 'per month',
      tagline: 'Peace of mind for less than the cost of coffee',
      icon: <Zap className="w-8 h-8" />,
      color: 'electric-blue',
      popular: false,
      features: [
        '3 free missions per year',
        '20% off all additional services',
        'Priority response times',
        'Family add-on available',
        '24/7 Command Center support'
      ],
      savings: 'Save up to $180/year',
      familyAddOn: '$2.99 per additional Citizen'
    },
    {
      id: 'premium',
      name: 'Shield Pro',
      price: '$14.99',
      period: 'per month',
      tagline: 'Ultimate protection for serious drivers',
      icon: <Crown className="w-8 h-8" />,
      color: 'neon-green',
      popular: true,
      features: [
        'Unlimited missions',
        'Free towing up to 10 miles',
        '40% off extended services',
        '24/7 dedicated concierge hotline',
        'Covers up to 3 vehicles',
        'Priority response guarantee'
      ],
      savings: 'Save up to $400/year',
      badge: 'MOST POPULAR'
    }
  ];

  const getPlanCardStyle = (plan: any, index: number) => {
    const isHovered = hoveredPlan === plan.id;
    const isSelected = selectedPlan === plan.id;
    const isPremium = plan.popular;
    
    let baseClasses = 'relative p-8 rounded-2xl border-2 transition-all duration-500 cursor-pointer ';
    
    if (isPremium) {
      baseClasses += 'transform scale-105 ';
    }
    
    if (isSelected) {
      baseClasses += `border-${plan.color} bg-${plan.color}/10 shadow-${plan.color === 'neon-green' ? 'guardian' : 'tech'} `;
    } else if (isHovered) {
      baseClasses += `border-${plan.color}/50 bg-${plan.color}/5 scale-102 `;
    } else {
      baseClasses += 'border-border/50 tech-surface ';
    }
    
    return baseClasses;
  };

  return (
    <div className="space-y-8">
      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={plan.id}
            className={getPlanCardStyle(plan, index)}
            onMouseEnter={() => setHoveredPlan(plan.id)}
            onMouseLeave={() => setHoveredPlan(null)}
            onClick={() => onPlanSelect(plan.id)}
            style={{ 
              animationDelay: `${index * 0.2}s`,
              animation: 'guardian-enter 0.8s ease-out forwards'
            }}
          >
            {/* Popular Badge */}
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="px-4 py-1 rounded-full bg-neon-green text-midnight-black text-sm font-tech font-bold">
                  {plan.badge}
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-8">
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
                  {plan.price}
                </span>
                <span className="text-muted-foreground font-tech ml-2">
                  {plan.period}
                </span>
              </div>
              
              <p className="text-muted-foreground text-sm">
                {plan.tagline}
              </p>
              
              {plan.savings && (
                <div className={`mt-3 text-${plan.color} text-sm font-tech`}>
                  {plan.savings}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Check className={`w-5 h-5 text-${plan.color} flex-shrink-0`} />
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
              
              {plan.limitations && (
                <div className="pt-4 border-t border-border/30">
                  {plan.limitations.map((limitation, idx) => (
                    <div key={idx} className="flex items-center gap-3 opacity-60">
                      <div className="w-5 h-5 flex-shrink-0 text-muted-foreground">×</div>
                      <span className="text-muted-foreground text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Family Add-on */}
            {plan.familyAddOn && (
              <div className="mb-6 p-3 rounded-lg bg-electric-blue/5 border border-electric-blue/20">
                <div className="flex items-center gap-2 mb-1">
                  <Car className="w-4 h-4 text-electric-blue" />
                  <span className="text-electric-blue text-sm font-tech">Family Plan Available</span>
                </div>
                <span className="text-muted-foreground text-sm">{plan.familyAddOn}</span>
              </div>
            )}

            {/* CTA Button */}
            <EmergencyButton
              variant={plan.popular ? 'primary' : 'secondary'}
              size="lg"
              className="w-full"
              showBeacon={plan.popular}
            >
              {plan.id === 'free' ? 'Get Started Free' : `Choose ${plan.name}`}
            </EmergencyButton>

            {/* Hover Effects */}
            {hoveredPlan === plan.id && (
              <div className="absolute inset-0 rounded-2xl border-2 border-neon-green/30 animate-pulse pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Features */}
      <div className="mt-16">
        <h3 className="font-guardian text-2xl text-foreground text-center mb-8">
          Plan Comparison
        </h3>
        
        <div className="tech-surface border border-border/50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-6 border-b border-border/30">
            <div className="font-tech text-foreground">Features</div>
            <div className="text-center font-tech text-muted-foreground">Shield Free</div>
            <div className="text-center font-tech text-electric-blue">Shield</div>
            <div className="text-center font-tech text-neon-green">Shield Pro</div>
          </div>
          
          {[
            { feature: 'Missions Included', free: '0', basic: '3/year', premium: 'Unlimited' },
            { feature: 'Member Discount', free: '0%', basic: '20%', premium: '40%' },
            { feature: 'Response Priority', free: 'Standard', basic: 'Priority', premium: 'Guaranteed' },
            { feature: 'Vehicles Covered', free: '1', basic: '1 (+family)', premium: '3' },
            { feature: 'Concierge Support', free: '✗', basic: '✗', premium: '✓' },
            { feature: 'Free Towing Distance', free: 'None', basic: 'None', premium: '10 miles' }
          ].map((row, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-4 p-6 border-b border-border/30 last:border-b-0">
              <div className="font-tech text-foreground">{row.feature}</div>
              <div className="text-center text-muted-foreground text-sm">{row.free}</div>
              <div className="text-center text-electric-blue text-sm">{row.basic}</div>
              <div className="text-center text-neon-green text-sm">{row.premium}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h4 className="font-guardian text-xl text-foreground">Frequently Asked</h4>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl tech-surface border border-border/50">
              <h5 className="font-tech text-foreground mb-2">Can I cancel anytime?</h5>
              <p className="text-muted-foreground text-sm">
                Absolutely. Cancel your Shield plan anytime with no fees or penalties. 
                Your benefits continue until the end of your billing period.
              </p>
            </div>
            
            <div className="p-4 rounded-xl tech-surface border border-border/50">
              <h5 className="font-tech text-foreground mb-2">What if I need more than 3 missions?</h5>
              <p className="text-muted-foreground text-sm">
                Shield members get 20% off all additional missions. Shield Pro members get unlimited missions within fair use policy.
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h4 className="font-guardian text-xl text-foreground">Peace of Mind Guarantee</h4>
          
          <div className="p-6 rounded-xl bg-neon-green/5 border border-neon-green/20">
            <div className="flex items-center gap-3 mb-4">
              <RoadsideBeacon size="sm" variant="guardian" />
              <span className="font-tech text-neon-green">Your Safety Promise</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Verified, licensed, and insured Heroes only</li>
              <li>• Real-time GPS tracking and updates</li>
              <li>• 24/7 Command Center support and safety monitoring</li>
              <li>• 100% satisfaction guarantee or your money back</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipPlans;
