import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '../design-system/RoadsideTypography';
import { Motion } from '../design-system/RoadsideMotion';
import { 
  Shield, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  Clock,
  DollarSign,
  Phone,
  Upload,
  Download,
  AlertCircle
} from 'lucide-react';

interface Claim {
  id: string;
  date: string;
  service: string;
  amount: number;
  status: 'approved' | 'processing' | 'pending';
  customerName: string;
  claimNumber: string;
}

const InsurancePartnership = () => {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showCoverage, setShowCoverage] = useState(false);

  const mockClaims: Claim[] = [
    {
      id: '1',
      date: '2024-02-15',
      service: 'Emergency Towing',
      amount: 125.00,
      status: 'approved',
      customerName: 'John Smith',
      claimNumber: 'CLM-2024-0015789'
    },
    {
      id: '2',
      date: '2024-02-14',
      service: 'Jump Start',
      amount: 45.00,
      status: 'processing',
      customerName: 'Sarah Johnson',
      claimNumber: 'CLM-2024-0015788'
    },
    {
      id: '3',
      date: '2024-02-13',
      service: 'Tire Change',
      amount: 65.00,
      status: 'pending',
      customerName: 'Mike Chen',
      claimNumber: 'CLM-2024-0015787'
    }
  ];

  const partnerInsurers = [
    { name: 'State Farm', logo: '🏛️', status: 'Active', customers: 1847 },
    { name: 'Geico', logo: '🦎', status: 'Active', customers: 2134 },
    { name: 'Progressive', logo: '🌊', status: 'Active', customers: 1623 },
    { name: 'Allstate', logo: '🤝', status: 'Pending', customers: 0 }
  ];

  const getStatusColor = (status: Claim['status']) => {
    const colors = {
      approved: 'text-pulse-green',
      processing: 'text-beacon-blue',
      pending: 'text-yellow-400'
    };
    return colors[status];
  };

  const getStatusIcon = (status: Claim['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <Motion.GuardianEnter>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-lg bg-beacon-blue/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-beacon-blue" />
            </div>
            <Typography.Emergency className="text-2xl">×</Typography.Emergency>
            <div className="w-16 h-16 rounded-lg tech-surface border border-beacon-blue/30 flex items-center justify-center">
              <Typography.Tech className="text-sm font-bold">INSURER</Typography.Tech>
            </div>
          </div>
        </Motion.GuardianEnter>
        
        <Typography.Headline>Insurance Partnerships</Typography.Headline>
        <Typography.Body className="text-muted-foreground max-w-2xl mx-auto">
          Seamless integration with insurance providers. Automated claims processing, 
          real-time coverage verification, and white-label roadside services for your policyholders.
        </Typography.Body>
      </div>

      {/* Coverage Demo */}
      <Motion.SlideInUp>
        <Card className="tech-surface max-w-md mx-auto overflow-hidden">
          <div className="p-6">
            <Typography.Subheadline className="text-center mb-6">
              Customer Coverage View
            </Typography.Subheadline>
            
            {/* Insurance Card */}
            <Motion.PremiumShimmer>
              <div className="relative bg-gradient-luxury p-6 rounded-xl mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-beacon-blue/20 to-transparent" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <Typography.Body className="font-bold text-midnight-black">
                      State Farm Insurance
                    </Typography.Body>
                    <div className="w-8 h-8 bg-beacon-blue rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <Typography.Small className="text-midnight-black/70 mb-2">
                    Roadside Coverage Active
                  </Typography.Small>
                  
                  <Typography.Body className="font-medium text-midnight-black">
                    Policy #: SF-2024-789456
                  </Typography.Body>
                </div>
              </div>
            </Motion.PremiumShimmer>

            {/* Coverage Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Typography.Small>Coverage Limit</Typography.Small>
                <Typography.Tech className="text-pulse-green">$500 per incident</Typography.Tech>
              </div>
              
              <div className="flex items-center justify-between">
                <Typography.Small>Annual Limit</Typography.Small>
                <Typography.Tech className="text-pulse-green">$2,000</Typography.Tech>
              </div>
              
              <div className="flex items-center justify-between">
                <Typography.Small>Used This Year</Typography.Small>
                <Typography.Tech>$125</Typography.Tech>
              </div>
            </div>

            {/* Coverage Confirmation */}
            <div className="mt-6 p-4 bg-pulse-green/10 rounded-lg border border-pulse-green/30">
              <div className="flex items-center space-x-3">
                <Motion.ProviderLock>
                  <CheckCircle className="w-6 h-6 text-pulse-green" />
                </Motion.ProviderLock>
                <div>
                  <Typography.Body className="font-medium text-pulse-green">
                    Service Covered
                  </Typography.Body>
                  <Typography.Small className="text-muted-foreground">
                    Your insurer will handle payment automatically
                  </Typography.Small>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Motion.SlideInUp>

      {/* Partner Insurance Companies */}
      <div className="max-w-4xl mx-auto">
        <Typography.Subheadline className="text-center mb-8">
          Partner Insurance Companies
        </Typography.Subheadline>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerInsurers.map((insurer, index) => (
            <Motion.HoverScale key={index}>
              <Card className="tech-surface p-6 text-center">
                <div className="text-4xl mb-4">{insurer.logo}</div>
                <Typography.Body className="font-medium mb-2">{insurer.name}</Typography.Body>
                <Badge className={`mb-3 ${
                  insurer.status === 'Active' 
                    ? 'bg-pulse-green/20 text-pulse-green border-pulse-green/30'
                    : 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30'
                }`}>
                  {insurer.status}
                </Badge>
                {insurer.customers > 0 && (
                  <Typography.Small className="text-muted-foreground">
                    {insurer.customers.toLocaleString()} active customers
                  </Typography.Small>
                )}
              </Card>
            </Motion.HoverScale>
          ))}
        </div>
      </div>

      {/* Claims Management */}
      <div className="max-w-6xl mx-auto">
        <Typography.Subheadline className="text-center mb-8">
          Claims Management Dashboard
        </Typography.Subheadline>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Claims List */}
          <div className="lg:col-span-2">
            <Card className="tech-surface">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Typography.Body className="font-medium">Recent Claims</Typography.Body>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {mockClaims.map((claim) => (
                    <div 
                      key={claim.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-asphalt-gray/30 cursor-pointer hover:bg-asphalt-gray/50 transition-colors"
                      onClick={() => setSelectedClaim(claim)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 ${getStatusColor(claim.status)}`}>
                          {getStatusIcon(claim.status)}
                        </div>
                        <div>
                          <Typography.Body className="font-medium">{claim.service}</Typography.Body>
                          <Typography.Small className="text-muted-foreground">
                            {claim.customerName} • {claim.claimNumber}
                          </Typography.Small>
                        </div>
                      </div>
                      <div className="text-right">
                        <Typography.Body className="font-medium">${claim.amount}</Typography.Body>
                        <Typography.Small className={getStatusColor(claim.status)}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </Typography.Small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Claims Summary */}
          <div className="space-y-6">
            <Card className="tech-surface p-6">
              <Typography.Body className="font-medium mb-4">Monthly Summary</Typography.Body>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Typography.Small>Total Claims</Typography.Small>
                  <Typography.Tech className="text-pulse-green">847</Typography.Tech>
                </div>
                <div className="flex justify-between">
                  <Typography.Small>Approved</Typography.Small>
                  <Typography.Tech className="text-pulse-green">823</Typography.Tech>
                </div>
                <div className="flex justify-between">
                  <Typography.Small>Processing</Typography.Small>
                  <Typography.Tech className="text-beacon-blue">18</Typography.Tech>
                </div>
                <div className="flex justify-between">
                  <Typography.Small>Pending</Typography.Small>
                  <Typography.Tech className="text-yellow-400">6</Typography.Tech>
                </div>
                <hr className="border-border/30" />
                <div className="flex justify-between">
                  <Typography.Small>Total Amount</Typography.Small>
                  <Typography.Headline className="text-lg text-pulse-green">$47,832</Typography.Headline>
                </div>
              </div>
            </Card>

            <Card className="tech-surface p-6">
              <Typography.Body className="font-medium mb-4">Quick Actions</Typography.Body>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Upload Claims
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-black/80 backdrop-blur-sm p-4">
          <Motion.SlideInUp className="w-full max-w-2xl">
            <Card className="tech-surface border-beacon-blue/30">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Typography.Subheadline>Claim Details</Typography.Subheadline>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedClaim(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Claim Number</Typography.Small>
                    <Typography.Body className="font-medium">{selectedClaim.claimNumber}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Customer</Typography.Small>
                    <Typography.Body className="font-medium">{selectedClaim.customerName}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Service</Typography.Small>
                    <Typography.Body className="font-medium">{selectedClaim.service}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Date</Typography.Small>
                    <Typography.Body className="font-medium">{selectedClaim.date}</Typography.Body>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Amount</Typography.Small>
                    <Typography.Headline className="text-xl text-pulse-green">
                      ${selectedClaim.amount}
                    </Typography.Headline>
                  </div>
                  <div>
                    <Typography.Small className="text-muted-foreground mb-2">Status</Typography.Small>
                    <div className={`flex items-center space-x-2 ${getStatusColor(selectedClaim.status)}`}>
                      {getStatusIcon(selectedClaim.status)}
                      <Typography.Body className="font-medium capitalize">
                        {selectedClaim.status}
                      </Typography.Body>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1 bg-pulse-green hover:bg-pulse-green/80 text-midnight-black">
                    Approve Claim
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Request Documentation
                  </Button>
                </div>
              </div>
            </Card>
          </Motion.SlideInUp>
        </div>
      )}

      {/* Integration Benefits */}
      <Motion.SlideInUp>
        <Card className="tech-surface p-8 max-w-4xl mx-auto border-beacon-blue/30">
          <Typography.Subheadline className="text-center mb-6">
            Partnership Benefits
          </Typography.Subheadline>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-lg bg-pulse-green/20 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-pulse-green" />
              </div>
              <Typography.Body className="font-medium">Cost Reduction</Typography.Body>
              <Typography.Small className="text-muted-foreground">
                Reduce claims processing costs by 35% with automated workflows
              </Typography.Small>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-lg bg-beacon-blue/20 flex items-center justify-center">
                <Clock className="w-8 h-8 text-beacon-blue" />
              </div>
              <Typography.Body className="font-medium">Faster Processing</Typography.Body>
              <Typography.Small className="text-muted-foreground">
                Claims processed in real-time with instant approval for covered services
              </Typography.Small>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-lg bg-metallic-silver/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-metallic-silver" />
              </div>
              <Typography.Body className="font-medium">Better Coverage</Typography.Body>
              <Typography.Small className="text-muted-foreground">
                Enhanced customer satisfaction with premium roadside services
              </Typography.Small>
            </div>
          </div>
        </Card>
      </Motion.SlideInUp>
    </div>
  );
};

export default InsurancePartnership;