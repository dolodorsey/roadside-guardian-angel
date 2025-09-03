import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Globe, 
  Shield, 
  Users, 
  MapPin,
  Plane,
  HelpingHand,
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Star,
  Clock
} from 'lucide-react';

const CorporateAccounts = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const corporateClients = [
    {
      id: 'corp-1',
      name: 'TechCorp Global',
      type: 'Technology',
      employees: 15000,
      countries: 28,
      plan: 'Enterprise Global',
      status: 'Active',
      savings: 247000,
      icon: '💻'
    },
    {
      id: 'corp-2', 
      name: 'City of Austin',
      type: 'Municipal',
      employees: 4500,
      countries: 1,
      plan: 'Government Fleet',
      status: 'Active',
      savings: 89000,
      icon: '🏛️'
    },
    {
      id: 'corp-3',
      name: 'Global Logistics Inc',
      type: 'Transportation',
      employees: 8200,
      countries: 15,
      plan: 'Enterprise Fleet',
      status: 'Active',
      savings: 156000,
      icon: '🚛'
    }
  ];

  const governmentPrograms = [
    {
      name: 'FEMA Emergency Response',
      description: 'Disaster relief roadside support coordination',
      status: 'Active',
      coverage: 'National',
      icon: '🚨'
    },
    {
      name: 'Military Base Support',
      description: 'On-base vehicle assistance for personnel',
      status: 'Pilot',
      coverage: '12 Bases',
      icon: '🏭'
    },
    {
      name: 'State DOT Partnership',
      description: 'Highway safety and emergency response',
      status: 'Expanding',
      coverage: '8 States',
      icon: '🛣️'
    }
  ];

  const corporateFeatures = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Worldwide roadside assistance for traveling employees',
      tier: 'Enterprise'
    },
    {
      icon: Shield,
      title: 'Emergency Protocols',
      description: 'Custom emergency response procedures and escalation',
      tier: 'All Plans'
    },
    {
      icon: Briefcase,
      title: 'Travel Integration',
      description: 'Seamless integration with corporate travel systems',
      tier: 'Enterprise'
    },
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Centralized employee access and usage reporting',
      tier: 'All Plans'
    },
    {
      icon: MapPin,
      title: 'Fleet Tracking',
      description: 'Real-time tracking for company vehicles',
      tier: 'Fleet Plans'
    },
    {
      icon: HelpingHand,
      title: 'Disaster Response',
      description: 'Coordinated support during natural disasters',
      tier: 'Government'
    }
  ];

  const getTierColor = (tier: string) => {
    const colors = {
      'Enterprise': 'text-pulse-green',
      'All Plans': 'text-beacon-blue',
      'Fleet Plans': 'text-emergency-red',
      'Government': 'text-metallic-silver'
    };
    return colors[tier as keyof typeof colors] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Motion.GuardianEnter>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-metallic-silver/20 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-metallic-silver" />
            </div>
            <Typography.Emergency className="text-2xl">×</Typography.Emergency>
            <div className="w-16 h-16 rounded-lg tech-surface border border-metallic-silver/30 flex items-center justify-center">
              <Typography.Tech className="text-sm font-bold">CORP</Typography.Tech>
            </div>
          </div>
        </Motion.GuardianEnter>
        
        <Typography.Headline>Corporate & Government</Typography.Headline>
        <Typography.Body className="text-muted-foreground max-w-2xl mx-auto">
          Enterprise-grade roadside assistance for corporations, municipalities, and government agencies. 
          Global coverage, custom protocols, and disaster response coordination.
        </Typography.Body>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="corporate" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="corporate">Corporate Clients</TabsTrigger>
          <TabsTrigger value="government">Government Programs</TabsTrigger>
          <TabsTrigger value="features">Enterprise Features</TabsTrigger>
        </TabsList>

        <TabsContent value="corporate" className="space-y-6">
          {/* Corporate Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="tech-surface p-4">
              <Typography.Tech className="text-2xl font-bold text-pulse-green">47</Typography.Tech>
              <Typography.Caption>Active Accounts</Typography.Caption>
            </Card>
            <Card className="tech-surface p-4">
              <Typography.Tech className="text-2xl font-bold text-beacon-blue">234K</Typography.Tech>
              <Typography.Caption>Covered Employees</Typography.Caption>
            </Card>
            <Card className="tech-surface p-4">
              <Typography.Tech className="text-2xl font-bold text-emergency-red">67</Typography.Tech>
              <Typography.Caption>Countries</Typography.Caption>
            </Card>
            <Card className="tech-surface p-4">
              <Typography.Tech className="text-2xl font-bold text-metallic-silver">$2.4M</Typography.Tech>
              <Typography.Caption>Total Savings</Typography.Caption>
            </Card>
          </div>

          {/* Corporate Clients List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {corporateClients.map((client) => (
              <Motion.HoverScale key={client.id}>
                <Card 
                  className="tech-surface p-6 cursor-pointer hover:border-pulse-green/50 transition-colors"
                  onClick={() => setSelectedAccount(client.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{client.icon}</div>
                    <Badge className="bg-pulse-green/20 text-pulse-green border-pulse-green/30">
                      {client.status}
                    </Badge>
                  </div>
                  
                  <Typography.Subheadline className="mb-2">{client.name}</Typography.Subheadline>
                  <Typography.Small className="text-muted-foreground mb-4">{client.type}</Typography.Small>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Typography.Small>Employees</Typography.Small>
                      <Typography.Small className="font-medium">{client.employees.toLocaleString()}</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Countries</Typography.Small>
                      <Typography.Small className="font-medium">{client.countries}</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Plan</Typography.Small>
                      <Typography.Small className="font-medium text-pulse-green">{client.plan}</Typography.Small>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>YTD Savings</Typography.Small>
                      <Typography.Small className="font-medium text-pulse-green">
                        ${client.savings.toLocaleString()}
                      </Typography.Small>
                    </div>
                  </div>
                </Card>
              </Motion.HoverScale>
            ))}
          </div>

          {/* Client Success Story */}
          <Motion.SlideInUp>
            <Card className="tech-surface p-8 border-pulse-green/30">
              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Typography.Body className="text-lg italic">
                  "Roadside's enterprise solution reduced our travel-related incidents by 58% and saved us 
                  over $200K in the first year. The global coverage gives our employees confidence wherever they travel."
                </Typography.Body>
                
                <div className="space-y-1">
                  <Typography.Small className="font-medium">Jennifer Martinez</Typography.Small>
                  <Typography.Caption>VP of Corporate Security, TechCorp Global</Typography.Caption>
                </div>
              </div>
            </Card>
          </Motion.SlideInUp>
        </TabsContent>

        <TabsContent value="government" className="space-y-6">
          {/* Government Programs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {governmentPrograms.map((program, index) => (
              <Motion.GuardianEnter key={index}>
                <Card className="tech-surface p-6">
                  <div className="text-center mb-4 text-4xl">{program.icon}</div>
                  <Typography.Subheadline className="text-center mb-3">{program.name}</Typography.Subheadline>
                  <Typography.Small className="text-muted-foreground text-center mb-4">
                    {program.description}
                  </Typography.Small>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography.Small>Status</Typography.Small>
                      <Badge className={`${
                        program.status === 'Active' 
                          ? 'bg-pulse-green/20 text-pulse-green border-pulse-green/30'
                          : program.status === 'Pilot'
                          ? 'bg-beacon-blue/20 text-beacon-blue border-beacon-blue/30'
                          : 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
                      }`}>
                        {program.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <Typography.Small>Coverage</Typography.Small>
                      <Typography.Small className="font-medium">{program.coverage}</Typography.Small>
                    </div>
                  </div>
                </Card>
              </Motion.GuardianEnter>
            ))}
          </div>

          {/* Emergency Response Timeline */}
          <Card className="tech-surface p-6">
            <Typography.Subheadline className="mb-6 text-center">
              Emergency Response Protocol
            </Typography.Subheadline>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-emergency-red/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-emergency-red" />
                </div>
                <Typography.Body className="font-medium">Alert Received</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  Emergency dispatch coordinates with local authorities
                </Typography.Small>
                <Typography.Caption className="text-emergency-red">0-2 minutes</Typography.Caption>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-beacon-blue/20 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-beacon-blue" />
                </div>
                <Typography.Body className="font-medium">Location Verified</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  GPS coordinates shared with emergency response teams
                </Typography.Small>
                <Typography.Caption className="text-beacon-blue">2-5 minutes</Typography.Caption>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <Typography.Body className="font-medium">Support Dispatched</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  Nearest qualified technician deployed to location
                </Typography.Small>
                <Typography.Caption className="text-yellow-400">5-8 minutes</Typography.Caption>
              </div>

              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-pulse-green/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-pulse-green" />
                </div>
                <Typography.Body className="font-medium">Issue Resolved</Typography.Body>
                <Typography.Small className="text-muted-foreground">
                  Service completed with full incident documentation
                </Typography.Small>
                <Typography.Caption className="text-pulse-green">15-45 minutes</Typography.Caption>
              </div>
            </div>
          </Card>

          {/* Municipal Partnership CTA */}
          <Motion.SlideInUp>
            <Card className="tech-surface p-8 text-center border-beacon-blue/30">
              <Typography.Subheadline className="mb-4">Municipal Partnership Program</Typography.Subheadline>
              <Typography.Body className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join the growing network of cities and municipalities using Roadside for fleet management, 
                emergency response, and citizen safety programs.
              </Typography.Body>
              <Button className="bg-beacon-blue hover:bg-beacon-blue/80 text-white">
                Schedule Consultation
                <Plane className="w-4 h-4 ml-2" />
              </Button>
            </Card>
          </Motion.SlideInUp>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {corporateFeatures.map((feature, index) => (
              <Motion.GuardianEnter key={index}>
                <Card className="tech-surface p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-metallic-silver/20 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-metallic-silver" />
                  </div>
                  
                  <Typography.Subheadline className="text-center mb-3">{feature.title}</Typography.Subheadline>
                  <Typography.Small className="text-muted-foreground text-center mb-4">
                    {feature.description}
                  </Typography.Small>
                  
                  <Badge className={`w-full justify-center ${getTierColor(feature.tier).replace('text-', 'bg-').replace('text-', '')}/20 border-current`}>
                    <span className={getTierColor(feature.tier)}>{feature.tier}</span>
                  </Badge>
                </Card>
              </Motion.GuardianEnter>
            ))}
          </div>

          {/* Enterprise Benefits */}
          <Card className="tech-surface p-8 border-pulse-green/30">
            <Typography.Subheadline className="text-center mb-6">
              Enterprise Benefits
            </Typography.Subheadline>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <Typography.Headline className="text-3xl text-pulse-green">-47%</Typography.Headline>
                <Typography.Small>Emergency Response Costs</Typography.Small>
              </div>
              <div className="text-center space-y-2">
                <Typography.Headline className="text-3xl text-beacon-blue">99.8%</Typography.Headline>
                <Typography.Small>Service Availability</Typography.Small>
              </div>
              <div className="text-center space-y-2">
                <Typography.Headline className="text-3xl text-emergency-red">6.2min</Typography.Headline>
                <Typography.Small>Average Response Time</Typography.Small>
              </div>
              <div className="text-center space-y-2">
                <Typography.Headline className="text-3xl text-metallic-silver">24/7</Typography.Headline>
                <Typography.Small>Global Coverage</Typography.Small>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CorporateAccounts;