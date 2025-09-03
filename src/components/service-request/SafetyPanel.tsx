import React from 'react';
import { Shield, Phone, X, AlertTriangle, Share } from 'lucide-react';
import { ServiceRequest } from '../ServiceRequestFlow';

interface SafetyPanelProps {
  serviceRequest: ServiceRequest;
  onClose: () => void;
}

const SafetyPanel: React.FC<SafetyPanelProps> = ({ serviceRequest, onClose }) => {
  const handleEmergencyCall = () => {
    window.location.href = 'tel:911';
  };

  const handleSupportCall = () => {
    window.location.href = 'tel:18005551234';
  };

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Location - Roadside Service',
        text: `I am receiving roadside assistance at ${serviceRequest.location.address}. Provider: ${serviceRequest.provider?.name}`,
        url: `https://maps.google.com/?q=${serviceRequest.location.lat},${serviceRequest.location.lng}`
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-midnight-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative w-full bg-gradient-to-b from-asphalt-gray to-midnight-black border-t border-border/50 rounded-t-3xl p-6 animate-slide-in-up">
        {/* Handle */}
        <div className="w-12 h-1 bg-metallic-silver/30 rounded-full mx-auto mb-6"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-neon-green" />
            <h3 className="font-guardian text-xl text-foreground">Safety & Support</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-metallic-silver/10 hover:bg-metallic-silver/20 transition-colors"
          >
            <X className="w-5 h-5 text-metallic-silver" />
          </button>
        </div>
        
        {/* Emergency Actions */}
        <div className="space-y-4 mb-6">
          <button 
            onClick={handleEmergencyCall}
            className="w-full p-4 rounded-xl bg-emergency-red/20 border border-emergency-red/30 hover:bg-emergency-red/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emergency-red flex items-center justify-center">
                <Phone className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-emergency-red font-guardian text-lg">Emergency: 911</div>
                <div className="text-muted-foreground text-sm">Life-threatening emergencies only</div>
              </div>
            </div>
          </button>
          
          <button 
            onClick={handleSupportCall}
            className="w-full p-4 rounded-xl bg-electric-blue/20 border border-electric-blue/30 hover:bg-electric-blue/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-electric-blue flex items-center justify-center">
                <Shield className="w-6 h-6 text-foreground" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-electric-blue font-guardian text-lg">Roadside Support</div>
                <div className="text-muted-foreground text-sm">24/7 assistance and safety concerns</div>
              </div>
            </div>
          </button>
        </div>
        
        {/* Location Sharing */}
        <div className="mb-6">
          <h4 className="text-foreground font-tech mb-3">Share Your Location</h4>
          <button 
            onClick={handleShareLocation}
            className="w-full p-4 rounded-xl tech-surface border border-neon-green/30 hover:border-neon-green/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center">
                <Share className="w-6 h-6 text-neon-green" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-neon-green font-tech">Send Live Location</div>
                <div className="text-muted-foreground text-sm">Share with family or friends</div>
              </div>
            </div>
          </button>
        </div>
        
        {/* Provider Verification */}
        <div className="mb-6 p-4 rounded-xl bg-metallic-silver/5 border border-metallic-silver/20">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-metallic-silver" />
            <span className="text-foreground font-tech">Provider Verification</span>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Verify provider matches profile photo</p>
            <p>• Confirm vehicle details: {serviceRequest.provider?.vehicle}</p>
            <p>• Provider should show valid ID and credentials</p>
            <p>• Trust your instincts - contact support if anything feels wrong</p>
          </div>
        </div>
        
        {/* Safety Tips */}
        <div className="p-4 rounded-xl bg-neon-green/5 border border-neon-green/20">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-neon-green" />
            <span className="text-neon-green text-sm font-tech">Your Safety Matters</span>
          </div>
          <p className="text-muted-foreground text-sm">
            All Roadside providers are background-checked and insured. 
            If you feel unsafe at any time, contact our support team immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyPanel;