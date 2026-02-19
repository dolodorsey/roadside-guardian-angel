import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InvestorPitch from './InvestorPitch';
import { 
  Presentation, 
  TrendingUp, 
  Users, 
  Building,
  Shield,
  Car,
  Globe,
  Play,
  Download,
  Share2
} from 'lucide-react';

const InvestorShowcase = () => {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [selectedPitchMode, setSelectedPitchMode] = useState<'investor' | 'fleet' | 'insurance' | 'dealership' | 'government'>('investor');

  const pitchModes = [
    {
      id: 'investor',
      title: 'Investor Pitch',
      subtitle: 'Series A Fundraising',
      description: 'Complete investor deck positioning S.O.S as the Tesla/Uber of rescue assistance',
      icon: TrendingUp,
      color: 'text-pulse-green',
      focus: '$11B rescue assistance market with $1.5T expansion opportunity'
    },
    {
      id: 'fleet',
      title: 'Fleet Partners',
      subtitle: 'B2B Enterprise',
      description: 'Commercial fleet partnership deck emphasizing cost savings and operational efficiency',
      icon: Car,
      color: 'text-beacon-blue',
      focus: '$45B commercial fleet management market'
    },
    {
      id: 'insurance',
      title: 'Insurance Partners',
      subtitle: 'Claims Integration',
      description: 'Insurance partnership deck focused on claims automation and Citizen satisfaction',
      icon: Shield,
      color: 'text-emergency-red',
      focus: '$287B auto insurance market integration'
    },
    {
      id: 'dealership',
      title: 'Dealership Partners',
      subtitle: 'White-Label Solutions',
      description: 'Dealership partnership deck for bundled rescue services with new vehicle sales',
      icon: Building,
      color: 'text-metallic-silver',
      focus: '$1.2T automotive sales & service market'
    },
    {
      id: 'government',
      title: 'Government Accounts',
      subtitle: 'Municipal Contracts',
      description: 'Government partnership deck for municipal fleet and emergency response integration',
      icon: Globe,
      color: 'text-beacon-blue',
      focus: '$156B public safety & infrastructure market'
    }
  ];

  const liveMetrics = [
    { label: 'Total Members', value: '89,743', growth: '+34%', icon: Users },
    { label: 'Monthly Revenue', value: '$1.24M', growth: '+67%', icon: TrendingUp },
    { label: 'Jobs Completed', value: '234,567', growth: '+45%', icon: Car },
    { label: 'Partner Network', value: '2,847', growth: '+128%', icon: Building }
  ];

  if (activeMode) {
    return (
      <div className="min-h-screen">
        <InvestorPitch 
          mode={selectedPitchMode}
          autoPlay={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Motion.GuardianEnter className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-pulse-green/20 flex items-center justify-center">
              <Presentation className="w-10 h-10 text-pulse-green" />
            </div>
          </div>
          
          <Typography.Hero className="text-4xl md:text-6xl">
            Investor & Partner Pitch
          </Typography.Hero>
          <Typography.Subheadline className="text-muted-foreground max-w-3xl mx-auto">
            Fortune-500-ready presentation system — cinematic, undeniable, and inevitable. 
            Position S.O.S as the Tesla/Uber of rescue assistance.
          </Typography.Subheadline>
        </Motion.GuardianEnter>

        {/* Live Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {liveMetrics.map((metric, index) => (
            <Motion.GuardianEnter key={index} className="delay-200">
              <Card className="tech-surface p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-pulse-green/20 flex items-center justify-center">
                  <metric.icon className="w-6 h-6 text-pulse-green" />
                </div>
                <Typography.Headline className="text-2xl mb-2 text-pulse-green">
                  {metric.value}
                </Typography.Headline>
                <Typography.Caption className="mb-1">{metric.label}</Typography.Caption>
                <Typography.Small className="text-pulse-green">{metric.growth}</Typography.Small>
              </Card>
            </Motion.GuardianEnter>
          ))}
        </div>

        {/* Pitch Mode Selection */}
        <div className="space-y-8">
          <Typography.Subheadline className="text-center">
            Select Pitch Mode
          </Typography.Subheadline>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pitchModes.map((mode, index) => (
              <Motion.HoverScale key={mode.id}>
                <Card 
                  className={`tech-surface p-6 cursor-pointer transition-all duration-300 ${
                    selectedPitchMode === mode.id ? 'border-pulse-green/50' : 'border-border/30 hover:border-pulse-green/30'
                  }`}
                  onClick={() => setSelectedPitchMode(mode.id as any)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg bg-asphalt-gray/50 flex items-center justify-center`}>
                        <mode.icon className={`w-6 h-6 ${mode.color}`} />
                      </div>
                      <div>
                        <Typography.Subheadline className={mode.color}>
                          {mode.title}
                        </Typography.Subheadline>
                        <Typography.Small className="text-muted-foreground">
                          {mode.subtitle}
                        </Typography.Small>
                      </div>
                    </div>
                    
                    <Typography.Caption className="text-muted-foreground">
                      {mode.description}
                    </Typography.Caption>
                    
                    <div className="p-3 rounded-lg bg-asphalt-gray/30">
                      <Typography.Small className={`font-medium ${mode.color}`}>
                        Market Focus: {mode.focus}
                      </Typography.Small>
                    </div>
                  </div>
                </Card>
              </Motion.HoverScale>
            ))}
          </div>
        </div>

        {/* Presentation Preview */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="narrative">Narrative</TabsTrigger>
            <TabsTrigger value="data">Live Data</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="tech-surface p-8">
              <Typography.Subheadline className="mb-6 text-center">
                Pitch Narrative Structure
              </Typography.Subheadline>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { step: 1, title: 'Vision', subtitle: 'Help at the Speed of Now', color: 'text-emergency-red' },
                  { step: 2, title: 'Problem', subtitle: 'Outdated Infrastructure', color: 'text-emergency-red' },
                  { step: 3, title: 'Solution', subtitle: 'Tesla-Grade UX', color: 'text-pulse-green' },
                  { step: 4, title: 'Market', subtitle: '$1.5T+ Opportunity', color: 'text-beacon-blue' },
                  { step: 5, title: 'Ask', subtitle: 'Series A Partnership', color: 'text-pulse-green' }
                ].map((slide, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className={`w-12 h-12 mx-auto rounded-full bg-asphalt-gray/50 flex items-center justify-center border border-border/50`}>
                      <Typography.Tech className={`font-bold ${slide.color}`}>{slide.step}</Typography.Tech>
                    </div>
                    <Typography.Body className="font-medium">{slide.title}</Typography.Body>
                    <Typography.Small className="text-muted-foreground">{slide.subtitle}</Typography.Small>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="narrative" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4 text-pulse-green">Opening Hook</Typography.Subheadline>
                <div className="space-y-3">
                   <Typography.Body className="italic">
                     "AAA is 120 years old. S.O.S is the future."
                  </Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    Cinematic hazard triangle morphs into glowing S.O.S "R" with bold positioning statement.
                  </Typography.Small>
                </div>
              </Card>

              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4 text-emergency-red">Problem Framing</Typography.Subheadline>
                <div className="space-y-3">
                  <Typography.Body className="italic">
                    "Drivers today live in real time. Their safety should too."
                  </Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    Contrast outdated call-center systems with modern real-time expectations.
                  </Typography.Small>
                </div>
              </Card>

              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4 text-beacon-blue">Market Positioning</Typography.Subheadline>
                <div className="space-y-3">
                  <Typography.Body className="italic">
                    "The Tesla/Uber of rescue assistance"
                  </Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    Position as category disruptor with tech-first approach and premium experience.
                  </Typography.Small>
                </div>
              </Card>

              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4 text-pulse-green">Closing Vision</Typography.Subheadline>
                <div className="space-y-3">
                  <Typography.Body className="italic">
                    "S.O.S will replace AAA. Be part of the inevitable."
                  </Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    Strong call-to-action with inevitability positioning and FOMO creation.
                  </Typography.Small>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card className="tech-surface p-8">
              <Typography.Subheadline className="mb-6 text-center">
                Auto-Generated Live Data Integration
              </Typography.Subheadline>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <Typography.Body className="font-medium text-pulse-green">Customer Metrics</Typography.Body>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography.Small>Total Members</Typography.Small>
                      <Typography.Small className="font-medium">89,743</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Monthly Growth</Typography.Small>
                      <Typography.Small className="font-medium text-pulse-green">+34%</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Customer Rating</Typography.Small>
                      <Typography.Small className="font-medium">4.9/5.0</Typography.Small>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Typography.Body className="font-medium text-beacon-blue">Operational Data</Typography.Body>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography.Small>Jobs Completed</Typography.Small>
                      <Typography.Small className="font-medium">234,567</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Avg Response Time</Typography.Small>
                      <Typography.Small className="font-medium text-pulse-green">6.2 min</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Provider Network</Typography.Small>
                      <Typography.Small className="font-medium">2,847</Typography.Small>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Typography.Body className="font-medium text-emergency-red">Revenue Metrics</Typography.Body>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography.Small>Monthly Revenue</Typography.Small>
                      <Typography.Small className="font-medium">$1.24M</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Revenue Growth</Typography.Small>
                      <Typography.Small className="font-medium text-pulse-green">+67%</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Customer LTV</Typography.Small>
                      <Typography.Small className="font-medium">$847</Typography.Small>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4">Executive Summary</Typography.Subheadline>
                <Typography.Small className="text-muted-foreground mb-4">
                  2-page overview for initial investor outreach
                </Typography.Small>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
              </Card>

              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4">Full Pitch Deck</Typography.Subheadline>
                <Typography.Small className="text-muted-foreground mb-4">
                  Complete investor presentation with live data
                </Typography.Small>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Export Slides
                </Button>
              </Card>

              <Card className="tech-surface p-6">
                <Typography.Subheadline className="mb-4">Demo Script</Typography.Subheadline>
                <Typography.Small className="text-muted-foreground mb-4">
                  Talking points and timing for live presentations
                </Typography.Small>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Script
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Launch Presentation */}
        <Motion.SlideInUp>
          <Card className="tech-surface p-8 text-center border-pulse-green/30">
            <Typography.Subheadline className="mb-4">
              Ready to Present?
            </Typography.Subheadline>
            <Typography.Body className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Launch the cinematic investor presentation in full-screen mode. 
              Auto-play enabled with live data integration and partner-specific customization.
            </Typography.Body>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setActiveMode(selectedPitchMode)}
                className="bg-pulse-green hover:bg-pulse-green/80 text-midnight-black"
              >
                <Play className="w-4 h-4 mr-2" />
                Launch {pitchModes.find(m => m.id === selectedPitchMode)?.title}
              </Button>
              <Button variant="outline" className="border-pulse-green/30 text-pulse-green hover:bg-pulse-green/10">
                Preview Mode
              </Button>
            </div>
          </Card>
        </Motion.SlideInUp>
      </div>
    </div>
  );
};

export default InvestorShowcase;