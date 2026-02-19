import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Input } from '@/components/ui/input';
import { 
  Car, 
  Shield, 
  Smartphone, 
  Users, 
  Star, 
  Clock,
  CheckCircle,
  ArrowRight,
  Download,
  Settings,
  Palette
} from 'lucide-react';

interface DealershipIntegrationProps {
  dealershipName?: string;
}

const DealershipIntegration: React.FC<DealershipIntegrationProps> = ({ 
  dealershipName = "Premium Auto Group" 
}) => {
  const [step, setStep] = useState(1);
  const [brandingOptions, setBrandingOptions] = useState({
    primaryColor: '#FF3B30',
    logoPlacement: 'co-branded',
    customMessage: 'Your first year of S.O.S Shield Pro is included with your new vehicle purchase.'
  });

  const integrationFeatures = [
    {
      icon: Car,
      title: 'In-Car Integration',
      description: 'CarPlay & Android Auto with voice commands',
      status: 'Available'
    },
    {
      icon: Shield,
      title: 'White-Label Service',
      description: 'Fully branded rescue assistance',
      status: 'Active'
    },
    {
      icon: Smartphone,
      title: 'Dealer App Module',
      description: 'Integrated into dealer mobile app',
      status: 'Available'
    },
    {
      icon: Users,
      title: 'Customer Dashboard',
      description: 'Manage all Citizen rescue services',
      status: 'Active'
    }
  ];

  const packageTiers = [
    {
      name: 'Basic Integration',
      price: '$2,500/month',
      features: [
        'White-label mobile app',
        'Basic co-branding',
        'Customer support portal',
        'Monthly reporting'
      ],
      popular: false
    },
    {
      name: 'Premium Partnership',
      price: '$7,500/month',
      features: [
        'Full in-car integration',
        'Custom branding & messaging',
        'Real-time dashboard',
        'Dedicated account manager',
        'Marketing co-op program'
      ],
      popular: true
    },
    {
      name: 'OEM Enterprise',
      price: 'Custom',
      features: [
        'Global deployment',
        'Multi-language support',
        'Custom API integration',
        'White-glove onboarding',
        'Executive support'
      ],
      popular: false
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Motion.GuardianEnter>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-pulse-green/20 flex items-center justify-center">
              <Car className="w-8 h-8 text-pulse-green" />
            </div>
            <Typography.Emergency className="text-2xl">×</Typography.Emergency>
            <div className="w-16 h-16 rounded-lg tech-surface border border-pulse-green/30 flex items-center justify-center">
              <Typography.Tech className="text-sm font-bold">DEALER</Typography.Tech>
            </div>
          </div>
        </Motion.GuardianEnter>
        
        <Typography.Headline>Dealership Integration</Typography.Headline>
        <Typography.Body className="text-muted-foreground max-w-2xl mx-auto">
          White-label S.O.S services for {dealershipName}. Bundle premium rescue assistance 
          with new vehicle sales and create a complete safety ecosystem for your Citizens.
        </Typography.Body>
      </div>

      {/* Integration Process */}
      <div className="max-w-4xl mx-auto">
        <Typography.Subheadline className="text-center mb-8">
          Integration Process
        </Typography.Subheadline>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Partnership Setup', icon: Shield, description: 'Configure branding and service tiers' },
            { step: 2, title: 'System Integration', icon: Settings, description: 'Connect with dealer management systems' },
            { step: 3, title: 'Staff Training', icon: Users, description: 'Train sales and service teams' },
            { step: 4, title: 'Customer Launch', icon: Star, description: 'Begin offering to customers' }
          ].map((item) => (
            <Motion.HoverScale key={item.step}>
              <Card className={`tech-surface p-6 text-center cursor-pointer ${
                step >= item.step ? 'border-pulse-green/50' : 'border-border/30'
              }`} onClick={() => setStep(item.step)}>
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  step >= item.step ? 'bg-pulse-green/20' : 'bg-muted/20'
                }`}>
                  <item.icon className={`w-6 h-6 ${
                    step >= item.step ? 'text-pulse-green' : 'text-muted-foreground'
                  }`} />
                </div>
                <Typography.Body className="font-medium mb-2">{item.title}</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  {item.description}
                </Typography.Small>
                {step >= item.step && (
                  <CheckCircle className="w-5 h-5 text-pulse-green mx-auto mt-3" />
                )}
              </Card>
            </Motion.HoverScale>
          ))}
        </div>
      </div>

      {/* Integration Features */}
      <div className="max-w-6xl mx-auto">
        <Typography.Subheadline className="text-center mb-8">
          Available Integrations
        </Typography.Subheadline>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {integrationFeatures.map((feature, index) => (
            <Motion.GuardianEnter key={index}>
              <Card className="tech-surface p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-beacon-blue/20 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-beacon-blue" />
                </div>
                <Typography.Body className="font-medium mb-2">{feature.title}</Typography.Body>
                <Typography.Small className="text-muted-foreground mb-4">
                  {feature.description}
                </Typography.Small>
                <Badge className={`${
                  feature.status === 'Active' 
                    ? 'bg-pulse-green/20 text-pulse-green border-pulse-green/30'
                    : 'bg-beacon-blue/20 text-beacon-blue border-beacon-blue/30'
                }`}>
                  {feature.status}
                </Badge>
              </Card>
            </Motion.GuardianEnter>
          ))}
        </div>
      </div>

      {/* Branding Customization */}
      <div className="max-w-4xl mx-auto">
        <Typography.Subheadline className="text-center mb-8">
          Brand Customization
        </Typography.Subheadline>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customization Controls */}
          <Card className="tech-surface p-6">
            <Typography.Body className="font-medium mb-6">Customize Your Integration</Typography.Body>
            
            <div className="space-y-6">
              <div>
                <Typography.Small className="mb-2">Primary Brand Color</Typography.Small>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-10 h-10 rounded-lg border border-border/50"
                    style={{ backgroundColor: brandingOptions.primaryColor }}
                  />
                  <Input 
                    value={brandingOptions.primaryColor}
                    onChange={(e) => setBrandingOptions(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Typography.Small className="mb-2">Logo Placement</Typography.Small>
                <div className="space-y-2">
                  {['co-branded', 'dealer-primary', 'sos-white-label'].map((option) => (
                    <label key={option} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="logoPlacement"
                        value={option}
                        checked={brandingOptions.logoPlacement === option}
                        onChange={(e) => setBrandingOptions(prev => ({ ...prev, logoPlacement: e.target.value }))}
                        className="text-pulse-green"
                      />
                      <Typography.Small className="capitalize">
                        {option.replace('-', ' ')}
                      </Typography.Small>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Typography.Small className="mb-2">Custom Welcome Message</Typography.Small>
                <textarea 
                  value={brandingOptions.customMessage}
                  onChange={(e) => setBrandingOptions(prev => ({ ...prev, customMessage: e.target.value }))}
                  className="w-full p-3 rounded-lg tech-surface border border-border/50 text-sm resize-none"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Preview */}
          <Card className="tech-surface p-6">
            <Typography.Body className="font-medium mb-6">App Preview</Typography.Body>
            
            <div className="bg-midnight-black rounded-xl p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: brandingOptions.primaryColor }}
                  >
                    R
                  </div>
                  {brandingOptions.logoPlacement === 'co-branded' && (
                    <>
                      <Typography.Small className="text-foreground">×</Typography.Small>
                      <Typography.Small className="text-foreground font-medium">
                        {dealershipName}
                      </Typography.Small>
                    </>
                  )}
                </div>
                <Clock className="w-5 h-5 text-muted-foreground" />
              </div>

              {/* Welcome Message */}
              <div className="p-4 rounded-lg bg-asphalt-gray/30">
                <Typography.Small className="text-foreground">
                  {brandingOptions.customMessage}
                </Typography.Small>
              </div>

              {/* CTA Button */}
              <Button 
                className="w-full text-white font-medium"
                style={{ backgroundColor: brandingOptions.primaryColor }}
              >
                Request S.O.S Assistance
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Package Tiers */}
      <div className="max-w-6xl mx-auto">
        <Typography.Subheadline className="text-center mb-8">
          Partnership Packages
        </Typography.Subheadline>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packageTiers.map((tier, index) => (
            <Motion.HoverScale key={index}>
              <Card className={`tech-surface p-6 relative ${
                tier.popular ? 'border-pulse-green/50' : 'border-border/30'
              }`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pulse-green text-midnight-black">
                    Most Popular
                  </Badge>
                )}
                
                <div className="text-center mb-6">
                  <Typography.Subheadline className="mb-2">{tier.name}</Typography.Subheadline>
                  <Typography.Headline className={tier.popular ? 'text-pulse-green' : 'text-foreground'}>
                    {tier.price}
                  </Typography.Headline>
                </div>

                <div className="space-y-3 mb-6">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-pulse-green flex-shrink-0" />
                      <Typography.Small>{feature}</Typography.Small>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${
                    tier.popular 
                      ? 'bg-pulse-green hover:bg-pulse-green/80 text-midnight-black' 
                      : 'bg-transparent border border-pulse-green/30 text-pulse-green hover:bg-pulse-green/10'
                  }`}
                >
                  {tier.name === 'OEM Enterprise' ? 'Contact Sales' : 'Get Started'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </Motion.HoverScale>
          ))}
        </div>
      </div>

      {/* Success Story */}
      <Motion.SlideInUp>
        <Card className="tech-surface p-8 max-w-4xl mx-auto text-center border-pulse-green/30">
          <div className="space-y-4">
            <div className="flex justify-center space-x-1 mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <Typography.Body className="text-lg italic">
              "Integrating S.O.S into our new car packages increased Citizen satisfaction by 34% 
              and created a new revenue stream. Our Citizens love the peace of mind."
            </Typography.Body>
            
            <div className="space-y-1">
              <Typography.Small className="font-medium">Sarah Chen</Typography.Small>
              <Typography.Caption>General Manager, Metropolitan BMW</Typography.Caption>
            </div>
          </div>
        </Card>
      </Motion.SlideInUp>
    </div>
  );
};

export default DealershipIntegration;