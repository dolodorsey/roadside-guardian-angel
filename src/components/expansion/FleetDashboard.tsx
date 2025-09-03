import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Truck, 
  Clock, 
  Shield, 
  Users, 
  DollarSign, 
  BarChart3, 
  Globe,
  AlertTriangle,
  CheckCircle,
  Car,
  Navigation
} from 'lucide-react';

interface FleetVehicle {
  id: string;
  driver: string;
  status: 'active' | 'emergency' | 'offline' | 'service';
  location: { lat: number; lng: number; address: string };
  lastUpdate: string;
  vehicleType: 'rideshare' | 'delivery' | 'rental' | 'truck';
}

const FleetDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);
  
  // Mock fleet data
  const fleetStats = {
    totalVehicles: 247,
    activeVehicles: 189,
    emergencies: 3,
    totalSavings: 24680,
    avgResponseTime: 6.2,
    monthlyJobs: 156
  };

  const mockVehicles: FleetVehicle[] = [
    {
      id: 'V001',
      driver: 'John Smith',
      status: 'active',
      location: { lat: 40.7128, lng: -74.0060, address: 'Manhattan, NY' },
      lastUpdate: '2 min ago',
      vehicleType: 'rideshare'
    },
    {
      id: 'V002',
      driver: 'Sarah Johnson',
      status: 'emergency',
      location: { lat: 40.7589, lng: -73.9851, address: 'Times Square, NY' },
      lastUpdate: 'Now',
      vehicleType: 'delivery'
    },
    {
      id: 'V003',
      driver: 'Mike Chen',
      status: 'active',
      location: { lat: 40.6782, lng: -73.9442, address: 'Brooklyn, NY' },
      lastUpdate: '5 min ago',
      vehicleType: 'rental'
    }
  ];

  const getStatusColor = (status: FleetVehicle['status']) => {
    const colors = {
      active: 'text-pulse-green',
      emergency: 'text-emergency-red',
      offline: 'text-muted-foreground',
      service: 'text-beacon-blue'
    };
    return colors[status];
  };

  const getStatusIcon = (status: FleetVehicle['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'emergency':
        return <AlertTriangle className="w-4 h-4" />;
      case 'offline':
        return <Clock className="w-4 h-4" />;
      case 'service':
        return <Car className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography.Headline>Fleet Command Center</Typography.Headline>
          <Typography.Body className="text-muted-foreground">
            Real-time fleet monitoring and emergency dispatch
          </Typography.Body>
        </div>
        <Badge className="bg-pulse-green/20 text-pulse-green border-pulse-green/30">
          All Systems Operational
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Motion.GuardianEnter>
          <Card className="tech-surface p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-pulse-green/20 flex items-center justify-center">
                <Truck className="w-5 h-5 text-pulse-green" />
              </div>
              <div>
                <Typography.Tech className="text-2xl font-bold">
                  {fleetStats.totalVehicles}
                </Typography.Tech>
                <Typography.Caption>Total Fleet</Typography.Caption>
              </div>
            </div>
          </Card>
        </Motion.GuardianEnter>

        <Motion.GuardianEnter>
          <Card className="tech-surface p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-beacon-blue/20 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-beacon-blue" />
              </div>
              <div>
                <Typography.Tech className="text-2xl font-bold text-beacon-blue">
                  {fleetStats.activeVehicles}
                </Typography.Tech>
                <Typography.Caption>Active Now</Typography.Caption>
              </div>
            </div>
          </Card>
        </Motion.GuardianEnter>

        <Motion.GuardianEnter>
          <Card className="tech-surface p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emergency-red/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-emergency-red" />
              </div>
              <div>
                <Typography.Tech className="text-2xl font-bold text-emergency-red">
                  {fleetStats.emergencies}
                </Typography.Tech>
                <Typography.Caption>Emergencies</Typography.Caption>
              </div>
            </div>
          </Card>
        </Motion.GuardianEnter>

        <Motion.GuardianEnter>
          <Card className="tech-surface p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-pulse-green/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-pulse-green" />
              </div>
              <div>
                <Typography.Tech className="text-2xl font-bold text-pulse-green">
                  ${fleetStats.totalSavings.toLocaleString()}
                </Typography.Tech>
                <Typography.Caption>Saved YTD</Typography.Caption>
              </div>
            </div>
          </Card>
        </Motion.GuardianEnter>

        <Motion.GuardianEnter>
          <Card className="tech-surface p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-beacon-blue/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-beacon-blue" />
              </div>
              <div>
                <Typography.Tech className="text-2xl font-bold text-beacon-blue">
                  {fleetStats.avgResponseTime}m
                </Typography.Tech>
                <Typography.Caption>Avg Response</Typography.Caption>
              </div>
            </div>
          </Card>
        </Motion.GuardianEnter>

        <Motion.GuardianEnter>
          <Card className="tech-surface p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-metallic-silver/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-metallic-silver" />
              </div>
              <div>
                <Typography.Tech className="text-2xl font-bold text-metallic-silver">
                  {fleetStats.monthlyJobs}
                </Typography.Tech>
                <Typography.Caption>Jobs This Month</Typography.Caption>
              </div>
            </div>
          </Card>
        </Motion.GuardianEnter>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Live Map</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicle List</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Live Map Placeholder */}
          <Card className="tech-surface p-6 h-96">
            <div className="relative w-full h-full bg-midnight-black rounded-lg overflow-hidden">
              {/* Map Background Grid */}
              <div className="absolute inset-0 opacity-20">
                <div 
                  className="w-full h-full"
                  style={{
                    backgroundImage: `
                      linear-gradient(90deg, hsl(var(--metallic-silver)) 1px, transparent 1px),
                      linear-gradient(hsl(var(--metallic-silver)) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />
              </div>

              {/* Vehicle Beacons */}
              {mockVehicles.map((vehicle, index) => (
                <Motion.ArrivalBeacon
                  key={vehicle.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`
                  }}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className={`w-4 h-4 rounded-full ${
                    vehicle.status === 'emergency' ? 'bg-emergency-red' :
                    vehicle.status === 'active' ? 'bg-pulse-green' :
                    'bg-muted-foreground'
                  } animate-heartbeat`} />
                </Motion.ArrivalBeacon>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 space-y-2">
                <Typography.Caption className="text-foreground">Fleet Status</Typography.Caption>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-pulse-green rounded-full"></div>
                  <Typography.Small>Active</Typography.Small>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emergency-red rounded-full"></div>
                  <Typography.Small>Emergency</Typography.Small>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                  <Typography.Small>Offline</Typography.Small>
                </div>
              </div>

              {/* Map Title */}
              <div className="absolute top-4 left-4">
                <Typography.Subheadline className="text-foreground">
                  Live Fleet Tracking
                </Typography.Subheadline>
                <Typography.Small className="text-muted-foreground">
                  {fleetStats.activeVehicles} vehicles active
                </Typography.Small>
              </div>
            </div>
          </Card>

          {/* Vehicle Detail Panel */}
          {selectedVehicle && (
            <Motion.SlideInUp>
              <Card className="tech-surface p-6 border-pulse-green/30">
                <div className="flex items-center justify-between mb-4">
                  <Typography.Subheadline>Vehicle Details</Typography.Subheadline>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedVehicle(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Vehicle ID</Typography.Small>
                    <Typography.Body className="font-medium">{selectedVehicle.id}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Driver</Typography.Small>
                    <Typography.Body className="font-medium">{selectedVehicle.driver}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Status</Typography.Small>
                    <div className={`flex items-center space-x-2 ${getStatusColor(selectedVehicle.status)}`}>
                      {getStatusIcon(selectedVehicle.status)}
                      <Typography.Body className="font-medium capitalize">
                        {selectedVehicle.status}
                      </Typography.Body>
                    </div>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Location</Typography.Small>
                    <Typography.Body className="font-medium">{selectedVehicle.location.address}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Type</Typography.Small>
                    <Typography.Body className="font-medium capitalize">{selectedVehicle.vehicleType}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Last Update</Typography.Small>
                    <Typography.Body className="font-medium">{selectedVehicle.lastUpdate}</Typography.Body>
                  </div>
                </div>

                {selectedVehicle.status === 'emergency' && (
                  <div className="mt-6 p-4 bg-emergency-red/10 rounded-lg border border-emergency-red/30">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-6 h-6 text-emergency-red" />
                      <div>
                        <Typography.Body className="font-medium text-emergency-red">
                          Emergency in Progress
                        </Typography.Body>
                        <Typography.Small className="text-muted-foreground">
                          Roadside technician dispatched • ETA 4 minutes
                        </Typography.Small>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </Motion.SlideInUp>
          )}
        </TabsContent>

        <TabsContent value="vehicles">
          <Card className="tech-surface">
            <div className="p-6">
              <Typography.Subheadline className="mb-4">Vehicle List</Typography.Subheadline>
              <div className="space-y-4">
                {mockVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 rounded-lg bg-asphalt-gray/50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        vehicle.status === 'emergency' ? 'bg-emergency-red' :
                        vehicle.status === 'active' ? 'bg-pulse-green' :
                        'bg-muted-foreground'
                      }`} />
                      <div>
                        <Typography.Body className="font-medium">{vehicle.id} - {vehicle.driver}</Typography.Body>
                        <Typography.Small className="text-muted-foreground">{vehicle.location.address}</Typography.Small>
                      </div>
                    </div>
                    <div className="text-right">
                      <Typography.Small className={getStatusColor(vehicle.status)}>
                        {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                      </Typography.Small>
                      <Typography.Caption>{vehicle.lastUpdate}</Typography.Caption>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="tech-surface p-6">
              <Typography.Subheadline className="mb-4">Monthly Performance</Typography.Subheadline>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <Typography.Small>Response Time</Typography.Small>
                    <Typography.Small className="text-pulse-green">98% under 10min</Typography.Small>
                  </div>
                  <Progress value={98} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Typography.Small>Customer Satisfaction</Typography.Small>
                    <Typography.Small className="text-pulse-green">4.9/5.0</Typography.Small>
                  </div>
                  <Progress value={98} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <Typography.Small>Fleet Uptime</Typography.Small>
                    <Typography.Small className="text-pulse-green">99.2%</Typography.Small>
                  </div>
                  <Progress value={99} />
                </div>
              </div>
            </Card>

            <Card className="tech-surface p-6">
              <Typography.Subheadline className="mb-4">Cost Savings</Typography.Subheadline>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Typography.Small>vs. Traditional Roadside</Typography.Small>
                  <Typography.Tech className="text-pulse-green">-47%</Typography.Tech>
                </div>
                <div className="flex justify-between items-center">
                  <Typography.Small>Fleet Downtime Reduction</Typography.Small>
                  <Typography.Tech className="text-pulse-green">-62%</Typography.Tech>
                </div>
                <div className="flex justify-between items-center">
                  <Typography.Small>Total YTD Savings</Typography.Small>
                  <Typography.Tech className="text-pulse-green">${fleetStats.totalSavings.toLocaleString()}</Typography.Tech>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="tech-surface p-6">
            <Typography.Subheadline className="mb-4">Fleet Billing</Typography.Subheadline>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Typography.Small className="text-muted-foreground">Current Plan</Typography.Small>
                <Typography.Body className="font-medium">Enterprise Fleet Pro</Typography.Body>
                <Typography.Small>$25/vehicle/month</Typography.Small>
              </div>
              <div className="space-y-2">
                <Typography.Small className="text-muted-foreground">Monthly Cost</Typography.Small>
                <Typography.Headline className="text-2xl text-pulse-green">
                  ${(fleetStats.totalVehicles * 25).toLocaleString()}
                </Typography.Headline>
              </div>
              <div className="space-y-2">
                <Typography.Small className="text-muted-foreground">Next Billing</Typography.Small>
                <Typography.Body className="font-medium">March 1, 2024</Typography.Body>
                <Typography.Small>Auto-pay enabled</Typography.Small>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FleetDashboard;