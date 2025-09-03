import React, { useState } from 'react';
import { Download, Share, DollarSign, Shield, Calendar, CheckCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReceiptData {
  id: string;
  serviceType: string;
  date: Date;
  provider: {
    name: string;
    company: string;
    license: string;
  };
  location: string;
  cost: {
    subtotal: number;
    membershipDiscount: number;
    credits: number;
    taxes: number;
    total: number;
  };
  payment: {
    method: string;
    last4?: string;
    transactionId: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    coverage: number;
  };
}

interface PremiumReceiptProps {
  receipt: ReceiptData;
  onDownload?: () => void;
  onShare?: () => void;
  onEmail?: () => void;
}

const PremiumReceipt: React.FC<PremiumReceiptProps> = ({
  receipt,
  onDownload,
  onShare,
  onEmail
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleDownload = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    onDownload?.();
  };

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'towing':
        return '🚛';
      case 'jump start':
        return '⚡';
      case 'tire change':
        return '🛞';
      case 'fuel delivery':
        return '⛽';
      case 'lockout':
        return '🔑';
      default:
        return '🔧';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Premium Receipt Card */}
      <div className={`relative overflow-hidden rounded-2xl transition-all duration-500 ${
        isAnimating ? 'scale-105 shadow-luxury' : 'shadow-tech'
      }`}>
        {/* Metallic shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-metallic-silver/5 via-electric-blue/5 to-neon-green/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        
        {/* Main content */}
        <div className="relative bg-midnight-black/95 backdrop-blur-xl border border-metallic-silver/30 p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-electric-blue" />
            </div>
            <h2 className="font-guardian text-2xl text-foreground mb-2">Service Complete</h2>
            <p className="text-muted-foreground font-tech">Receipt #{receipt.id}</p>
          </div>

          {/* Service Summary */}
          <div className="mb-6 p-4 bg-asphalt-gray/30 rounded-xl border border-border/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getServiceIcon(receipt.serviceType)}</span>
                <div>
                  <h3 className="font-guardian text-lg text-foreground">{receipt.serviceType}</h3>
                  <p className="text-muted-foreground text-sm">{receipt.date.toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-tech text-2xl text-neon-green">{formatCurrency(receipt.cost.total)}</p>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center mb-1">
                <Truck className="w-4 h-4 mr-2" />
                {receipt.provider.name} • {receipt.provider.company}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {receipt.location}
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-6">
            <h4 className="font-tech text-foreground mb-3">Cost Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee:</span>
                <span className="text-foreground">{formatCurrency(receipt.cost.subtotal)}</span>
              </div>
              
              {receipt.cost.membershipDiscount > 0 && (
                <div className="flex justify-between">
                  <span className="text-neon-green">Membership Discount:</span>
                  <span className="text-neon-green">-{formatCurrency(receipt.cost.membershipDiscount)}</span>
                </div>
              )}
              
              {receipt.cost.credits > 0 && (
                <div className="flex justify-between">
                  <span className="text-electric-blue">Credits Applied:</span>
                  <span className="text-electric-blue">-{formatCurrency(receipt.cost.credits)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxes & Fees:</span>
                <span className="text-foreground">{formatCurrency(receipt.cost.taxes)}</span>
              </div>
              
              <div className="flex justify-between border-t border-border/30 pt-2 font-tech">
                <span className="text-foreground font-guardian">Total Paid:</span>
                <span className="text-foreground font-guardian">{formatCurrency(receipt.cost.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6 p-3 bg-electric-blue/10 rounded-lg border border-electric-blue/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-electric-blue mr-2" />
                <span className="font-tech text-sm text-foreground">
                  {receipt.payment.method}
                  {receipt.payment.last4 && ` •••• ${receipt.payment.last4}`}
                </span>
              </div>
              <span className="text-xs text-electric-blue font-tech">
                {receipt.payment.transactionId}
              </span>
            </div>
          </div>

          {/* Insurance Coverage */}
          <div className="mb-6 p-3 bg-neon-green/10 rounded-lg border border-neon-green/20">
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-neon-green mr-2" />
              <div className="flex-1">
                <span className="font-tech text-sm text-foreground">
                  Insured by {receipt.insurance.provider}
                </span>
                <p className="text-xs text-neon-green">
                  Coverage up to {formatCurrency(receipt.insurance.coverage)} • Policy: {receipt.insurance.policyNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              className={`flex-1 font-guardian ${
                isAnimating 
                  ? 'bg-neon-green text-midnight-black animate-pulse' 
                  : 'emergency-cta'
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              {isAnimating ? 'Downloaded!' : 'Download PDF'}
            </Button>
            
            <Button
              onClick={onShare}
              variant="outline"
              className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
            >
              <Share className="w-4 h-4" />
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border/30 text-center">
            <p className="text-xs text-muted-foreground mb-2">
              Thank you for choosing Roadside
            </p>
            <p className="text-xs text-electric-blue font-tech">
              Need help? Call support: (555) ROADSIDE
            </p>
          </div>
        </div>

        {/* Glowing edge effect */}
        <div className="absolute inset-0 rounded-2xl border border-metallic-silver/20 pointer-events-none" />
      </div>
    </div>
  );
};

export default PremiumReceipt;