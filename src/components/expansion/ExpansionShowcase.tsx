import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FleetDashboard from './FleetDashboard';
import DealershipIntegration from './DealershipIntegration';
import InsurancePartnership from './InsurancePartnership';
import CorporateAccounts from './CorporateAccounts';
import { 
  Building, 
  Car, 
  Shield, 
  Globe,
  TrendingUp,
  Users,
  Zap,
  Star
} from 'lucide-react';

const ExpansionShowcase = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const expansionMetrics = [
    { label: 'Global Partners', value: '2,847', icon: Globe, color: 'text-pulse-green' },
    { label: 'Fleet Vehicles', value: '156K', icon: Car, color: 'text-beacon-blue' },
    { label: 'Corporate Employees', value: '890K', icon: Users, color: 'text-emergency-red' },
    { label: 'Monthly B2B Revenue', value: '$12.4M', icon: TrendingUp, color: 'text-metallic-silver' }
  ];

  const cinematicStories = [
    {
      id: 'fleet',
      title: 'Fleet Command',
      subtitle: 'Every vehicle. Always protected.',
      description: 'Real-time tracking of 100+ fleet vehicles with glowing beacons on a cinematic command center interface.',
      visual: '🗺️',
      component: FleetDashboard
    },
    {
      id: 'dealership',
      title: 'Dealership Bundle',
      subtitle: 'Your first year of Roadside Premium is included.',
      description: 'Seamless integration where new car purchases include Premium Roadside with dealer co-branding.',
      visual: '🚗',
      component: DealershipIntegration
    },
    {
      id: 'insurance',
      title: 'Insurance Coverage',
      subtitle: 'Covered by your insurer. $0 charged.',
      description: 'Auto-applied insurance coverage with shield lock animations and digital insurance cards.',
      visual: '🛡️',
      component: InsurancePartnership
    },
    {
      id: 'corporate',
      title: 'Global Enterprise',
      subtitle: '24/7 protection across 67 countries.',
      description: 'Enterprise-grade roadside assistance for corporations, government agencies, and municipalities.',
      visual: '🌍',
      component: CorporateAccounts
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Motion.GuardianEnter className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-pulse-green/20 flex items-center justify-center">
              <Typography.Tech className="text-2xl font-black">R</Typography.Tech>
            </div>
            <Typography.Emergency className="text-4xl">×</Typography.Emergency>
            <div className="w-20 h-20 rounded-xl tech-surface border border-pulse-green/30 flex items-center justify-center">
              <Building className="w-10 h-10 text-pulse-green" />
            </div>
          </div>
          
          <Typography.Hero className="text-4xl md:text-6xl">
            Roadside Infrastructure
          </Typography.Hero>
          <Typography.Subheadline className="text-muted-foreground max-w-3xl mx-auto">
            From emergency app to trillion-dollar mobility backbone — trusted by fleets, dealers, insurers, and governments worldwide
          </Typography.Subheadline>
        </Motion.GuardianEnter>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {expansionMetrics.map((metric, index) => (
            <Motion.GuardianEnter key={index} className="delay-200">
              <Card className="tech-surface p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-asphalt-gray/50 flex items-center justify-center">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <Typography.Headline className={`text-2xl mb-2 ${metric.color}`}>
                  {metric.value}
                </Typography.Headline>
                <Typography.Caption>{metric.label}</Typography.Caption>
              </Card>
            </Motion.GuardianEnter>
          ))}
        </div>

        {/* Cinematic Stories */}
        <div className="space-y-8">
          <Typography.Subheadline className="text-center">
            Expansion Story Moments
          </Typography.Subheadline>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cinematicStories.map((story, index) => (
              <Motion.HoverScale key={story.id}>
                <Card 
                  className="tech-surface p-6 cursor-pointer hover:border-pulse-green/50 transition-all duration-300"
                  onClick={() => setActiveDemo(story.id)}
                >
                  <div className="text-center space-y-4">
                    <div className="text-4xl mb-4">{story.visual}</div>
                    <Typography.Subheadline className="text-pulse-green">
                      {story.title}
                    </Typography.Subheadline>
                    <Typography.Small className="text-beacon-blue italic">
                      "{story.subtitle}"
                    </Typography.Small>
                    <Typography.Caption className="text-muted-foreground">
                      {story.description}
                    </Typography.Caption>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-pulse-green/30 text-pulse-green hover:bg-pulse-green/10"
                    >
                      View Demo
                    </Button>
                  </div>
                </Card>
              </Motion.HoverScale>
            ))}
          </div>
        </div>

        {/* Main Demo Area */}
        {!activeDemo ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="tech-surface p-8">
                <Typography.Subheadline className="mb-6 text-center">
                  Platform Overview
                </Typography.Subheadline>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-emergency-red/20 flex items-center justify-center">
                      <Car className="w-8 h-8 text-emergency-red" />
                    </div>
                    <Typography.Body className="font-medium">Fleet Services</Typography.Body>
                    <Typography.Small className="text-muted-foreground">
                      Real-time tracking and bulk pricing for rideshare, delivery, and trucking fleets
                    </Typography.Small>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-beacon-blue/20 flex items-center justify-center">
                      <Building className="w-8 h-8 text-beacon-blue" />
                    </div>
                    <Typography.Body className="font-medium">Dealership Integration</Typography.Body>
                    <Typography.Small className="text-muted-foreground">
                      White-label roadside services bundled with new vehicle sales and warranties
                    </Typography.Small>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-pulse-green/20 flex items-center justify-center">
                      <Shield className="w-8 h-8 text-pulse-green" />
                    </div>
                    <Typography.Body className="font-medium">Insurance Partnerships</Typography.Body>
                    <Typography.Small className="text-muted-foreground">
                      Automated claims processing and coverage verification for major insurers
                    </Typography.Small>
                  </div>

                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-lg bg-metallic-silver/20 flex items-center justify-center">
                      <Globe className="w-8 h-8 text-metallic-silver" />
                    </div>
                    <Typography.Body className="font-medium">Enterprise Accounts</Typography.Body>
                    <Typography.Small className="text-muted-foreground">
                      Global coverage for corporations, municipalities, and government agencies
                    </Typography.Small>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="integration" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="tech-surface p-6">
                  <Typography.Subheadline className="mb-4">Technical Integration</Typography.Subheadline>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-pulse-green" />
                      <Typography.Small>RESTful API with 99.9% uptime</Typography.Small>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-pulse-green" />
                      <Typography.Small>Real-time webhooks for status updates</Typography.Small>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-pulse-green" />
                      <Typography.Small>White-label mobile SDKs</Typography.Small>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-pulse-green" />
                      <Typography.Small>CarPlay & Android Auto support</Typography.Small>
                    </div>
                  </div>
                </Card>

                <Card className="tech-surface p-6">
                  <Typography.Subheadline className="mb-4">Business Integration</Typography.Subheadline>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-beacon-blue" />
                      <Typography.Small>Flexible billing and revenue sharing</Typography.Small>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-beacon-blue" />
                      <Typography.Small>Co-branded marketing materials</Typography.Small>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-beacon-blue" />
                      <Typography.Small>Dedicated account management</Typography.Small>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-beacon-blue" />
                      <Typography.Small>Custom SLA agreements</Typography.Small>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-6">
              <Card className="tech-surface p-8">
                <Typography.Subheadline className="mb-6 text-center">
                  Business Impact
                </Typography.Subheadline>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center space-y-4">
                    <Typography.Headline className="text-4xl text-pulse-green">-47%</Typography.Headline>
                    <Typography.Body className="font-medium">Cost Reduction</Typography.Body>
                    <Typography.Small className="text-muted-foreground">
                      Average operational cost savings versus traditional roadside providers
                    </Typography.Small>
                  </div>

                  <div className="text-center space-y-4">
                    <Typography.Headline className="text-4xl text-beacon-blue">+34%</Typography.Headline>
                    <Typography.Body className="font-medium">Customer Satisfaction</Typography.Body>
                    <Typography.Small className="text-muted-foreground">
                      Increase in customer satisfaction scores for partner organizations
                    </Typography.Small>
                  </div>

                  <div className="text-center space-y-4">
                    <Typography.Headline className="text-4xl text-emergency-red">6.2min</Typography.Headline>
                    <Typography.Body className="font-medium">Response Time</Typography.Body>
                    <Typography.Small className="text-muted-foreground">
                      Average emergency response time across all enterprise accounts
                    </Typography.Small>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-6">
              <Card className="tech-surface p-8">
                <Typography.Subheadline className="mb-6 text-center">
                  Expansion Roadmap
                </Typography.Subheadline>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-pulse-green flex items-center justify-center">
                        <Typography.Tech className="text-pulse-green font-bold">Q1</Typography.Tech>
                      </div>
                      <Typography.Body className="font-medium">OEM Partnerships</Typography.Body>
                      <Typography.Small className="text-muted-foreground">
                        Major auto manufacturer integrations
                      </Typography.Small>
                    </div>

                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-beacon-blue flex items-center justify-center">
                        <Typography.Tech className="text-beacon-blue font-bold">Q2</Typography.Tech>
                      </div>
                      <Typography.Body className="font-medium">Global Expansion</Typography.Body>
                      <Typography.Small className="text-muted-foreground">
                        European and Asian market entry
                      </Typography.Small>
                    </div>

                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emergency-red flex items-center justify-center">
                        <Typography.Tech className="text-emergency-red font-bold">Q3</Typography.Tech>
                      </div>
                      <Typography.Body className="font-medium">AI Integration</Typography.Body>
                      <Typography.Small className="text-muted-foreground">
                        Predictive maintenance and routing
                      </Typography.Small>
                    </div>

                    <div className="text-center space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-metallic-silver flex items-center justify-center">
                        <Typography.Tech className="text-metallic-silver font-bold">Q4</Typography.Tech>
                      </div>
                      <Typography.Body className="font-medium">EV Infrastructure</Typography.Body>
                      <Typography.Small className="text-muted-foreground">
                        Electric vehicle charging network
                      </Typography.Small>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Typography.Subheadline>
                {cinematicStories.find(s => s.id === activeDemo)?.title} Demo
              </Typography.Subheadline>
              <Button 
                variant="outline"
                onClick={() => setActiveDemo(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Back to Overview
              </Button>
            </div>
            
            {activeDemo === 'fleet' && <FleetDashboard />}
            {activeDemo === 'dealership' && <DealershipIntegration />}
            {activeDemo === 'insurance' && <InsurancePartnership />}
            {activeDemo === 'corporate' && <CorporateAccounts />}
          </div>
        )}

        {/* Footer CTA */}
        <Motion.SlideInUp>
          <Card className="tech-surface p-8 text-center border-pulse-green/30">
            <Typography.Subheadline className="mb-4">
              Ready to Scale with Roadside?
            </Typography.Subheadline>
            <Typography.Body className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join the infrastructure that powers mobility safety worldwide. From emergency app to enterprise backbone — 
              Roadside is the platform that scales with your business.
            </Typography.Body>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-pulse-green hover:bg-pulse-green/80 text-midnight-black">
                Schedule Enterprise Demo
              </Button>
              <Button variant="outline" className="border-pulse-green/30 text-pulse-green hover:bg-pulse-green/10">
                Contact Sales Team
              </Button>
            </div>
          </Card>
        </Motion.SlideInUp>
      </div>
    </div>
  );
};

export default ExpansionShowcase;