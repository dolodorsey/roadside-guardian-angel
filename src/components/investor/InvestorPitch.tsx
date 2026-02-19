import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause,
  RotateCcw,
  Maximize,
  Users,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Star,
  DollarSign,
  Target,
  Rocket,
  Crown
} from 'lucide-react';

interface PitchSlide {
  id: number;
  title: string;
  type: 'opening' | 'problem' | 'solution' | 'features' | 'market' | 'business' | 'expansion' | 'culture' | 'team' | 'ask';
  content: React.ReactNode;
  duration?: number;
}

interface InvestorPitchProps {
  mode?: 'investor' | 'fleet' | 'insurance' | 'dealership' | 'government';
  autoPlay?: boolean;
}

const InvestorPitch: React.FC<InvestorPitchProps> = ({ 
  mode = 'investor',
  autoPlay = false 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mock live data that would be pulled from real metrics
  const liveData = {
    totalMembers: 89743,
    monthlyGrowth: 34,
    totalJobs: 234567,
    avgResponseTime: 6.2,
    customerSatisfaction: 4.9,
    totalSavings: 2400000,
    marketSize: 11000000000,
    monthlyRevenue: 1240000,
    fleetPartners: 247,
    insurancePartners: 12
  };

  // Customize content based on mode
  const getMarketFocus = () => {
    switch (mode) {
      case 'fleet':
        return { size: '$45B', segment: 'Commercial Fleet Management' };
      case 'insurance':
        return { size: '$287B', segment: 'Auto Insurance Market' };
      case 'dealership':
        return { size: '$1.2T', segment: 'Automotive Sales & Service' };
      case 'government':
        return { size: '$156B', segment: 'Public Safety & Infrastructure' };
      default:
        return { size: '$11B', segment: 'Roadside Assistance Market' };
    }
  };

  const marketFocus = getMarketFocus();

  const slides: PitchSlide[] = [
    // Slide 1: Opening Vision
    {
      id: 1,
      title: 'Opening Vision',
      type: 'opening',
      duration: 5000,
      content: (
        <div className="h-full flex items-center justify-center relative overflow-hidden">
          {/* Background Animation */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-pulse opacity-30 animate-pulse" />
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, hsl(var(--emergency-red)) 1px, transparent 1px),
                linear-gradient(hsl(var(--emergency-red)) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px',
              opacity: 0.1
            }} />
          </div>

          <div className="relative z-10 text-center space-y-8">
            {/* Morphing Hazard Triangle to R */}
            <Motion.SOSRipple className="mx-auto">
              <div className="w-32 h-32 relative">
                <Motion.HazardPulse>
                  <div className="w-32 h-32 rounded-full bg-emergency-red/20 flex items-center justify-center border-4 border-emergency-red/50">
                    <Typography.Hero className="text-6xl font-black text-emergency-red">
                      R
                    </Typography.Hero>
                  </div>
                </Motion.HazardPulse>
              </div>
            </Motion.SOSRipple>

            <Motion.SlideInUp>
              <Typography.Emergency className="text-4xl mb-4">
                HELP AT THE SPEED OF NOW
              </Typography.Emergency>
              
              <Typography.Hero className="text-6xl md:text-8xl mb-8">
                ROADSIDE
              </Typography.Hero>
              
              <Typography.Headline className="text-3xl text-muted-foreground max-w-4xl mx-auto">
                AAA is 120 years old. S.O.S is the future.
              </Typography.Headline>
            </Motion.SlideInUp>
          </div>
        </div>
      )
    },

    // Slide 2: The Problem
    {
      id: 2,
      title: 'The Problem',
      type: 'problem',
      duration: 8000,
      content: (
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Typography.Hero className="text-5xl text-emergency-red">
                The Problem
              </Typography.Hero>
              
              <div className="space-y-6">
                <Motion.GuardianEnter>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-emergency-red/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-emergency-red font-bold">1</span>
                    </div>
                    <div>
                      <Typography.Subheadline className="text-emergency-red mb-2">
                        Outdated Systems
                      </Typography.Subheadline>
                      <Typography.Body className="text-muted-foreground">
                        Call-center based dispatch from the 1990s. No real-time tracking, no transparency.
                      </Typography.Body>
                    </div>
                  </div>
                </Motion.GuardianEnter>

                <Motion.GuardianEnter>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-emergency-red/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-emergency-red font-bold">2</span>
                    </div>
                    <div>
                      <Typography.Subheadline className="text-emergency-red mb-2">
                        Long Wait Times
                      </Typography.Subheadline>
                      <Typography.Body className="text-muted-foreground">
                        Average 45-90 minute response times. Drivers stranded without information.
                      </Typography.Body>
                    </div>
                  </div>
                </Motion.GuardianEnter>

                <Motion.GuardianEnter>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-emergency-red/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-emergency-red font-bold">3</span>
                    </div>
                    <div>
                      <Typography.Subheadline className="text-emergency-red mb-2">
                        No Cultural Relevance
                      </Typography.Subheadline>
                      <Typography.Body className="text-muted-foreground">
                        Legacy brands feel institutional, not personal. No social sharing, no status.
                      </Typography.Body>
                    </div>
                  </div>
                </Motion.GuardianEnter>
              </div>

              <Typography.Headline className="text-2xl text-foreground italic">
                "Drivers today live in real time. Their safety should too."
              </Typography.Headline>
            </div>

            {/* Visual Representation */}
            <div className="relative">
              <Card className="tech-surface p-8 opacity-50">
                <Typography.Body className="text-center mb-6 text-muted-foreground">
                  Traditional Roadside Experience
                </Typography.Body>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emergency-red/30 flex items-center justify-center">
                      <span className="text-sm">1</span>
                    </div>
                    <Typography.Small>Call 1-800 number</Typography.Small>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emergency-red/30 flex items-center justify-center">
                      <span className="text-sm">2</span>
                    </div>
                    <Typography.Small>Wait on hold 15+ minutes</Typography.Small>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emergency-red/30 flex items-center justify-center">
                      <span className="text-sm">3</span>
                    </div>
                    <Typography.Small>Give location details manually</Typography.Small>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emergency-red/30 flex items-center justify-center">
                      <span className="text-sm">4</span>
                    </div>
                    <Typography.Small>Wait 45-90 minutes</Typography.Small>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-emergency-red/30 flex items-center justify-center">
                      <span className="text-sm">5</span>
                    </div>
                    <Typography.Small>No tracking, no updates</Typography.Small>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 3: The Solution
    {
      id: 3,
      title: 'The Solution',
      type: 'solution',
      duration: 10000,
      content: (
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto text-center space-y-12">
             <Typography.Hero className="text-5xl text-pulse-green">
               The S.O.S Solution
            </Typography.Hero>
            
            <Typography.Headline className="text-2xl text-muted-foreground max-w-4xl mx-auto">
              Uber-style dispatch meets Tesla-grade UX. Real-time tracking, verified Heroes, instant peace of mind.
            </Typography.Headline>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Motion.ProviderLock>
                <Card className="tech-surface p-6 border-pulse-green/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pulse-green/20 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-pulse-green" />
                  </div>
                  <Typography.Subheadline className="mb-3 text-pulse-green">
                    Instant Dispatch
                  </Typography.Subheadline>
                   <Typography.Body className="text-muted-foreground">
                     One-tap request with GPS auto-location. Verified Hero matched in under 30 seconds.
                  </Typography.Body>
                </Card>
              </Motion.ProviderLock>

              <Motion.ProviderLock>
                <Card className="tech-surface p-6 border-beacon-blue/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-beacon-blue/20 flex items-center justify-center">
                    <Globe className="w-8 h-8 text-beacon-blue" />
                  </div>
                  <Typography.Subheadline className="mb-3 text-beacon-blue">
                    Real-Time Tracking
                  </Typography.Subheadline>
                  <Typography.Body className="text-muted-foreground">
                    Live GPS tracking with ETA updates. Full transparency from dispatch to completion.
                  </Typography.Body>
                </Card>
              </Motion.ProviderLock>

              <Motion.ProviderLock>
                <Card className="tech-surface p-6 border-metallic-silver/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-metallic-silver/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-metallic-silver" />
                  </div>
                  <Typography.Subheadline className="mb-3 text-metallic-silver">
                    Premium Trust
                  </Typography.Subheadline>
                   <Typography.Body className="text-muted-foreground">
                     Verified Heroes, insurance coverage, and safety protocols that Citizens actually want to share.
                  </Typography.Body>
                </Card>
              </Motion.ProviderLock>
            </div>

            {/* Live Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/30">
              <div className="text-center">
                <Typography.Headline className="text-3xl text-pulse-green">
                  {liveData.avgResponseTime}min
                </Typography.Headline>
                <Typography.Small>Avg Response Time</Typography.Small>
              </div>
              <div className="text-center">
                <Typography.Headline className="text-3xl text-beacon-blue">
                  {liveData.customerSatisfaction}/5
                </Typography.Headline>
                <Typography.Small>Customer Rating</Typography.Small>
              </div>
              <div className="text-center">
                <Typography.Headline className="text-3xl text-metallic-silver">
                  {liveData.totalJobs.toLocaleString()}
                </Typography.Headline>
                 <Typography.Small>Missions Completed</Typography.Small>
               </div>
              <div className="text-center">
                <Typography.Headline className="text-3xl text-emergency-red">
                  {liveData.monthlyGrowth}%
                </Typography.Headline>
                <Typography.Small>Monthly Growth</Typography.Small>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // Slide 4: Market Opportunity
    {
      id: 4,
      title: 'Market Opportunity',
      type: 'market',
      duration: 8000,
      content: (
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Typography.Hero className="text-5xl text-beacon-blue">
                Market Opportunity
              </Typography.Hero>
              
              <div className="space-y-6">
                <div>
                  <Typography.Subheadline className="text-beacon-blue mb-2">
                    {marketFocus.segment}
                  </Typography.Subheadline>
                  <Typography.Headline className="text-4xl text-pulse-green">
                    {marketFocus.size}
                  </Typography.Headline>
                  <Typography.Body className="text-muted-foreground">
                    Total Addressable Market
                  </Typography.Body>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="tech-surface p-4">
                    <Typography.Tech className="text-2xl text-emergency-red">60M</Typography.Tech>
                    <Typography.Caption>AAA Members</Typography.Caption>
                  </Card>
                  <Card className="tech-surface p-4">
                    <Typography.Tech className="text-2xl text-beacon-blue">280M</Typography.Tech>
                    <Typography.Caption>U.S. Drivers</Typography.Caption>
                  </Card>
                </div>

                <Typography.Body className="text-lg">
                 <strong className="text-pulse-green">S.O.S positioned as the tech-first category disruptor</strong> — 
                   the Tesla/Uber of rescue assistance with expansion into fleets, insurance, and government partnerships.
                </Typography.Body>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="tech-surface p-6 border-pulse-green/30">
                <Typography.Subheadline className="mb-4 text-center text-pulse-green">
                  Market Expansion Layers
                </Typography.Subheadline>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded bg-asphalt-gray/30">
                    <Typography.Small>Consumer (Phase 1)</Typography.Small>
                    <Typography.Tech className="text-pulse-green">$11B</Typography.Tech>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-asphalt-gray/30">
                    <Typography.Small>Fleet Partnerships</Typography.Small>
                    <Typography.Tech className="text-beacon-blue">+$45B</Typography.Tech>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-asphalt-gray/30">
                    <Typography.Small>Insurance Integration</Typography.Small>
                    <Typography.Tech className="text-emergency-red">+$287B</Typography.Tech>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded bg-asphalt-gray/30">
                    <Typography.Small>OEM White-Label</Typography.Small>
                    <Typography.Tech className="text-metallic-silver">+$1.2T</Typography.Tech>
                  </div>
                  <hr className="border-border/30" />
                  <div className="flex items-center justify-between p-3 rounded bg-pulse-green/10">
                    <Typography.Body className="font-bold">Total TAM</Typography.Body>
                    <Typography.Headline className="text-pulse-green">$1.5T+</Typography.Headline>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    // Slide 5: Business Model
    {
      id: 5,
      title: 'Business Model',
      type: 'business',
      duration: 8000,
      content: (
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <Typography.Hero className="text-5xl text-center text-pulse-green">
              Business Model
            </Typography.Hero>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Motion.HoverScale>
                <Card className="tech-surface p-6 text-center border-pulse-green/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pulse-green/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-pulse-green" />
                  </div>
                  <Typography.Subheadline className="mb-3 text-pulse-green">
                    Subscriptions
                  </Typography.Subheadline>
                  <Typography.Body className="mb-3">$7.99 - $14.99/month</Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    Recurring membership revenue with premium tiers
                  </Typography.Small>
                </Card>
              </Motion.HoverScale>

              <Motion.HoverScale>
                <Card className="tech-surface p-6 text-center border-beacon-blue/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-beacon-blue/20 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-beacon-blue" />
                  </div>
                  <Typography.Subheadline className="mb-3 text-beacon-blue">
                    On-Demand
                  </Typography.Subheadline>
                  <Typography.Body className="mb-3">$45 - $250/service</Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    Pay-per-use services with transparent pricing
                  </Typography.Small>
                </Card>
              </Motion.HoverScale>

              <Motion.HoverScale>
                <Card className="tech-surface p-6 text-center border-emergency-red/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emergency-red/20 flex items-center justify-center">
                    <Target className="w-8 h-8 text-emergency-red" />
                  </div>
                  <Typography.Subheadline className="mb-3 text-emergency-red">
                    B2B Partnerships
                  </Typography.Subheadline>
                  <Typography.Body className="mb-3">$25-$500/vehicle/month</Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    Fleet, insurance, and dealership integrations
                  </Typography.Small>
                </Card>
              </Motion.HoverScale>

              <Motion.HoverScale>
                <Card className="tech-surface p-6 text-center border-metallic-silver/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-metallic-silver/20 flex items-center justify-center">
                    <Crown className="w-8 h-8 text-metallic-silver" />
                  </div>
                  <Typography.Subheadline className="mb-3 text-metallic-silver">
                    White-Label
                  </Typography.Subheadline>
                  <Typography.Body className="mb-3">Revenue sharing 10-30%</Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    OEM and enterprise white-label solutions
                  </Typography.Small>
                </Card>
              </Motion.HoverScale>
            </div>

            {/* Revenue Projection */}
            <Card className="tech-surface p-8 border-pulse-green/30">
              <Typography.Subheadline className="text-center mb-6 text-pulse-green">
                Monthly Recurring Revenue
              </Typography.Subheadline>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-2">
                  <Typography.Headline className="text-3xl text-pulse-green">
                    ${(liveData.monthlyRevenue / 1000).toFixed(1)}K
                  </Typography.Headline>
                  <Typography.Body>Current MRR</Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    {liveData.totalMembers.toLocaleString()} active members
                  </Typography.Small>
                </div>
                
                <div className="text-center space-y-2">
                  <Typography.Headline className="text-3xl text-beacon-blue">
                    $12.5M
                  </Typography.Headline>
                  <Typography.Body>12-Month Target</Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    1M+ members projected
                  </Typography.Small>
                </div>
                
                <div className="text-center space-y-2">
                  <Typography.Headline className="text-3xl text-emergency-red">
                    $250M+
                  </Typography.Headline>
                  <Typography.Body>36-Month Vision</Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    B2B partnerships at scale
                  </Typography.Small>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },

    // Slide 6: Expansion Playbook
    {
      id: 6,
      title: 'Expansion Playbook',
      type: 'expansion',
      duration: 10000,
      content: (
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-6xl mx-auto space-y-12">
            <Typography.Hero className="text-5xl text-center text-emergency-red">
              Expansion Playbook
            </Typography.Hero>
            
            <Typography.Headline className="text-2xl text-center text-muted-foreground">
              "S.O.S becomes the global standard for rescue safety"
            </Typography.Headline>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Motion.GuardianEnter>
                <Card className="tech-surface p-6 text-center border-pulse-green/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pulse-green/20 flex items-center justify-center">
                    <Typography.Tech className="text-pulse-green font-bold">1</Typography.Tech>
                  </div>
                  <Typography.Subheadline className="mb-3 text-pulse-green">
                    Consumer Launch
                  </Typography.Subheadline>
                  <Typography.Body className="mb-4">
                    Direct-to-consumer app with premium membership tiers
                  </Typography.Body>
                  <div className="space-y-2">
                    <Typography.Small>✓ iOS/Android apps</Typography.Small>
                    <Typography.Small>✓ Membership platform</Typography.Small>
                    <Typography.Small>✓ Hero network</Typography.Small>
                  </div>
                </Card>
              </Motion.GuardianEnter>

              <Motion.GuardianEnter>
                <Card className="tech-surface p-6 text-center border-beacon-blue/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-beacon-blue/20 flex items-center justify-center">
                    <Typography.Tech className="text-beacon-blue font-bold">2</Typography.Tech>
                  </div>
                  <Typography.Subheadline className="mb-3 text-beacon-blue">
                    Fleet Integration
                  </Typography.Subheadline>
                  <Typography.Body className="mb-4">
                    Rideshare, delivery, and commercial fleet partnerships
                  </Typography.Body>
                  <div className="space-y-2">
                    <Typography.Small>📊 Fleet dashboards</Typography.Small>
                    <Typography.Small>🚛 Bulk pricing tiers</Typography.Small>
                    <Typography.Small>📍 Real-time tracking</Typography.Small>
                  </div>
                </Card>
              </Motion.GuardianEnter>

              <Motion.GuardianEnter>
                <Card className="tech-surface p-6 text-center border-emergency-red/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emergency-red/20 flex items-center justify-center">
                    <Typography.Tech className="text-emergency-red font-bold">3</Typography.Tech>
                  </div>
                  <Typography.Subheadline className="mb-3 text-emergency-red">
                    OEM White-Label
                  </Typography.Subheadline>
                  <Typography.Body className="mb-4">
                    Dealership bundles and in-car system integration
                  </Typography.Body>
                  <div className="space-y-2">
                    <Typography.Small>🚗 CarPlay/Android Auto</Typography.Small>
                    <Typography.Small>🏢 Dealer partnerships</Typography.Small>
                    <Typography.Small>🎨 Co-branded experiences</Typography.Small>
                  </div>
                </Card>
              </Motion.GuardianEnter>

              <Motion.GuardianEnter>
                <Card className="tech-surface p-6 text-center border-metallic-silver/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-metallic-silver/20 flex items-center justify-center">
                    <Typography.Tech className="text-metallic-silver font-bold">4</Typography.Tech>
                  </div>
                  <Typography.Subheadline className="mb-3 text-metallic-silver">
                    Global Infrastructure
                  </Typography.Subheadline>
                  <Typography.Body className="mb-4">
                    Insurance partnerships and government adoption
                  </Typography.Body>
                  <div className="space-y-2">
                    <Typography.Small>🛡️ Insurance integration</Typography.Small>
                    <Typography.Small>🏛️ Municipal contracts</Typography.Small>
                    <Typography.Small>🌍 International expansion</Typography.Small>
                  </div>
                </Card>
              </Motion.GuardianEnter>
            </div>

            {/* Progress Indicators */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-pulse-green">Phase 1: Complete</span>
                <span className="text-beacon-blue">Phase 2: In Progress</span>
                <span className="text-muted-foreground">Phase 3: Planning</span>
                <span className="text-muted-foreground">Phase 4: Vision</span>
              </div>
              <Progress value={37.5} className="h-2" />
            </div>
          </div>
        </div>
      )
    },

    // Slide 7: The Ask
    {
      id: 7,
      title: 'The Ask',
      type: 'ask',
      duration: 8000,
      content: (
        <div className="h-full flex items-center justify-center p-8">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <Typography.Hero className="text-6xl text-pulse-green">
              The Ask
            </Typography.Hero>
            
            <Typography.Headline className="text-3xl text-muted-foreground">
              Join us in redefining road safety for the next 100 years
            </Typography.Headline>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Motion.CompletionGlow>
                <Card className="tech-surface p-8 border-pulse-green/50">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-pulse-green/20 flex items-center justify-center">
                    <DollarSign className="w-10 h-10 text-pulse-green" />
                  </div>
                  <Typography.Subheadline className="mb-4 text-pulse-green">
                    Funding
                  </Typography.Subheadline>
                  <Typography.Headline className="text-3xl mb-4">
                    $25M Series A
                  </Typography.Headline>
                  <Typography.Body className="text-muted-foreground">
                    For national rollout, fleet partnerships, and OEM integrations
                  </Typography.Body>
                </Card>
              </Motion.CompletionGlow>

              <Motion.CompletionGlow>
                <Card className="tech-surface p-8 border-beacon-blue/50">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-beacon-blue/20 flex items-center justify-center">
                    <Rocket className="w-10 h-10 text-beacon-blue" />
                  </div>
                  <Typography.Subheadline className="mb-4 text-beacon-blue">
                    Strategic Partners
                  </Typography.Subheadline>
                  <Typography.Headline className="text-3xl mb-4">
                    Industry Leaders
                  </Typography.Headline>
                  <Typography.Body className="text-muted-foreground">
                    Insurance, fleet, and automotive partnerships for rapid scale
                  </Typography.Body>
                </Card>
              </Motion.CompletionGlow>

              <Motion.CompletionGlow>
                <Card className="tech-surface p-8 border-emergency-red/50">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emergency-red/20 flex items-center justify-center">
                    <Globe className="w-10 h-10 text-emergency-red" />
                  </div>
                  <Typography.Subheadline className="mb-4 text-emergency-red">
                    Global Vision
                  </Typography.Subheadline>
                  <Typography.Headline className="text-3xl mb-4">
                    Category Leader
                  </Typography.Headline>
                  <Typography.Body className="text-muted-foreground">
                    Become the Tesla/Uber of rescue assistance worldwide
                  </Typography.Body>
                </Card>
              </Motion.CompletionGlow>
            </div>

            <Motion.SOSRipple>
              <Typography.Emergency className="text-4xl">
                S.O.S WILL REPLACE AAA
              </Typography.Emergency>
              <Typography.Headline className="text-2xl text-pulse-green mt-4">
                Be part of the inevitable future
              </Typography.Headline>
            </Motion.SOSRipple>
          </div>
        </div>
      )
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, slides[currentSlide].duration || 5000);

    return () => clearTimeout(timer);
  }, [currentSlide, isPlaying, slides]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const resetPresentation = () => {
    setCurrentSlide(0);
    setIsPlaying(false);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-midnight-black`}>
      {/* Slide Content */}
      <div className="h-screen flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          {slides[currentSlide].content}
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-border/30">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Typography.Small>
                {currentSlide + 1} / {slides.length}
              </Typography.Small>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress */}
            <div className="flex-1 mx-8">
              <Progress 
                value={((currentSlide + 1) / slides.length) * 100} 
                className="h-2"
              />
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetPresentation}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorPitch;