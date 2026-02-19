import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Zap, 
  Users, 
  Shield, 
  Globe,
  Smartphone,
  CreditCard,
  AlertTriangle,
  MessageCircle,
  Palette,
  Gift,
  Building,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Target,
  Rocket,
  Crown
} from 'lucide-react';

interface BlueprintChapter {
  id: string;
  title: string;
  subtitle: string;
  status: 'complete' | 'in-progress' | 'planned';
  priority: 'mvp' | 'phase-2' | 'phase-3' | 'phase-4';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  keyFeatures: string[];
  technicalSpecs: string[];
  businessImpact: string;
  dependencies?: string[];
}

const RoadsideMasterBlueprint = () => {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'technical' | 'business' | 'roadmap'>('overview');

  const blueprintChapters: BlueprintChapter[] = [
    {
      id: 'vision',
      title: 'Vision & Brand',
      subtitle: 'Tesla/Uber of Rescue Assistance',
      status: 'complete',
      priority: 'mvp',
      icon: Crown,
      description: 'Core brand positioning as premium, tech-first rescue assistance that Citizens want to share',
      keyFeatures: [
        'Cinematic design system',
        'Premium brand positioning',
        'Cultural relevance strategy',
        'Social-first experience design'
      ],
      technicalSpecs: [
        'HSL-based design tokens',
        'Component library with variants',
        'Motion system with keyframes',
        'Responsive typography scale'
      ],
      businessImpact: 'Differentiates from legacy providers, enables premium pricing, drives organic growth through sharing'
    },
    {
      id: 'onboarding',
      title: 'User Onboarding',
      subtitle: 'Seamless First Experience',
      status: 'complete',
      priority: 'mvp',
      icon: Users,
      description: 'Multi-step onboarding flow that builds trust and establishes value proposition immediately',
      keyFeatures: [
        'Welcome experience with safety focus',
        'Profile setup with vehicle details',
        'Trust indicators and safety overview',
        'Payment setup with membership options'
      ],
      technicalSpecs: [
        'Multi-step form validation',
        'Progress tracking component',
        'Vehicle data integration',
        'Payment processing setup'
      ],
      businessImpact: 'Reduces churn, increases conversion to paid membership, establishes trust early'
    },
    {
      id: 'service-flow',
      title: 'Service Request Flow',
      subtitle: 'One-Tap Emergency Relief',
      status: 'complete',
      priority: 'mvp',
      icon: Zap,
      description: 'Core service request experience from problem identification to provider dispatch',
      keyFeatures: [
        'Service selection with visual icons',
        'GPS location confirmation',
        'Pricing preview with transparency',
        'Provider matching algorithm',
        'Real-time dispatch confirmation'
      ],
      technicalSpecs: [
        'Geolocation API integration',
        'Real-time matching algorithms',
        'Payment processing integration',
        'Provider availability checking',
        'Push notification system'
      ],
      businessImpact: 'Core revenue driver, determines user satisfaction, enables scalable dispatch'
    },
    {
      id: 'tracking',
      title: 'Live Tracking',
      subtitle: 'Real-Time Transparency',
      status: 'complete',
      priority: 'mvp',
      icon: Globe,
      description: 'End-to-end tracking from dispatch to completion with live updates and ETA',
      keyFeatures: [
        'Cinematic arrival animations',
        'Live GPS tracking with provider',
        'ETA updates and notifications',
        'Safety panel with emergency options',
        'Completion confirmation flow'
      ],
      technicalSpecs: [
        'WebSocket connections for real-time data',
        'Map integration (Mapbox/Google)',
        'GPS tracking APIs',
        'Animation library for transitions',
        'Background location services'
      ],
      businessImpact: 'Builds trust through transparency, reduces customer anxiety, enables premium pricing'
    },
    {
      id: 'provider-app',
      title: 'Provider Platform',
      subtitle: 'Professional Tools & Training',
      status: 'in-progress',
      priority: 'mvp',
      icon: Smartphone,
      description: 'Complete provider ecosystem from onboarding to job management and earnings',
      keyFeatures: [
        'Provider onboarding with verification',
        'Job request notifications and acceptance',
        'Navigation and customer communication',
        'Earnings dashboard and payments',
        'Training modules and certification'
      ],
      technicalSpecs: [
        'Background job processing',
        'Real-time job dispatch system',
        'Payment processing for providers',
        'Document verification APIs',
        'Training content management'
      ],
      businessImpact: 'Ensures service quality, enables scalable provider network, maintains competitive rates'
    },
    {
      id: 'emergency',
      title: 'Emergency Mode',
      subtitle: 'Critical Safety Systems',
      status: 'complete',
      priority: 'mvp',
      icon: AlertTriangle,
      description: 'Emergency-first design with SOS features, silent alerts, and low-battery optimization',
      keyFeatures: [
        'One-tap SOS emergency button',
        'Silent emergency mode',
        'Low battery optimization',
        'Emergency contact notifications',
        'Priority dispatch for emergencies'
      ],
      technicalSpecs: [
        'Emergency alert APIs',
        'Battery optimization techniques',
        'Silent mode implementations',
        'Priority queue management',
        'Emergency services integration'
      ],
      businessImpact: 'Core safety value proposition, differentiates from competitors, enables insurance partnerships'
    },
    {
      id: 'membership',
      title: 'Membership & Pricing',
      subtitle: 'Sustainable Revenue Model',
      status: 'complete',
      priority: 'phase-2',
      icon: CreditCard,
      description: 'Tiered membership system with family plans and enterprise options',
      keyFeatures: [
        'Multiple membership tiers',
        'Family plan sharing',
        'On-demand pricing for non-members',
        'Enterprise and fleet pricing',
        'Trust indicators and guarantees'
      ],
      technicalSpecs: [
        'Subscription management system',
        'Billing and payment processing',
        'Family account linking',
        'Usage tracking and limits',
        'Pricing engine with tiers'
      ],
      businessImpact: 'Primary revenue driver, improves unit economics, enables predictable revenue'
    },
    {
      id: 'wallet',
      title: 'S.O.S Wallet',
      subtitle: 'Digital Payment Ecosystem',
      status: 'planned',
      priority: 'phase-2',
      icon: CreditCard,
      description: 'Digital wallet system with credits, referral rewards, and seamless payments',
      keyFeatures: [
        'Credit-based payment system',
        'Referral reward management',
        'Auto-reload functionality',
        'Transaction history',
        'Integration with membership billing'
      ],
      technicalSpecs: [
        'Digital wallet infrastructure',
        'Credit management system',
        'Payment method tokenization',
        'Transaction processing',
        'Reward calculation engine'
      ],
      businessImpact: 'Increases customer lifetime value, enables referral growth, reduces payment friction'
    },
    {
      id: 'trust',
      title: 'Safety & Trust',
      subtitle: 'Verified Provider Network',
      status: 'complete',
      priority: 'mvp',
      icon: Shield,
      description: 'Comprehensive safety system with provider verification and insurance coverage',
      keyFeatures: [
        'Provider ID verification flow',
        'Insurance coverage transparency',
        'Rating and review system',
        'Live safety support',
        'Safety timeline tracking'
      ],
      technicalSpecs: [
        'Identity verification APIs',
        'Insurance integration systems',
        'Rating calculation algorithms',
        'Real-time support chat',
        'Safety incident reporting'
      ],
      businessImpact: 'Enables trust-based premium pricing, reduces liability, enables B2B partnerships'
    },
    {
      id: 'concierge',
      title: 'AI Concierge',
      subtitle: 'Intelligent Assistant',
      status: 'complete',
      priority: 'phase-3',
      icon: MessageCircle,
      description: 'AI-powered assistant providing real-time updates, guidance, and voice interaction',
      keyFeatures: [
        'Real-time service updates',
        'Voice interaction capabilities',
        'Contextual guidance and tips',
        'Emergency escalation',
        'Multilingual support'
      ],
      technicalSpecs: [
        'AI/ML conversation engine',
        'Voice synthesis integration',
        'Real-time data processing',
        'Context awareness system',
        'Language processing APIs'
      ],
      businessImpact: 'Reduces support costs, improves user experience, enables 24/7 assistance'
    },
    {
      id: 'notifications',
      title: 'Notifications & Updates',
      subtitle: 'Cinematic Communication',
      status: 'complete',
      priority: 'mvp',
      icon: MessageCircle,
      description: 'Push notification system with receipts, history, and safety alerts',
      keyFeatures: [
        'Real-time service notifications',
        'Safety and emergency alerts',
        'Receipt and history management',
        'Membership update notifications',
        'Social sharing prompts'
      ],
      technicalSpecs: [
        'Push notification infrastructure',
        'Message templating system',
        'Delivery tracking and analytics',
        'A/B testing for messaging',
        'Cross-platform compatibility'
      ],
      businessImpact: 'Improves engagement, reduces customer anxiety, enables upselling opportunities'
    },
    {
      id: 'design-system',
      title: 'Design System',
      subtitle: 'Cinematic Brand Kit',
      status: 'complete',
      priority: 'mvp',
      icon: Palette,
      description: 'Comprehensive design system balancing urgency with premium feel across all touchpoints',
      keyFeatures: [
        'Color palette and semantic tokens',
        'Typography hierarchy',
        'Animated icon library',
        'Motion and microinteraction system',
        'Brand guidelines and assets'
      ],
      technicalSpecs: [
        'Design token system',
        'Component library architecture',
        'Animation framework',
        'Icon component system',
        'Brand asset management'
      ],
      businessImpact: 'Enables consistent brand experience, supports marketing scale, differentiates from competitors'
    },
    {
      id: 'gamification',
      title: 'Rewards & Gamification',
      subtitle: 'Cultural Engagement Layer',
      status: 'complete',
      priority: 'phase-3',
      icon: Gift,
      description: 'Gamified reward system encouraging referrals, loyalty, and social sharing',
      keyFeatures: [
        'Referral reward system',
        'Achievement badges and tiers',
        'Loyalty streaks and bonuses',
        'Social sharing integration',
        'Milestone celebrations'
      ],
      technicalSpecs: [
        'Reward calculation engine',
        'Achievement tracking system',
        'Social media integration APIs',
        'Gamification analytics',
        'Badge and tier management'
      ],
      businessImpact: 'Drives organic growth through referrals, increases engagement, creates switching costs'
    },
    {
      id: 'expansion',
      title: 'Enterprise Expansion',
      subtitle: 'B2B Infrastructure Platform',
      status: 'in-progress',
      priority: 'phase-4',
      icon: Building,
      description: 'Suite of B2B integrations for fleets, dealerships, insurance, and government',
      keyFeatures: [
        'Fleet management dashboard',
        'Dealership white-label integration',
        'Insurance partnership APIs',
        'Government and corporate accounts',
        'Multi-tenant architecture'
      ],
      technicalSpecs: [
        'Multi-tenant SaaS architecture',
        'API gateway and integration layer',
        'White-label customization system',
        'Enterprise billing and analytics',
        'Compliance and security frameworks'
      ],
      businessImpact: 'Expands TAM to $1.5T+, creates enterprise revenue streams, builds competitive moats'
    },
    {
      id: 'investor-pitch',
      title: 'Investor Relations',
      subtitle: 'Fundraising & Partnership Platform',
      status: 'complete',
      priority: 'phase-2',
      icon: TrendingUp,
      description: 'Investor-ready presentation system with live data and partner-specific narratives',
      keyFeatures: [
        'Cinematic pitch presentations',
        'Live data integration',
        'Partner-specific customization',
        'Market analysis and projections',
        'Fundraising materials generator'
      ],
      technicalSpecs: [
        'Presentation framework',
        'Real-time data visualization',
        'Template customization system',
        'Analytics dashboard integration',
        'Export and sharing capabilities'
      ],
      businessImpact: 'Enables efficient fundraising, attracts strategic partners, communicates vision clearly'
    }
  ];

  const getStatusColor = (status: BlueprintChapter['status']) => {
    switch (status) {
      case 'complete': return 'text-pulse-green';
      case 'in-progress': return 'text-beacon-blue';
      case 'planned': return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: BlueprintChapter['priority']) => {
    switch (priority) {
      case 'mvp': return 'bg-emergency-red/20 text-emergency-red border-emergency-red/30';
      case 'phase-2': return 'bg-beacon-blue/20 text-beacon-blue border-beacon-blue/30';
      case 'phase-3': return 'bg-pulse-green/20 text-pulse-green border-pulse-green/30';
      case 'phase-4': return 'bg-metallic-silver/20 text-metallic-silver border-metallic-silver/30';
    }
  };

  const getPriorityLabel = (priority: BlueprintChapter['priority']) => {
    switch (priority) {
      case 'mvp': return 'MVP Launch';
      case 'phase-2': return 'Growth Phase';
      case 'phase-3': return 'Scale Phase';
      case 'phase-4': return 'Enterprise Phase';
    }
  };

  const mvpChapters = blueprintChapters.filter(c => c.priority === 'mvp');
  const phase2Chapters = blueprintChapters.filter(c => c.priority === 'phase-2');
  const phase3Chapters = blueprintChapters.filter(c => c.priority === 'phase-3');
  const phase4Chapters = blueprintChapters.filter(c => c.priority === 'phase-4');

  const overallProgress = (blueprintChapters.filter(c => c.status === 'complete').length / blueprintChapters.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Motion.GuardianEnter className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-pulse-green/20 flex items-center justify-center">
              <FileText className="w-10 h-10 text-pulse-green" />
            </div>
          </div>
          
          <Typography.Hero className="text-4xl md:text-6xl">
            S.O.S Master Blueprint
          </Typography.Hero>
          <Typography.Subheadline className="text-muted-foreground max-w-4xl mx-auto">
            The complete cinematic roadmap — from emergency app to trillion-dollar mobility infrastructure. 
            15 integrated systems, one unified vision.
          </Typography.Subheadline>
          
          <div className="flex items-center justify-center space-x-8">
            <div className="text-center">
              <Typography.Headline className="text-3xl text-pulse-green">
                {Math.round(overallProgress)}%
              </Typography.Headline>
              <Typography.Small>Complete</Typography.Small>
            </div>
            <div className="text-center">
              <Typography.Headline className="text-3xl text-beacon-blue">15</Typography.Headline>
              <Typography.Small>Systems</Typography.Small>
            </div>
            <div className="text-center">
              <Typography.Headline className="text-3xl text-emergency-red">4</Typography.Headline>
              <Typography.Small>Phases</Typography.Small>
            </div>
          </div>
        </Motion.GuardianEnter>

        {/* Progress Overview */}
        <Card className="tech-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <Typography.Subheadline>Development Progress</Typography.Subheadline>
            <Typography.Tech className="text-pulse-green">{Math.round(overallProgress)}% Complete</Typography.Tech>
          </div>
          <Progress value={overallProgress} className="h-3 mb-4" />
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <Typography.Tech className="text-emergency-red">{mvpChapters.filter(c => c.status === 'complete').length}/{mvpChapters.length}</Typography.Tech>
              <Typography.Caption>MVP Features</Typography.Caption>
            </div>
            <div>
              <Typography.Tech className="text-beacon-blue">{phase2Chapters.filter(c => c.status === 'complete').length}/{phase2Chapters.length}</Typography.Tech>
              <Typography.Caption>Growth Phase</Typography.Caption>
            </div>
            <div>
              <Typography.Tech className="text-pulse-green">{phase3Chapters.filter(c => c.status === 'complete').length}/{phase3Chapters.length}</Typography.Tech>
              <Typography.Caption>Scale Phase</Typography.Caption>
            </div>
            <div>
              <Typography.Tech className="text-metallic-silver">{phase4Chapters.filter(c => c.status === 'complete').length}/{phase4Chapters.length}</Typography.Tech>
              <Typography.Caption>Enterprise Phase</Typography.Caption>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical Specs</TabsTrigger>
            <TabsTrigger value="business">Business Impact</TabsTrigger>
            <TabsTrigger value="roadmap">Build Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blueprintChapters.map((chapter) => (
                <Motion.HoverScale key={chapter.id}>
                  <Card 
                    className={`tech-surface p-6 cursor-pointer transition-all duration-300 ${
                      selectedChapter === chapter.id ? 'border-pulse-green/50' : 'border-border/30 hover:border-pulse-green/30'
                    }`}
                    onClick={() => setSelectedChapter(selectedChapter === chapter.id ? null : chapter.id)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-lg bg-asphalt-gray/50 flex items-center justify-center">
                            <chapter.icon className="w-6 h-6 text-pulse-green" />
                          </div>
                          <div>
                            <Typography.Subheadline className="text-pulse-green">
                              {chapter.title}
                            </Typography.Subheadline>
                            <Typography.Small className="text-muted-foreground">
                              {chapter.subtitle}
                            </Typography.Small>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getPriorityColor(chapter.priority)}>
                            {getPriorityLabel(chapter.priority)}
                          </Badge>
                          <div className={`flex items-center space-x-1 ${getStatusColor(chapter.status)}`}>
                            {chapter.status === 'complete' ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : chapter.status === 'in-progress' ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <Target className="w-4 h-4" />
                            )}
                            <Typography.Small className="capitalize">{chapter.status.replace('-', ' ')}</Typography.Small>
                          </div>
                        </div>
                      </div>
                      
                      <Typography.Caption className="text-muted-foreground">
                        {chapter.description}
                      </Typography.Caption>
                      
                      {selectedChapter === chapter.id && (
                        <Motion.SlideInUp>
                          <div className="pt-4 border-t border-border/30 space-y-3">
                            <Typography.Small className="font-medium">Key Features:</Typography.Small>
                            <div className="grid grid-cols-1 gap-2">
                              {chapter.keyFeatures.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="w-3 h-3 text-pulse-green flex-shrink-0" />
                                  <Typography.Caption>{feature}</Typography.Caption>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Motion.SlideInUp>
                      )}
                    </div>
                  </Card>
                </Motion.HoverScale>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blueprintChapters.map((chapter) => (
                <Card key={chapter.id} className="tech-surface p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <chapter.icon className="w-6 h-6 text-pulse-green" />
                    <Typography.Subheadline className="text-pulse-green">{chapter.title}</Typography.Subheadline>
                  </div>
                  
                  <Typography.Small className="font-medium mb-3">Technical Requirements:</Typography.Small>
                  <div className="space-y-2">
                    {chapter.technicalSpecs.map((spec, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-beacon-blue rounded-full mt-2 flex-shrink-0" />
                        <Typography.Caption className="text-muted-foreground">{spec}</Typography.Caption>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blueprintChapters.map((chapter) => (
                <Card key={chapter.id} className="tech-surface p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <chapter.icon className="w-6 h-6 text-pulse-green" />
                    <Typography.Subheadline className="text-pulse-green">{chapter.title}</Typography.Subheadline>
                  </div>
                  
                  <Typography.Small className="font-medium mb-3">Business Impact:</Typography.Small>
                  <Typography.Caption className="text-muted-foreground">{chapter.businessImpact}</Typography.Caption>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-8">
            {/* MVP Phase */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emergency-red/20 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-emergency-red" />
                </div>
                <div>
                  <Typography.Subheadline className="text-emergency-red">MVP Launch Phase</Typography.Subheadline>
                  <Typography.Small className="text-muted-foreground">Core service delivery platform</Typography.Small>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mvpChapters.map((chapter) => (
                  <Card key={chapter.id} className="tech-surface p-4 border-emergency-red/30">
                    <div className="flex items-center space-x-3">
                      <chapter.icon className="w-5 h-5 text-emergency-red" />
                      <Typography.Body className="font-medium">{chapter.title}</Typography.Body>
                      {chapter.status === 'complete' && <CheckCircle className="w-4 h-4 text-pulse-green" />}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Phase 2 */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-beacon-blue/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-beacon-blue" />
                </div>
                <div>
                  <Typography.Subheadline className="text-beacon-blue">Growth Phase</Typography.Subheadline>
                  <Typography.Small className="text-muted-foreground">Monetization and user acquisition</Typography.Small>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phase2Chapters.map((chapter) => (
                  <Card key={chapter.id} className="tech-surface p-4 border-beacon-blue/30">
                    <div className="flex items-center space-x-3">
                      <chapter.icon className="w-5 h-5 text-beacon-blue" />
                      <Typography.Body className="font-medium">{chapter.title}</Typography.Body>
                      {chapter.status === 'complete' && <CheckCircle className="w-4 h-4 text-pulse-green" />}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Phase 3 */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-pulse-green/20 flex items-center justify-center">
                  <Star className="w-6 h-6 text-pulse-green" />
                </div>
                <div>
                  <Typography.Subheadline className="text-pulse-green">Scale Phase</Typography.Subheadline>
                  <Typography.Small className="text-muted-foreground">Advanced features and engagement</Typography.Small>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phase3Chapters.map((chapter) => (
                  <Card key={chapter.id} className="tech-surface p-4 border-pulse-green/30">
                    <div className="flex items-center space-x-3">
                      <chapter.icon className="w-5 h-5 text-pulse-green" />
                      <Typography.Body className="font-medium">{chapter.title}</Typography.Body>
                      {chapter.status === 'complete' && <CheckCircle className="w-4 h-4 text-pulse-green" />}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Phase 4 */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-metallic-silver/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-metallic-silver" />
                </div>
                <div>
                  <Typography.Subheadline className="text-metallic-silver">Enterprise Phase</Typography.Subheadline>
                  <Typography.Small className="text-muted-foreground">B2B expansion and infrastructure</Typography.Small>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {phase4Chapters.map((chapter) => (
                  <Card key={chapter.id} className="tech-surface p-4 border-metallic-silver/30">
                    <div className="flex items-center space-x-3">
                      <chapter.icon className="w-5 h-5 text-metallic-silver" />
                      <Typography.Body className="font-medium">{chapter.title}</Typography.Body>
                      {chapter.status === 'complete' && <CheckCircle className="w-4 h-4 text-pulse-green" />}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Executive Summary */}
        <Motion.SlideInUp>
          <Card className="tech-surface p-8 border-pulse-green/30">
            <Typography.Subheadline className="text-center mb-6 text-pulse-green">
              Executive Summary
            </Typography.Subheadline>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <Typography.Headline className="text-4xl text-emergency-red">MVP Ready</Typography.Headline>
                <Typography.Body className="font-medium">Core Platform</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  Emergency service delivery with real-time tracking, verified Heroes, and safety-first design
                </Typography.Small>
              </div>

              <div className="text-center space-y-4">
                <Typography.Headline className="text-4xl text-beacon-blue">$1.5T TAM</Typography.Headline>
                <Typography.Body className="font-medium">Market Opportunity</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  From $11B rescue market to trillion-dollar mobility infrastructure through B2B expansion
                </Typography.Small>
              </div>

              <div className="text-center space-y-4">
                <Typography.Headline className="text-4xl text-pulse-green">4 Phases</Typography.Headline>
                <Typography.Body className="font-medium">Scale Strategy</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  Clear roadmap from consumer app to enterprise infrastructure platform
                </Typography.Small>
              </div>
            </div>

            <div className="mt-8 p-6 bg-asphalt-gray/30 rounded-lg">
              <Typography.Body className="text-center italic text-lg">
                "S.O.S transforms from emergency app to trillion-dollar mobility infrastructure — 
                the Tesla/Uber of rescue assistance with expansion into fleets, insurance, and global governments."
              </Typography.Body>
            </div>
          </Card>
        </Motion.SlideInUp>
      </div>
    </div>
  );
};

export default RoadsideMasterBlueprint;