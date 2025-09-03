import React, { useState } from 'react';
import { Shield, DollarSign, FileText, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InsuranceCoverageProps {
  coverage: {
    amount: number;
    provider: string;
    policyNumber: string;
    validUntil: string;
  };
  serviceCost: number;
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
}

const InsuranceCoverage: React.FC<InsuranceCoverageProps> = ({
  coverage,
  serviceCost,
  onAccept,
  onDecline,
  isVisible
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-midnight-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-electric-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-electric-blue" />
          </div>
          <h2 className="font-guardian text-2xl text-foreground mb-2">
            You're Protected
          </h2>
          <p className="text-muted-foreground">
            This service is fully insured and guaranteed
          </p>
        </div>

        {/* Insurance Card */}
        <div className="relative mb-6">
          {/* Holographic shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-blue/10 to-transparent animate-emergency-slide rounded-2xl" />
          
          <div className="relative tech-surface rounded-2xl p-6 border border-electric-blue/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-electric-blue mr-3" />
                <h3 className="font-guardian text-lg text-foreground">Coverage Active</h3>
              </div>
              <CheckCircle className="w-5 h-5 text-neon-green" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Coverage Amount:</span>
                <span className="font-tech text-lg text-neon-green">
                  ${coverage.amount.toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service Cost:</span>
                <span className="font-tech text-foreground">
                  ${serviceCost}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-tech text-foreground">
                  {coverage.provider}
                </span>
              </div>
            </div>

            {/* Coverage Status */}
            <div className="mt-4 p-3 bg-neon-green/10 rounded-lg border border-neon-green/20">
              <div className="flex items-center text-neon-green">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-tech text-sm">Fully Covered</span>
              </div>
              <p className="text-neon-green/80 text-xs mt-1">
                If anything goes wrong, we've got you covered
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee Promise */}
        <div className="mb-6 text-center">
          <h3 className="font-guardian text-lg text-foreground mb-2">
            Roadside Guarantee
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-muted-foreground">
              ✓ Verified provider with clean background check
            </p>
            <p className="text-muted-foreground">
              ✓ Service quality guaranteed or money back
            </p>
            <p className="text-muted-foreground">
              ✓ Insurance coverage for any damages
            </p>
          </div>
        </div>

        {/* Details Toggle */}
        {!showDetails ? (
          <Button
            variant="ghost"
            onClick={() => setShowDetails(true)}
            className="w-full mb-4 text-muted-foreground hover:text-foreground"
          >
            <Info className="w-4 h-4 mr-2" />
            View Policy Details
          </Button>
        ) : (
          <div className="mb-4 p-4 tech-surface rounded-xl animate-fade-in">
            <h4 className="font-tech text-foreground mb-2">Policy Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Policy #:</span>
                <span className="text-foreground font-mono">{coverage.policyNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valid Until:</span>
                <span className="text-foreground">{coverage.validUntil}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowDetails(false)}
              className="w-full mt-2 text-muted-foreground hover:text-foreground"
            >
              Hide Details
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onAccept}
            className="flex-1 emergency-cta font-guardian"
          >
            <Shield className="w-4 h-4 mr-2" />
            Proceed with Coverage
          </Button>
          <Button
            onClick={onDecline}
            variant="outline"
            className="border-border hover:border-emergency-red/50 text-muted-foreground hover:text-emergency-red"
          >
            Decline
          </Button>
        </div>

        {/* Fine Print */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            No hidden fees. No surprises. Just peace of mind.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCoverage;