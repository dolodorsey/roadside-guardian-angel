import React from 'react';
import { 
  Truck, 
  Zap, 
  Circle, 
  Key, 
  Fuel,
  DollarSign,
  Shield
} from 'lucide-react';

const OnDemandPricing: React.FC = () => {
  const services = [
    {
      id: 'tow',
      name: 'Towing Service',
      icon: <Truck className="w-8 h-8" />,
      priceRange: '$65 - $90',
      description: 'Professional towing to your preferred location',
      included: ['Up to 5 miles included', 'Additional miles: $3.50/mile', 'Safe vehicle handling'],
      memberDiscount: {
        basic: '$52 - $72',
        premium: '$39 - $54'
      }
    },
    {
      id: 'jumpstart',
      name: 'Jump Start',
      icon: <Zap className="w-8 h-8" />,
      priceRange: '$40 - $55',
      description: 'Quick battery jump to get you moving',
      included: ['Professional battery testing', 'Safety check', 'Quick response'],
      memberDiscount: {
        basic: '$32 - $44',
        premium: '$24 - $33'
      }
    },
    {
      id: 'tire',
      name: 'Flat Tire Repair',
      icon: <Circle className="w-8 h-8" />,
      priceRange: '$45 - $60',
      description: 'Tire change or temporary repair',
      included: ['Spare tire installation', 'Tire pressure check', 'Safety inspection'],
      memberDiscount: {
        basic: '$36 - $48',
        premium: '$27 - $36'
      }
    },
    {
      id: 'lockout',
      name: 'Vehicle Lockout',
      icon: <Key className="w-8 h-8" />,
      priceRange: '$45 - $65',
      description: 'Safe vehicle unlocking service',
      included: ['Non-damage entry', 'Key replacement referral', 'ID verification'],
      memberDiscount: {
        basic: '$36 - $52',
        premium: '$27 - $39'
      }
    },
    {
      id: 'fuel',
      name: 'Fuel Delivery',
      icon: <Fuel className="w-8 h-8" />,
      priceRange: '$40 - $50',
      description: 'Emergency fuel delivery to your location',
      included: ['2-3 gallons of fuel', 'Service fee only', 'Quick delivery'],
      additional: '+ Fuel cost at current market rate',
      memberDiscount: {
        basic: '$32 - $40',
        premium: '$24 - $30'
      }
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="font-guardian text-3xl text-foreground mb-4">
          Transparent Pay-As-You-Go Pricing
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          No surprises, no hidden fees. Pay only for what you need, when you need it. 
          Members save significantly on every service call.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div 
            key={service.id}
            className="p-6 rounded-2xl tech-surface border border-border/50 hover:border-neon-green/50 transition-all duration-300"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animation: 'guardian-enter 0.6s ease-out forwards'
            }}
          >
            {/* Service Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-electric-blue/20 border border-electric-blue/30 flex items-center justify-center">
                <div className="text-electric-blue">
                  {service.icon}
                </div>
              </div>
              <div>
                <h3 className="font-guardian text-xl text-foreground mb-1">
                  {service.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {service.description}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="font-guardian text-3xl text-foreground">
                  {service.priceRange}
                </span>
                <span className="text-muted-foreground text-sm">base price</span>
              </div>
              
              {service.additional && (
                <div className="text-electric-blue text-sm font-tech mb-2">
                  {service.additional}
                </div>
              )}
            </div>

            {/* What's Included */}
            <div className="mb-6">
              <h4 className="font-tech text-foreground mb-3">What's Included:</h4>
              <ul className="space-y-2">
                {service.included.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-neon-green rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Member Discounts */}
            <div className="space-y-3">
              <h4 className="font-tech text-foreground text-sm">Member Pricing:</h4>
              
              <div className="p-3 rounded-lg bg-electric-blue/5 border border-electric-blue/20">
                <div className="flex items-center justify-between">
                  <span className="text-electric-blue text-sm font-tech">Basic Member</span>
                  <span className="font-tech text-foreground">{service.memberDiscount.basic}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Save 20%</div>
              </div>
              
              <div className="p-3 rounded-lg bg-neon-green/5 border border-neon-green/20">
                <div className="flex items-center justify-between">
                  <span className="text-neon-green text-sm font-tech">Premium Member</span>
                  <span className="font-tech text-foreground">{service.memberDiscount.premium}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">Save 40%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Transparency */}
      <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-neon-green/5 to-electric-blue/5 border border-neon-green/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/20 border border-neon-green/30 flex items-center justify-center">
            <Shield className="w-8 h-8 text-neon-green" />
          </div>
          <h3 className="font-guardian text-2xl text-foreground mb-4">
            Pricing Transparency Guarantee
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neon-green/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-neon-green" />
            </div>
            <h4 className="font-tech text-foreground mb-2">No Hidden Fees</h4>
            <p className="text-muted-foreground text-sm">
              The price you see is the price you pay. No surprise charges or hidden costs.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-electric-blue/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-electric-blue" />
            </div>
            <h4 className="font-tech text-foreground mb-2">Upfront Pricing</h4>
            <p className="text-muted-foreground text-sm">
              See exact costs before confirming service. No billing surprises after the fact.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emergency-red/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-emergency-red" />
            </div>
            <h4 className="font-tech text-foreground mb-2">Satisfaction Guarantee</h4>
            <p className="text-muted-foreground text-sm">
              Not satisfied? We'll make it right or refund your service fee.
            </p>
          </div>
        </div>
      </div>

      {/* Membership CTA */}
      <div className="mt-16 text-center p-8 rounded-2xl tech-surface border border-border/50">
        <h3 className="font-guardian text-2xl text-foreground mb-4">
          Save More with Membership
        </h3>
        <p className="text-muted-foreground mb-6">
          Join millions of drivers who choose peace of mind over pay-per-use pricing
        </p>
        
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="font-guardian text-3xl text-electric-blue mb-1">$7.99/mo</div>
            <div className="text-muted-foreground text-sm">Basic Plan</div>
            <div className="text-electric-blue text-sm">Save 20%</div>
          </div>
          
          <div className="text-center border-l border-r border-border/30 px-8">
            <div className="font-guardian text-3xl text-neon-green mb-1">$14.99/mo</div>
            <div className="text-muted-foreground text-sm">Premium Plan</div>
            <div className="text-neon-green text-sm">Save 40%</div>
          </div>
          
          <div className="text-center">
            <div className="font-guardian text-3xl text-foreground mb-1">Unlimited</div>
            <div className="text-muted-foreground text-sm">Service Calls</div>
            <div className="text-neon-green text-sm">Premium Only</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnDemandPricing;